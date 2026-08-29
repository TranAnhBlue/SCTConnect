# 📚 TÀI LIỆU DANH SÁCH API DỰ ÁN SCTCONNECT
> 🎯 **Mục tiêu cốt lõi:** Nền tảng Số Tiếp nhận, Phân loại & Tổng hợp Ý kiến Dân nguyện Nhân dân cấp Xã (SCTConnect).
> 🏛️ **Bản chất nghiệp vụ:** Hòm thư tiếp nhận ý kiến số của Mặt trận Tổ quốc (`FF` - Fatherland Front) & các Hội đoàn thể — Xác nhận tiếp nhận ghi nhận (`received`) để phục vụ tổng hợp báo cáo Đảng ủy / HĐND / UBND Xã.

---

# 🚀 DANH SÁCH 28 APIS THỰC CHIẾN CỦA TOÀN BỘ HỆ THỐNG

---

## 1️⃣ PHÂN HỆ XÁC THỰC & HỒ SƠ CÁ NHÂN (`/api/v1/auth` — 6 APIs)

* `POST /api/v1/auth/register` — **Đăng ký tài khoản công dân mới**
  * *Quyền hạn:* `Public`
  * *Body:* `{ "phone": "0988123456", "fullName": "Nguyễn Văn An", "villageId": "uuid", "password": "Password@123", "confirmPassword": "Password@123" }`

* `POST /api/v1/auth/login` — **Đăng nhập hệ thống**
  * *Quyền hạn:* `Public`
  * *Body:* `{ "phone": "0988123456", "password": "Password@123" }`

* `POST /api/v1/auth/refresh-token` — **Làm mới phiên làm việc**
  * *Quyền hạn:* `Public`
  * *Body:* `{ "refreshToken": "..." }`

* `GET /api/v1/auth/me` — **Lấy thông tin hồ sơ tài khoản đang đăng nhập**
  * *Quyền hạn:* `Bearer (Mọi tài khoản đã đăng nhập)`

* `PATCH /api/v1/auth/profile` — **Cập nhật thông tin hồ sơ cá nhân**
  * *Quyền hạn:* `Bearer (Mọi tài khoản đã đăng nhập)`
  * *Body:* `{ "fullName": "Nguyễn Văn An Mới", "villageId": "uuid-cua-thon-2" }`

* `PATCH /api/v1/auth/change-password` — **Đổi mật khẩu cá nhân**
  * *Quyền hạn:* `Bearer (Mọi tài khoản đã đăng nhập)`
  * *Body:* `{ "oldPassword": "...", "newPassword": "...", "confirmNewPassword": "..." }`

---

## 2️⃣ PHÂN HỆ QUẢN TRỊ TÀI KHOẢN TOÀN XÃ (`/api/v1/users` — 4 APIs)

* `GET /api/v1/users` — **Lấy danh sách người dùng toàn xã**
  * *Quyền hạn:* `Bearer (Chỉ Admin Kỹ thuật)`

* `GET /api/v1/users/:id` — **Xem chi tiết hồ sơ một người dùng**
  * *Quyền hạn:* `Bearer (Chỉ Admin Kỹ thuật)`
  * *Params:* `:id` (UUID)

* `PATCH /api/v1/users/:id/status` — **Khóa hoặc mở khóa tài khoản**
  * *Quyền hạn:* `Bearer (Chỉ Admin Kỹ thuật)`
  * *Params:* `:id` (UUID), *Body:* `{ "isActive": boolean }`

* `PATCH /api/v1/users/:id/role` — **Gán vai trò Cán bộ / Phân quyền & chỉ định Hội tiếp nhận**
  * *Quyền hạn:* `Bearer (Chỉ Admin Kỹ thuật)`
  * *Params:* `:id` (UUID), *Body:* `{ "userType": "officer", "organizationId": "uuid-cua-hoi" }`

---

## 3️⃣ PHÂN HỆ DANH MỤC THÔN / TỔ DÂN PHỐ (`/api/v1/villages` — 3 APIs)

* `GET /api/v1/villages` — **Lấy danh sách các Thôn / Tổ dân phố toàn xã**
  * *Quyền hạn:* `Public`
  * *Query:* `?search=`

* `POST /api/v1/villages` — **Tạo mới một Thôn / Tổ dân phố**
  * *Quyền hạn:* `Bearer (Chỉ Admin)`
  * *Body:* `{ "code": "THON_5", "name": "Thôn 5" }`

* `PATCH /api/v1/villages/:id` — **Cập nhật thông tin Thôn / Tổ dân phố**
  * *Quyền hạn:* `Bearer (Chỉ Admin)`
  * *Params:* `:id` (UUID), *Body:* `{ "name": "Thôn 5 Mới", "isActive": true }`

---

## 4️⃣ PHÂN HỆ DANH MỤC HỘI ĐOÀN THỂ TIẾP NHẬN (`/api/v1/organizations` — 3 APIs)

* `GET /api/v1/organizations` — **Lấy danh mục các Hội đoàn thể tiếp nhận**
  * *Quyền hạn:* `Public`
  * *Query:* `?search=&type=&isActive=true`

* `POST /api/v1/organizations` — **Tạo mới một Hội / Tổ chức tiếp nhận**
  * *Quyền hạn:* `Bearer (Chỉ Admin)`
  * *Body:* `{ "code": "RED_CROSS", "name": "Hội Chữ thập đỏ Xã", "type": "union" }`

* `PATCH /api/v1/organizations/:id` — **Cập nhật thông tin Hội / Tổ chức tiếp nhận**
  * *Quyền hạn:* `Bearer (Chỉ Admin)`
  * *Params:* `:id` (UUID), *Body:* `{ "name": "Hội Chữ thập đỏ Xã Mới", "type": "union", "isActive": true }`

---

## 5️⃣ PHÂN HỆ DANH MỤC LĨNH VỰC PHẢN ÁNH (`/api/v1/categories` — 3 APIs)

* `GET /api/v1/categories` — **Lấy danh mục các lĩnh vực phản ánh dân nguyện đang hoạt động**
  * *Quyền hạn:* `Public`
  * *Query:* `?search=`

* `POST /api/v1/categories` — **Tạo mới một lĩnh vực phản ánh**
  * *Quyền hạn:* `Bearer (Chỉ Admin)`
  * *Body:* `{ "code": "ENVIRONMENT", "name": "Môi trường, rác thải, ô nhiễm", "description": "..." }`

* `PATCH /api/v1/categories/:id` — **Chỉnh sửa / Bật tắt lĩnh vực phản ánh**
  * *Quyền hạn:* `Bearer (Chỉ Admin)`
  * *Params:* `:id` (UUID), *Body:* `{ "name": "Môi trường & Rác thải", "isActive": true }`

---

## 6️⃣ PHÂN HỆ TRỌNG TÂM: TIẾP NHẬN PHẢN ÁNH NHÂN DÂN (`/api/v1/feedbacks` — 6 APIs)

### 📱 Dành Riêng Cho Người Dân (Mobile App):
* `POST /api/v1/feedbacks` — **Công dân gửi phản ánh hiện trường**
  * *Quyền hạn:* `Bearer (Công dân)`
  * *Body:*
    ```json
    {
      "targetOrganizationId": "uuid-cua-hoi-tiep-nhan",
      "incidentVillageId": "uuid-cua-thon-xay-ra-su-viec",
      "categoryId": "uuid-cua-linh-vuc-phan-anh",
      "address": "Gần cổng trường Tiểu học",
      "title": "Bãi rác tự phát bốc mùi hôi thối",
      "content": "Tại đoạn mương Thôn 1 có đống rác lớn nhiều ngày chưa dọn...",
      "attachments": ["https://sctconnect.vn/uploads/uuid.jpg"]
    }
    ```

* `GET /api/v1/feedbacks/me` — **Công dân xem danh sách phản ánh của chính mình**
  * *Quyền hạn:* `Bearer (Công dân)`
  * *Query:* `?page=1&limit=20&status=pending|received|rejected&categoryId=&search=`

* `GET /api/v1/feedbacks/me/:id` — **Công dân xem chi tiết 1 phản ánh của mình**
  * *Quyền hạn:* `Bearer (Công dân)`
  * *Params:* `:id` (UUID)

### 🏛️ Dành Riêng Cho Cán Bộ Hội & MTTQ Xã:
* `GET /api/v1/feedbacks` — **Cán bộ xem danh sách phản ánh**
  * *Quyền hạn:* `Bearer (Cán bộ / Admin)`
  * *Query:* `?page=1&limit=20&targetOrganizationId=&incidentVillageId=&categoryId=&status=&fromDate=&toDate=&search=`

* `GET /api/v1/feedbacks/:id` — **Cán bộ xem chi tiết nội dung và ảnh hiện trường**
  * *Quyền hạn:* `Bearer (Cán bộ / Admin)`
  * *Params:* `:id` (UUID)

* `PATCH /api/v1/feedbacks/:id/status` — **Cán bộ 1-Click tiếp nhận hoặc từ chối phản ánh**
  * *Quyền hạn:* `Bearer (Cán bộ / Admin)`
  * *Params:* `:id` (UUID), *Body:* `{ "status": "received" | "rejected" }`

---

## 7️⃣ PHÂN HỆ BÁO CÁO DÂN NGUYỆN CẤP XÃ (`/api/v1/feedbacks/statistics` — 1 API)

* `GET /api/v1/feedbacks/statistics` — **Báo cáo tổng hợp số liệu dân nguyện toàn xã**
  * *Quyền hạn:* `Bearer (Chỉ Cán bộ MTTQ Xã - FF hoặc Admin)`
  * *Query:* `?fromDate=&toDate=&incidentVillageId=&targetOrganizationId=&categoryId=`

---

## 8️⃣ PHÂN HỆ TẢI TỆP & DỌN DẸP LƯU TRỮ (`/api/v1/uploads` — 2 APIs)

* `POST /api/v1/uploads/image` — **Tải ảnh hiện trường từ điện thoại lên máy chủ (Tối đa 5MB/ảnh, 25MB/ngày/user)**
  * *Quyền hạn:* `Bearer (Mọi tài khoản đã đăng nhập)`
  * *Form-data:* `file` (Ảnh JPEG/PNG/WEBP/HEIC)

* `POST /api/v1/uploads/cleanup` — **Kích hoạt dọn dẹp thủ công các tệp ảnh mồ côi quá 24 giờ**
  * *Quyền hạn:* `Bearer (Chỉ Admin)`

---

# 💎 BẢNG TỔNG HỢP 28 APIS

| STT | Phương Thức | Endpoint | Quyền Hạn | Mô Tả Nghiệp Vụ |
| :---: | :--- | :--- | :---: | :--- |
| 1 | `POST` | `/api/v1/auth/register` | `Public` | Dân đăng ký tài khoản mới kèm chọn Thôn |
| 2 | `POST` | `/api/v1/auth/login` | `Public` | Đăng nhập hệ thống (Dân, Cán bộ, Admin) |
| 3 | `POST` | `/api/v1/auth/refresh-token` | `Public` | Làm mới phiên đăng nhập |
| 4 | `GET` | `/api/v1/auth/me` | `Bearer` | Lấy hồ sơ tài khoản đang đăng nhập |
| 5 | `PATCH`| `/api/v1/auth/profile` | `Bearer` | Cập nhật thông tin hồ sơ cá nhân |
| 6 | `PATCH`| `/api/v1/auth/change-password` | `Bearer` | Đổi mật khẩu cá nhân |
| 7 | `GET` | `/api/v1/users` | `Admin` | Quản lý danh sách người dùng toàn xã |
| 8 | `GET` | `/api/v1/users/:id` | `Admin` | Xem chi tiết hồ sơ một người dùng |
| 9 | `PATCH`| `/api/v1/users/:id/status` | `Admin` | Khóa / Mở khóa tài khoản người dùng |
| 10 | `PATCH`| `/api/v1/users/:id/role` | `Admin` | Gán vai trò Cán bộ & chỉ định Hội tiếp nhận |
| 11 | `GET` | `/api/v1/villages` | `Public` | Danh mục Thôn / Tổ dân phố |
| 12 | `POST` | `/api/v1/villages` | `Admin` | Thêm Thôn / Tổ dân phố mới |
| 13 | `PATCH`| `/api/v1/villages/:id` | `Admin` | Cập nhật tên / Bật tắt Thôn / TDP |
| 14 | `GET` | `/api/v1/organizations` | `Public` | Danh mục Hội đoàn thể tiếp nhận phẳng |
| 15 | `POST` | `/api/v1/organizations` | `Admin` | Thêm Hội / Đơn vị tiếp nhận mới |
| 16 | `PATCH`| `/api/v1/organizations/:id` | `Admin` | Cập nhật thông tin / Bật tắt Hội tiếp nhận |
| 17 | `GET` | `/api/v1/categories` | `Public` | Lấy danh mục lĩnh vực phản ánh |
| 18 | `POST` | `/api/v1/categories` | `Admin` | Thêm lĩnh vực phản ánh mới |
| 19 | `PATCH`| `/api/v1/categories/:id` | `Admin` | Sửa / Bật tắt lĩnh vực phản ánh |
| 20 | `POST` | `/api/v1/feedbacks` | `Citizen` | Dân gửi phản ánh ý kiến hiện trường |
| 21 | `GET` | `/api/v1/feedbacks/me` | `Citizen` | Dân xem danh sách phản ánh của mình |
| 22 | `GET` | `/api/v1/feedbacks/me/:id` | `Citizen` | Dân xem chi tiết 1 phản ánh của mình |
| 23 | `GET` | `/api/v1/feedbacks` | `Officer/Admin` | Cán bộ xem phản ánh (MTTQ xem 100%, Hội xem Hội mình) |
| 24 | `GET` | `/api/v1/feedbacks/:id` | `Officer/Admin` | Cán bộ xem chi tiết + ảnh hiện trường |
| 25 | `PATCH`| `/api/v1/feedbacks/:id/status` | `Officer/Admin` | Cán bộ 1-Click tiếp nhận / từ chối |
| 26 | `GET` | `/api/v1/feedbacks/statistics` | `MTTQ/Admin` | Báo cáo dân nguyện toàn xã cho Đảng ủy / HĐND / UBND |
| 27 | `POST` | `/api/v1/uploads/image` | `Bearer` | Tải ảnh hiện trường lên máy chủ |
| 28 | `POST` | `/api/v1/uploads/cleanup` | `Admin` | Kích hoạt dọn dẹp ảnh mồ côi thủ công |
