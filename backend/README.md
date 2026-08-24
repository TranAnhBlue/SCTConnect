# 🏛️ SCTConnect Backend — Hướng Dẫn Cài Đặt & Khởi Chạy

Hệ thống Backend Nền tảng Số **Ủy ban Mặt trận Tổ quốc Cấp Xã** (Phân hệ 1: Xác thực, Phân quyền & Cơ cấu Tổ chức).  
Xây dựng trên nền tảng **NestJS 11**, **TypeScript 5.7+**, **TypeORM** và **PostgreSQL 16+**.

---

## 📋 1. Yêu Cầu Môi Trường (Prerequisites)

* **Node.js**: Phiên bản **v20 LTS** hoặc **v22 LTS** ([Tải tại đây](https://nodejs.org/))
* **PostgreSQL**: Phiên bản **v15+** hoặc **v16+** ([Tải tại đây](https://www.postgresql.org/download/))

Kiểm tra trên máy tính:
```bash
node -v
npm -v
```

---

## 🚀 2. Các Bước Cài Đặt & Khởi Chạy

### Bước 1: Tạo Database trong PostgreSQL
Tạo một cơ sở dữ liệu rỗng có tên **`sct_connect`**:
* Bằng dòng lệnh `psql`:
  ```sql
  CREATE DATABASE sct_connect;
  ```

---

### Bước 2: Cài đặt thư viện (Dependencies)
Mở Terminal, di chuyển vào thư mục `backend/` và chạy:

```bash
cd backend
npm install
```

---

### Bước 3: Cấu hình file môi trường (`.env`)
1. Tạo file `.env` từ file mẫu `.env.example`:
   * **Windows:** `copy .env.example .env`
   * **macOS / Linux:** `cp .env.example .env`

2. Mở file `.env` và cập nhật mật khẩu PostgreSQL của máy bạn tại dòng `DB_PASSWORD`:

```env
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=mật_khẩu_postgres_của_máy_bạn
DB_DATABASE=sct_connect
DB_SSL=false

JWT_SECRET=sctconnect_jwt_secret_key_2026_super_secure_node
JWT_REFRESH_SECRET=sctconnect_jwt_refresh_secret_key_2026_super_secure_node
```

---

### Bước 4: Nạp CSDL (TypeORM Migration)
Chạy lệnh sau để tự động tạo toàn bộ các bảng vào PostgreSQL:

```bash
npm run migration:run
```

---

### Bước 5: Khởi chạy Backend
Chạy server ở chế độ phát triển:

```bash
npm run start:dev
```

Server sẽ khởi động tại:
* 🚀 **API Endpoint:** `http://localhost:3000/api/v1`
* 📚 **Tài liệu Swagger UI:** `http://localhost:3000/api/docs`

---

## 📚 3. Danh Sách API Đã Triển Khai & Kiểm Thử

Mở trình duyệt truy cập: 👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

Hiện tại hệ thống đã triển khai sẵn các API:
1. **`POST /api/v1/auth/register`** — Đăng ký tài khoản công dân mới (SĐT + Mật khẩu).
2. **`POST /api/v1/auth/login`** — Đăng nhập hệ thống (nhận Access Token & Refresh Token).
3. **`GET /api/v1/auth/me`** — Lấy thông tin hồ sơ tài khoản hiện tại (yêu cầu Bearer Token).
