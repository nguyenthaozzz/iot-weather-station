import { InfluxDB } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
dotenv.config();

// Lấy biến từ file .env
const { INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET } = process.env;

// Tạo kết nối InfluxDB
const influx = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
const queryApi = influx.getQueryApi(INFLUX_ORG);

// Câu truy vấn mẫu
const query = `
  from(bucket: "${INFLUX_BUCKET}")
    |> range(start: -1h)
    |> limit(n: 5)
`;

console.log("🔍 Đang kiểm tra kết nối đến InfluxDB...");

try {
  const rows = await queryApi.collectRows(query);
  console.log(`✅ Kết nối thành công! Nhận được ${rows.length} dòng dữ liệu.`);
  console.log(rows.slice(0, 2)); // In thử 2 dòng đầu để xem field và measurement
} catch (err) {
  console.error("❌ Không thể kết nối InfluxDB:", err.message || err);
}
