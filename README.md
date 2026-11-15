# 100Days Push & Run 🏃‍♂️💪

Ứng dụng Web App chuẩn **PWA (Progressive Web App)** theo dõi và rèn luyện thể lực: Hoàn thành thử thách **100 ngày (14 tuần)** kết hợp **Chạy bộ 3 buổi/tuần** và chinh phục **100 cái hít đất liên tục vào ngày thứ 100**, chỉ sử dụng **Tạ đơn (Dumbbell)** hoặc **Không dụng cụ (Bodyweight)**.

---

## 🌟 Tính Năng Nổi Bật

- **Dual-Experience (Web Desktop & Mobile PWA):**
  - **Desktop (>= 768px):** Bố cục Bento Grid 7:5, thanh điều hướng kính mờ (`DesktopHeader`), ma trận lộ trình 100 ngày trực quan và bảng KPI thống kê.
  - **Mobile (< 768px):** Thanh điều hướng dưới đáy (`BottomNavigation`), nút chạm đếm hít đất bằng mũi/ngực khổng lồ (`Touch-to-Count`) chiếm 60% màn hình.
- **Hệ Thống Màu Sắc & Thể Loại Buổi Tập:**
  - 🟠 **Hít đất Sức mạnh (Thứ 2, 4, 6):** Cam Thể Thao (`#F97316`).
  - 🔵 **Chạy bộ Sức bền (Thứ 3, 5, 7):** Xanh Dương Thể Thao (`#2563EB`).
  - 🟢 **Giãn cơ & Phục hồi (Chủ nhật):** Xanh Ngọc (`#10B981`).
- **Cơ Chế Equipment Fallback:**
  - Chuyển đổi linh hoạt giữa chế độ **Có Tạ Đơn (Dumbbell)** và **Không Dụng Cụ (Bodyweight)** với 21 bài tập có fallback tự động.
- **Động Cơ Tập Luyện Tương Tác:**
  - **Touch-to-Count Floor Pad:** Chạm mũi/ngực để đếm rep, phát âm thanh Beep bằng Web Audio API synthesizer (không cần file mp3), hỗ trợ phím Spacebar.
  - **Đồng hồ nghỉ (Rest Timer):** Đếm ngược tự động (45s/60s/90s) kết hợp rung điện thoại (`navigator.vibrate`).
  - **GPS Run Tracker & Interval Coach:** Định vị Haversine tính km, đo Pace trung bình, chế độ chạy máy (Treadmill), tích hợp đồng bộ Strava API, giữ sáng màn hình (`Screen Wake Lock API`).
  - **Khởi động tương tác:** Hướng dẫn khởi động 5 phút bôi trơn khớp và xem chi tiết kỹ thuật từng bài tập.
- **Offline-First & Local Persistence:** Toàn bộ dữ liệu được lưu trên trình duyệt (`localStorage`) kèm chức năng Export/Import JSON sao lưu.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide React Icons
- **PWA:** `vite-plugin-pwa` (chế độ standalone, theme-color `#F97316`)
- **Kiến trúc:** Feature-Sliced Design (FSD) rút gọn, đảm bảo mọi file mã nguồn đều `<= 220 dòng`.

---

## 🚀 Cài Đặt & Chạy Ứng Dụng

```bash
# Cài đặt dependencies
npm install

# Khởi chạy server phát triển
npm run dev

# Build production
npm run build

# Xem bản build
npm run preview
```

---

## 📄 License

MIT License.
