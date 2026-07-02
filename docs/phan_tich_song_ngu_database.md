# Phân tích Thiết kế Đa ngôn ngữ (Bilingual) cho Cơ sở dữ liệu (DynamoDB)

Tài liệu này phân tích các phương án thiết kế cấu trúc dữ liệu trên **Amazon DynamoDB** để hỗ trợ song ngữ (Tiếng Việt & Tiếng Anh) cho danh mục sản phẩm, đồng thời đưa ra đề xuất tối ưu nhất cho dự án **Music Instrument Store**.

---

## 1. Các phương án thiết kế dữ liệu đa ngôn ngữ trên DynamoDB

### Phương án 1: Thêm thuộc tính hậu tố ngôn ngữ (Attribute Suffix)
Tách các trường cần dịch thành các thuộc tính riêng biệt bằng cách thêm mã ngôn ngữ ở cuối tên thuộc tính. các thuộc tính không cần dịch (giá, ảnh, thương hiệu) được giữ nguyên.

* **Cấu trúc bản ghi (Item)**:
  ```json
  {
    "PK": "PRODUCT#yas280",
    "SK": "METADATA",
    "id": "yas280",
    "price": 24500000,
    "brand": "Yamaha",
    "imageUrl": "/images/yas280.jpg",
    "name_vi": "Kèn Saxophone Alto Yamaha YAS-280",
    "name_en": "Yamaha YAS-280 Alto Saxophone",
    "description_vi": "Thiết kế hoàn hảo cho người mới bắt đầu học thổi kèn...",
    "description_en": "Perfect design for beginners starting their journey..."
  }
  ```

* **Ưu điểm**:
  * **Hiệu năng cao (Low Latency)**: Chỉ cần 1 lần đọc (`GetCommand`) là lấy được đầy đủ thông tin của cả hai ngôn ngữ.
  * **Đơn giản**: Logic API chỉ cần đọc ngôn ngữ từ request header/query và trả về thuộc tính tương ứng (ví dụ: `name = item["name_" + lang]`).
  * Ghi dữ liệu hoặc cập nhật dễ dàng trong 1 lệnh duy nhất.

* **Nhược điểm**:
  * Không linh hoạt nếu sau này muốn mở rộng thêm ngôn ngữ thứ 3 (ví dụ: Nhật Bản `ja`, Hàn Quốc `ko`) vì phải thay đổi cấu trúc bảng (schema) và code của API.

---

### Phương án 2: Sử dụng thuộc tính dạng bản đồ (Map Attribute)
Gộp các bản dịch vào một đối tượng JSON Map có khóa là mã ngôn ngữ.

* **Cấu trúc bản ghi (Item)**:
  ```json
  {
    "PK": "PRODUCT#yas280",
    "SK": "METADATA",
    "id": "yas280",
    "price": 24500000,
    "brand": "Yamaha",
    "imageUrl": "/images/yas280.jpg",
    "name": {
      "vi": "Kèn Saxophone Alto Yamaha YAS-280",
      "en": "Yamaha YAS-280 Alto Saxophone"
    },
    "description": {
      "vi": "Thiết kế hoàn hảo cho người mới bắt đầu học thổi kèn...",
      "en": "Perfect design for beginners starting their journey..."
    }
  }
  ```

* **Ưu điểm**:
  * **Thiết kế sạch sẽ**: Gom cụm các bản dịch giúp dữ liệu gọn gàng.
  * **Khả năng mở rộng ngôn ngữ động**: Khi thêm ngôn ngữ mới, chỉ cần thêm cặp key-value vào Map mà không làm thay đổi cấu trúc thuộc tính gốc của sản phẩm.

* **Nhược điểm**:
  * Khó kiểm soát việc cập nhật riêng lẻ một ngôn ngữ nếu nhiều quản trị viên cùng thao tác ghi đồng thời (cần sử dụng DynamoDB Expressions phức tạp).

---

### Phương án 3: Lưu trữ bản ghi ngôn ngữ riêng biệt (Sort Key Polymorphism)
Tách thông tin sản phẩm thành các bản ghi riêng trong cùng một item collection (sử dụng thế mạnh Single Table Design của DynamoDB).

* **Cấu trúc dữ liệu**:
  * **Bản ghi thông số chung** (`SK = METADATA`):
    ```json
    { "PK": "PRODUCT#yas280", "SK": "METADATA", "price": 24500000, "brand": "Yamaha", "imageUrl": "..." }
    ```
  * **Bản ghi Tiếng Việt** (`SK = LANG#vi`):
    ```json
    { "PK": "PRODUCT#yas280", "SK": "LANG#vi", "name": "Kèn Saxophone Alto Yamaha YAS-280", "description": "..." }
    ```
  * **Bản ghi Tiếng Anh** (`SK = LANG#en`):
    ```json
    { "PK": "PRODUCT#yas280", "SK": "LANG#en", "name": "Yamaha YAS-280 Alto Saxophone", "description": "..." }
    ```

* **Ưu điểm**:
  * Thiết kế chuẩn NoSQL thế giới. Kích thước mỗi bản ghi nhỏ gọn, dễ tối ưu hóa hiệu suất đọc ghi.
  * Thêm vô hạn ngôn ngữ mà không lo vượt giới hạn dung lượng 400KB của một Item trong DynamoDB.

* **Nhược điểm**:
  * **Chi phí cao hơn**: Để hiển thị một sản phẩm, API phải gọi `QueryCommand` để lấy cả bản ghi `METADATA` và bản ghi ngôn ngữ mong muốn (tiêu tốn nhiều Read Capacity Units - RCU hơn).
  * Logic ghi/sửa phức tạp (cần dùng DynamoDB Transactions để đảm bảo tính nhất quán dữ liệu).

---

## 2. Giải pháp thực tế tối ưu cho dự án hiện tại

Dựa trên định vị dự án là **Cửa hàng nhạc cụ cao cấp phục vụ tại thị trường Việt Nam (có hỗ trợ tiếng Anh cho người nước ngoài sinh sống tại đây)**, chúng ta có các giải pháp sau:

### Đề xuất 1: Giải pháp thực tế & nhanh nhất (Không cần sửa Database/API)
Nhạc cụ cao cấp (như kèn Saxophone Yamaha, Selmer,...) hầu hết sử dụng tên quốc tế và cả khách hàng Việt Nam hay người nước ngoài đều tìm kiếm theo tên này.
* **Cách thực hiện**:
  * Giữ nguyên thuộc tính `name` dưới dạng tên chuẩn quốc tế (ví dụ: *Yamaha YAS-280 Alto Saxophone*).
  * Đối với phần mô tả (`description`), viết gộp cả tiếng Việt và tiếng Anh trong cùng một đoạn văn, phân cách bằng dấu gạch ngang hoặc tiêu đề nhỏ.
  * **Ví dụ mô tả**:
    ```text
    [VI] Kèn Saxophone Alto Yamaha YAS-280 là lựa chọn hoàn hảo cho người mới bắt đầu...
    ---
    [EN] The Yamaha YAS-280 Alto Saxophone is the perfect choice for beginners...
    ```
* **Tại sao tối ưu?**: Giải pháp này có **chi phí phát triển = 0**, không làm tăng độ phức tạp của Database/API, không cần migration dữ liệu cũ, đồng thời hiển thị song ngữ đầy đủ cho khách hàng.

### Đề xuất 2: Giải pháp cấu trúc kỹ thuật (Nếu bắt buộc phải tách biệt dữ liệu trong database)
Nếu bạn muốn hệ thống có cấu trúc hoàn chỉnh và hiển thị giao diện thuần Việt/thuần Anh riêng biệt:
* **Khuyên dùng**: Sử dụng **Phương án 1 (Attribute Suffix: `name_vi`, `name_en`)** hoặc **Phương án 2 (Map Attribute)**.
* **Lý do**:
  * Quy mô cửa hàng nhạc cụ có số lượng sản phẩm không quá lớn (dưới vài ngàn sản phẩm). Kích thước bản ghi sản phẩm nhỏ nên việc gộp chung bản dịch vào một item giúp tăng tốc độ phản hồi tối đa cho API.
  * Tránh được việc thực hiện các truy vấn truy xuất phức tạp (như Phương án 3).

---

## 3. Khuyến nghị hành động tiếp theo
Bạn hãy xem xét hai đề xuất trên:
1. Nếu muốn triển khai nhanh chóng và tập trung vào trải nghiệm khách hàng nhanh nhất, hãy chọn **Đề xuất 1** (Viết gộp mô tả song ngữ vào trường text hiện tại).
2. Nếu muốn tối ưu hóa cấu trúc database để sau này làm hệ thống lớn, hãy phản hồi lại để tôi tiến hành sửa đổi API Lambda tại [services/product-api/index.ts](file:///E:/Project/repo/music-instrument-store/services/product-api/index.ts) và scripts seed dữ liệu theo **Phương án 2 (Map Attribute)**.
