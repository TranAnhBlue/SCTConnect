# 📚 DANH SÁCH API DỰ ÁN SCTCONNECT

---

## 1. Auth & Users (16 APIs)

### Authentication
* `POST /api/v1/auth/register` — Đăng ký tài khoản công dân
* `POST /api/v1/auth/login` — Đăng nhập hệ thống
* `POST /api/v1/auth/refresh-token` — Làm mới Access Token
* `POST /api/v1/auth/logout` — Đăng xuất & hủy token thiết bị
* `POST /api/v1/auth/forgot-password` — Yêu cầu OTP quên mật khẩu
* `POST /api/v1/auth/reset-password` — Đặt lại mật khẩu mới
* `PATCH /api/v1/auth/change-password` — Đổi mật khẩu cá nhân
* `GET /api/v1/auth/me` — Lấy thông tin tài khoản đang đăng nhập

### Users
* `GET /api/v1/users` — Danh sách người dùng toàn xã (Admin)
* `GET /api/v1/users/:id` — Chi tiết hồ sơ người dùng
* `PATCH /api/v1/users/:id` — Cập nhật thông tin người dùng (Admin)
* `PATCH /api/v1/users/:id/status` — Khóa / Mở khóa tài khoản (Admin)
* `PATCH /api/v1/users/me` — Cập nhật hồ sơ cá nhân (Họ tên, avatar)
* `POST /api/v1/users/me/avatar` — Upload ảnh đại diện
* `GET /api/v1/users/:id/organizations` — Danh sách tổ chức tham gia
* `GET /api/v1/users/:id/permissions` — Danh sách mã quyền của user

---

## 2. Organizations & RBAC (18 APIs)

### Organizations
* `GET /api/v1/organizations` — Danh sách phẳng các tổ chức, hội đoàn thể
* `GET /api/v1/organizations/tree` — Sơ đồ cây cơ cấu phân cấp toàn xã
* `GET /api/v1/organizations/:id` — Chi tiết tổ chức
* `POST /api/v1/organizations` — Tạo mới tổ chức / Chi hội thôn
* `PATCH /api/v1/organizations/:id` — Cập nhật thông tin tổ chức
* `DELETE /api/v1/organizations/:id` — Xóa tổ chức
* `PATCH /api/v1/organizations/:id/status` — Kích hoạt / Tạm ngưng hoạt động
* `GET /api/v1/organizations/:id/members` — Danh sách cán bộ trong tổ chức
* `POST /api/v1/organizations/:id/members` — Bổ nhiệm cán bộ vào tổ chức
* `PATCH /api/v1/organizations/:id/members/:memberId` — Sửa chức danh / vai trò cán bộ
* `DELETE /api/v1/organizations/:id/members/:memberId` — Miễn nhiệm / Gỡ cán bộ

### Roles & Permissions
* `GET /api/v1/roles` — Danh sách các vai trò hệ thống
* `GET /api/v1/roles/:id` — Chi tiết vai trò
* `POST /api/v1/roles` — Tạo mới vai trò tùy biến
* `PATCH /api/v1/roles/:id` — Sửa tên, mô tả vai trò
* `DELETE /api/v1/roles/:id` — Xóa vai trò tùy biến
* `GET /api/v1/roles/:id/permissions` — Danh sách quyền của vai trò
* `PUT /api/v1/roles/:id/permissions` — Gán lại danh sách quyền cho vai trò
* `GET /api/v1/permissions` — Danh mục tất cả mã quyền hệ thống
* `GET /api/v1/permissions/:id` — Chi tiết một mã quyền

---

## 3. Phản Ánh Hiện Trường (Citizen Feedbacks - 25 APIs)

### Feedback CRUD & Danh Sách
* `GET /api/v1/feedbacks` — Danh sách phản ánh hiện trường (Lọc, tìm kiếm, phân trang)
* `POST /api/v1/feedbacks` — Công dân tạo phản ánh mới
* `GET /api/v1/feedbacks/:id` — Xem chi tiết nội dung phản ánh
* `PATCH /api/v1/feedbacks/:id` — Công dân chỉnh sửa phản ánh (Khi status là `pending`)
* `DELETE /api/v1/feedbacks/:id` — Công dân hủy phản ánh

### Workflow Xử Lý
* `POST /api/v1/feedbacks/:id/assign` — MTTQ Xã phân công tổ chức / cán bộ xử lý
* `POST /api/v1/feedbacks/:id/start` — Cán bộ bắt đầu xử lý tại hiện trường
* `POST /api/v1/feedbacks/:id/resolve` — Hoàn thành xử lý & nộp ảnh kết quả
* `POST /api/v1/feedbacks/:id/reject` — Từ chối phản ánh không hợp lệ
* `POST /api/v1/feedbacks/:id/reopen` — Mở lại phản ánh để xử lý lại

### Tệp Đính Kèm, Bình Luận, Lịch Sử & Đánh Giá
* `GET /api/v1/feedbacks/:id/attachments` — Danh sách ảnh / video hiện trường
* `POST /api/v1/feedbacks/:id/attachments` — Tải thêm ảnh / video cho phản ánh
* `DELETE /api/v1/feedbacks/:id/attachments/:attachmentId` — Xóa tệp đính kèm
* `GET /api/v1/feedbacks/:id/history` — Lịch sử luân chuyển hồ sơ xử lý
* `GET /api/v1/feedbacks/:id/comments` — Danh sách bình luận trao đổi
* `POST /api/v1/feedbacks/:id/comments` — Gửi bình luận làm rõ hiện trường
* `DELETE /api/v1/feedbacks/:id/comments/:commentId` — Xóa bình luận của mình
* `POST /api/v1/feedbacks/:id/rating` — Công dân đánh giá số sao hài lòng (1–5 sao)
* `GET /api/v1/feedbacks/:id/rating` — Xem kết quả đánh giá hài lòng

### Thống Kê & Bản Đồ
* `GET /api/v1/feedbacks/statistics` — Thống kê tổng hợp phản ánh toàn xã
* `GET /api/v1/feedbacks/statistics/by-category` — Thống kê phản ánh theo lĩnh vực
* `GET /api/v1/feedbacks/statistics/by-status` — Thống kê theo trạng thái xử lý
* `GET /api/v1/feedbacks/statistics/by-organization` — Thống kê theo Hội đoàn thể
* `GET /api/v1/feedbacks/statistics/sla` — Thống kê tỷ lệ xử lý đúng hạn SLA
* `GET /api/v1/feedbacks/map` — Tọa độ GPS hiển thị bản đồ số điểm nóng

---

## 4. Tiếp Công Dân & Đơn Thư (Citizen Reception - 15 APIs)

### Reception CRUD
* `GET /api/v1/receptions` — Danh sách phiên tiếp dân / đơn kiến nghị
* `POST /api/v1/receptions` — Công dân đăng ký lịch hẹn tiếp dân / nộp đơn trực tuyến
* `GET /api/v1/receptions/:id` — Chi tiết buổi tiếp dân & kết luận
* `PATCH /api/v1/receptions/:id` — Chỉnh sửa thông tin lịch hẹn (Khi chưa duyệt)
* `DELETE /api/v1/receptions/:id` — Xóa bản ghi tiếp dân

### Workflow Tiếp Dân
* `POST /api/v1/receptions/:id/confirm` — Duyệt lịch hẹn & xếp phòng làm việc
* `POST /api/v1/receptions/:id/complete` — Kết luận buổi tiếp & chỉ đạo xử lý
* `POST /api/v1/receptions/:id/cancel` — Hủy lịch hẹn tiếp dân

### Thành Phần Tham Gia, Đơn Thư & Lịch Trực
* `GET /api/v1/receptions/:id/participants` — Danh sách cán bộ tham gia phiên tiếp
* `POST /api/v1/receptions/:id/participants` — Bổ sung cán bộ vào phiên tiếp
* `PATCH /api/v1/receptions/:id/participants/:participantId` — Cập nhật vai trò cán bộ
* `DELETE /api/v1/receptions/:id/participants/:participantId` — Gỡ cán bộ khỏi phiên tiếp
* `GET /api/v1/receptions/:id/attachments` — Danh sách đơn thư, tài liệu pháp lý đính kèm
* `POST /api/v1/receptions/:id/attachments` — Tải lên đơn thư / biên bản tiếp dân
* `GET /api/v1/receptions/calendar` — Xem lịch tiếp dân theo tháng

---

## 5. Khảo Sát Ý Kiến & Biểu Quyết (Polls & Voting - 14 APIs)

### Poll CRUD & Options
* `GET /api/v1/polls` — Danh sách các cuộc khảo sát / biểu quyết
* `POST /api/v1/polls` — Cán bộ tạo cuộc khảo sát ý kiến nhân dân
* `GET /api/v1/polls/:id` — Chi tiết nội dung biểu quyết & các phương án
* `PATCH /api/v1/polls/:id` — Chỉnh sửa / Gia hạn thời gian biểu quyết
* `DELETE /api/v1/polls/:id` — Xóa cuộc khảo sát
* `POST /api/v1/polls/:id/close` — Khóa biểu quyết sớm trước hạn
* `POST /api/v1/polls/:id/options` — Thêm phương án lựa chọn mới
* `PATCH /api/v1/polls/:id/options/:optionId` — Sửa nội dung phương án
* `DELETE /api/v1/polls/:id/options/:optionId` — Xóa phương án

### Bỏ Phiếu & Thống Kê
* `POST /api/v1/polls/:id/vote` — Công dân bỏ phiếu biểu quyết (1 dân 1 vote)
* `GET /api/v1/polls/:id/my-vote` — Xem lại phương án mình đã vote
* `GET /api/v1/polls/:id/results` — Kết quả số phiếu & tỷ lệ %
* `GET /api/v1/polls/:id/statistics` — Thống kê chi tiết người tham gia
* `GET /api/v1/polls/statistics` — Thống kê mức độ tham gia biểu quyết theo Thôn

---

## 6. Bản Tin Xã & Hoạt Động (Posts & News - 10 APIs)

* `GET /api/v1/posts` — Danh sách bài viết bản tin xã / đoàn thể
* `POST /api/v1/posts` — Cán bộ đăng bài viết mới
* `GET /api/v1/posts/:id` — Đọc chi tiết bài viết (Tự động tăng lượt xem)
* `PATCH /api/v1/posts/:id` — Chỉnh sửa bài viết
* `DELETE /api/v1/posts/:id` — Xóa bài viết
* `POST /api/v1/posts/:id/publish` — Xuất bản bài viết
* `POST /api/v1/posts/:id/unpublish` — Gỡ xuất bản bài viết
* `POST /api/v1/posts/:id/pin` — Ghim bài viết lên đầu trang chủ
* `POST /api/v1/posts/:id/unpin` — Gỡ ghim bài viết
* `POST /api/v1/posts/:id/emergency` — Đánh dấu tin cảnh báo khẩn cấp (Bão lũ, hỏa hoạn)

---

## 7. Thông Báo & Thiết Bị (Notifications & Devices - 9 APIs)

### Notifications
* `GET /api/v1/notifications` — Danh sách thông báo của người dùng
* `GET /api/v1/notifications/:id` — Xem chi tiết thông báo
* `PATCH /api/v1/notifications/:id/read` — Đánh dấu đã đọc một thông báo
* `POST /api/v1/notifications/read-all` — Đánh dấu tất cả thông báo là đã đọc
* `GET /api/v1/notifications/unread-count` — Số lượng thông báo chưa đọc
* `POST /api/v1/notifications/broadcast` — Gửi thông báo khẩn toàn dân (Admin)

### Devices (Push Notification)
* `GET /api/v1/users/me/devices` — Danh sách thiết bị đang đăng nhập
* `POST /api/v1/users/me/devices` — Đăng ký FCM / APNs Token thiết bị
* `DELETE /api/v1/users/me/devices/:id` — Hủy đăng ký thiết bị (Khi logout)

---

## 8. Upload / File Đa Phương Tiện (3 APIs)

* `POST /api/v1/uploads/presigned-url` — Xin URL upload trực tiếp lên S3/MinIO
* `POST /api/v1/uploads/direct` — Upload trực tiếp tệp qua Backend
* `DELETE /api/v1/uploads/:id` — Dọn dẹp tệp mồ côi

---

## 9. Dashboard Thống Kê Điều Hành (5 APIs)

* `GET /api/v1/dashboard/overview` — Bảng chỉ huy tổng quan toàn xã
* `GET /api/v1/dashboard/feedbacks` — Thống kê chuyên sâu phản ánh
* `GET /api/v1/dashboard/receptions` — Thống kê tình hình tiếp dân
* `GET /api/v1/dashboard/polls` — Thống kê mức độ đồng thuận biểu quyết
* `GET /api/v1/dashboard/organizations` — Đánh giá hiệu quả của các Hội đoàn thể

---

## 10. Mobile App Use-Cases (BFF - 6 APIs)

* `GET /api/v1/app/home` — Dữ liệu tổng hợp màn hình chính App (Tin khẩn, tin ghim, poll mở, số thông báo)
* `GET /api/v1/app/my-feedbacks` — Danh sách phản ánh của tôi
* `GET /api/v1/app/my-receptions` — Lịch hẹn tiếp dân của tôi
* `GET /api/v1/app/active-polls` — Cuộc khảo sát đang mở tôi chưa vote
* `GET /api/v1/app/posts` — Bản tin dân cư dành riêng cho app
* `GET /api/v1/app/notifications` — Hộp thư thông báo tối ưu cho mobile

---

## 11. System & Health (3 APIs)

* `GET /api/v1/health` — Liveness Probe (Kiểm tra Node.js server)
* `GET /api/v1/ready` — Readiness Probe (Kiểm tra kết nối PostgreSQL/Redis)
* `GET /api/v1/version` — Phiên bản hiện tại của Backend
