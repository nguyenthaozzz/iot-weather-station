# IoT Weather Dashboard (HTML + Node/Express)

Trang web hiển thị thời tiết theo giao diện mẫu và **nhận dữ liệu động** từ:
- **InfluxDB** (nhiệt độ, độ ẩm, áp suất + biểu đồ 6 giờ gần nhất)
- **Open‑Meteo API** (trạng thái thời tiết/điều kiện hiển thị)
- **MQTT** (nút *Sleep mode* gửi lệnh về ESP32; trạng thái *Connected/Disconnected* dựa trên topic `esp32/status`)

> Thiết kế tập trung vào môi trường *localhost* cho đồ án. Bạn có thể đổi sang OpenWeather nếu muốn.

## Cấu trúc
```
.
iot_weather_dashboard/
├─ public/            # Thư mục giao diện người dùng (Frontend)
│  ├─ index.html      # Giao diện chính Dashboard
│  ├─ style.css       # Định dạng bố cục, màu sắc, font chữ
│  ├─ app.js          # Logic hiển thị, cập nhật dữ liệu realtime
│  └─ images/         # Biểu tượng & hình ảnh (smile, sad, location,...)
├─ server.js          # Backend (Express + InfluxDB + MQTT)
├─ .env               # Cấu hình môi trường (token, URL, port...)
└─ package.json       # Khai báo thư viện & script

```

## Yêu cầu
- Node.js 18+
- InfluxDB v2 đã có bucket & token
- MQTT broker (Mosquitto) đang chạy (tuỳ chọn nếu bạn cần nút Sleep + trạng thái)

## Cài đặt & chạy
```bash
cd iot_weather_dashboard
cp .env.example .env   # cập nhật token, bucket, MQTT...
npm i
npm run dev
# Mở trình duyệt: http://localhost:8080
```

### InfluxDB
Server sẽ query measurement **`weather`** với các field: `temperature`, `humidity`, `pressure` và tag `city` (ví dụ `city="TP Hồ Chí Minh"`).  
Bạn có thể dùng telegraf/inserter để ghi dữ liệu theo schema này.

**Flux mẫu để kiểm tra nhanh trong Data Explorer:**
```flux
from(bucket: "my-bucket")
  |> range(start: -6h)
  |> filter(fn: (r) => r._measurement == "weather")
  |> filter(fn: (r) => r.city == "TP Hồ Chí Minh")
  |> filter(fn: (r) => r._field == "temperature" or r._field == "humidity" or r._field == "pressure")
  |> aggregateWindow(every: 15m, fn: mean, createEmpty: false)
```

### MQTT (ESP32)
- ESP32 publish trạng thái vào topic **`esp32/status`** với payload `"online"` / `"offline"` (hoặc chứa các từ khoá này).
- Nút **Sleep mode** sẽ `publish` JSON `{"action":"sleep"}` vào topic **`esp32/cmd`** (bạn xử lý ở firmware để tắt LCD).

### Đổi vị trí (Location)
- Nhấn **Đổi** → nhập tên thành phố → trang sẽ gọi `/api/metrics?city=...` và `/api/weather?city=...`.
- Backend dùng **Open‑Meteo Geocoding** để lấy lat/lon và thời tiết hiện tại mà **không cần API key**.

### Icon Smile/Sad (Đánh giá độ dễ chịu)
- *Smile*: nhiệt độ 24–28°C **và** (độ ẩm 40–60% **hoặc** áp suất 1005–1015 hPa).
- *Sad*: ngoài các ngưỡng trên.

Bạn có thể chỉnh công thức này trong `app.js` (hàm `pickMood`).

## Tuỳ biến
- Sửa giao diện trong `style.css`.
- Nếu không muốn lộ Influx token trên client (khuyến nghị), hãy luôn để client **chỉ gọi backend** như ở dự án này (đã proxy sẵn).
- Nếu muốn dùng OpenWeather: sửa route `/api/weather` trong `server.js` và thêm `OPENWEATHER_API_KEY`.

Chúc bạn build bài thật ngon! 🎯
