const state = {
  chart: null,
  range: '15m',
  city: 'TP Hồ Chí Minh'
};

// ================= Lưu vị trí đã chọn =================
const savedCity = localStorage.getItem('selectedCity');
if (savedCity) state.city = savedCity;

// ================= Icon thời tiết =====================
function getWeatherIcon(code) {
  const hour = new Date().getHours();
  const c = code;

  if (c >= 199 && c <= 233) return "⛈️";     // Dông sấm
  if (c >= 299 && c <= 532) return "🌧️";     // Mưa
  if (c >= 599 && c <= 623) return "❄️";     // Tuyết
  if (c >= 699 && c <= 752) return "🌫️";     // Sương mù
  if (c >= 799 && c <= 800.6) return (hour >= 6 && hour < 18) ? "☀️" : "🌙";  // Trời quang
  if (c >= 800.7 && c <= 803.6) return (hour >= 6 && hour < 18) ? "🌤️" : "🌥️"; // Có mây
  if (c >= 804 && c <= 806) return "☁️";     // Nhiều mây
  return "❓";
}

// ================= Header =============================
function fmtDate(d) {
  const dd = new Date(d);
  return dd.toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function updateHeader() {
  document.getElementById('cityName').textContent = state.city;
  const cityTitle = document.getElementById('cityTitle');
  cityTitle.childNodes[0].textContent = `${state.city} `;
  document.getElementById('dateStr').textContent = fmtDate(Date.now());
  document.getElementById('year').textContent = new Date().getFullYear();
}

// ================= Biểu đồ ============================
function initChart() {
  const ctx = document.getElementById('thChart');
  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [],
          borderColor: 'rgba(253, 5, 5, 1)',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          yAxisID: 'y1',
          tension: 0.3
        },
        {
          label: 'Humidity (%)',
          data: [],
          borderColor: 'rgba(0, 62, 249, 1)',
          backgroundColor: 'rgba(0, 21, 255, 0.2)',
          yAxisID: 'y2',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Thời gian',
            color: '#111',
            font: { size: 14, weight: 'bold' }
          }
        },
        y1: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Nhiệt độ (°C)',
            color: '#ef4444',
            font: { size: 14, weight: 'bold' }
          },
          ticks: { color: '#ef4444' }
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Độ ẩm (%)',
            color: '#3b82f6',
            font: { size: 14, weight: 'bold' }
          },
          ticks: { color: '#3b82f6' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// ================= Trạng thái cảm xúc =================
const COMFORT_RANGE = {
  temperature: [22, 28],
  humidity: [40, 65],
  pressure: [1000, 1020]
};

function getMoodImage(temp, hum, pres) {
  const [tMin, tMax] = COMFORT_RANGE.temperature;
  const [hMin, hMax] = COMFORT_RANGE.humidity;
  const [pMin, pMax] = COMFORT_RANGE.pressure;
  const isComfort =
    temp >= tMin && temp <= tMax &&
    hum >= hMin && hum <= hMax &&
    pres >= pMin && pres <= pMax;
  return isComfort ? "./images/smile.png" : "./images/exhauted.jpg";
}

function updateMood(temp, hum, pres) {
  const img = document.getElementById("moodIcon");
  const newSrc = getMoodImage(temp, hum, pres);
  if (!img.src.endsWith(newSrc.replace("./", ""))) img.src = newSrc;
}

// ================= Cập nhật biểu đồ ====================
async function updateChart() {
  try {
    const res = await fetch(`/api/metrics?range=${state.range}`);
    const data = await res.json();

    state.chart.data.labels = data.time.map(t =>
      new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
    state.chart.data.datasets[0].data = data.temperature;
    state.chart.data.datasets[1].data = data.humidity;
    state.chart.update();

    // --- Tính nhiệt độ cao/thấp ---
  if (data.temperature.length > 0) {
    const low = Math.min(...data.temperature);
    const high = Math.max(...data.temperature);
    document.getElementById("lowHigh").innerText = `${low.toFixed(1)} / ${high.toFixed(1)}°C`;
  }

    // cập nhật header mỗi lần
    updateHeader();
  } catch (err) {
    console.error("⚠️ Không thể cập nhật biểu đồ:", err);
  }
}

// ================= Cập nhật realtime ====================
async function updateRealtime() {
  try {
    const res = await fetch("/api/realtime");
    const data = await res.json();

    // Cập nhật giá trị bên trái
    document.getElementById("bigTemp").innerText = data.temperature.toFixed(1) + "°C";
    document.getElementById("humidity").innerText = data.humidity.toFixed(1) + "%";
    document.getElementById("pressure").innerText = data.pressure.toFixed(1) + " hPa";

    // Cập nhật biểu tượng thời tiết
    const code = Math.round(data.weather_code);
    document.getElementById("weather-icon").textContent = getWeatherIcon(code);

    const label = (() => {
      if (code >= 199 && code <= 233) return "Dông, sấm sét";
      if (code >= 299 && code <= 532) return "Mưa";
      if (code >= 600 && code <= 622) return "Tuyết";
      if (code >= 699 && code <= 752) return "Sương mù";
      if (code >= 799 && code <= 800) return "Trời quang";
      if (code >= 801 && code <= 803) return "Có mây";
      if (code >= 804 && code <= 806) return "Nhiều mây";
      return "Không xác định";
    })();
    document.getElementById("weather-label").textContent = label;

    // Cập nhật mood icon
    updateMood(data.temperature, data.humidity, data.pressure);
  } catch (err) {
    console.error("⚠️ Realtime error:", err);
  }
}

// ================= Khi trang tải ====================
window.addEventListener('DOMContentLoaded', async () => {
  initChart();
  await Promise.all([updateChart(), updateRealtime()]);

  // Biểu đồ cập nhật chậm (đủ range)
  setInterval(updateChart, 30000);

  // Dữ liệu realtime cập nhật nhanh (0.5s)
  setInterval(updateRealtime, 500);

  // ===== Nút đổi vị trí =====
  document.getElementById("changeCityBtn").addEventListener("click", async () => {
    const name = prompt("Nhập tên thành phố mới:", state.city);
    if (!name) return;
    const newCity = name.trim();
    state.city = newCity;
    localStorage.setItem('selectedCity', newCity);
    updateHeader();

    document.getElementById("weather-icon").textContent = "⏳";
    document.getElementById("weather-label").textContent = `Đang tải dữ liệu cho ${newCity}...`;

    try {
      const res = await fetch("/api/change_city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: newCity })
      });
      if (res.ok) alert(`📡 Đã gửi yêu cầu đổi vị trí sang: ${newCity}`);
      else alert("⚠️ Gửi lệnh thất bại. Kiểm tra kết nối server!");
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu đổi vị trí:", err);
      alert("❌ Không thể kết nối server.");
    }
    setTimeout(updateChart, 5000);
  });
});

// ================= LCD Sleep Mode ======================
const sleepBtn = document.getElementById("sleepBtn");
let lcdOn = true;
sleepBtn.addEventListener("click", async () => {
  const cmd = lcdOn ? "SLEEP" : "OPEN";
  const res = await fetch(`/api/command/${cmd.toLowerCase()}`, { method: "POST" });
  if (res.ok) {
    alert(`✅ LCD ${lcdOn ? "đã tắt" : "đã bật"}`);
    lcdOn = !lcdOn;
    sleepBtn.textContent = lcdOn ? "Sleep LCD" : "Wake LCD";
  }
});

// ================= Thay đổi khoảng thời gian =============
const rangeSelect = document.getElementById("rangeSelect");
rangeSelect.addEventListener("change", async (e) => {
  state.range = e.target.value;
  await updateChart();
});

// ================= Kiểm tra kết nối ESP32 ===============
async function checkEsp32Connection() {
  try {
    const res = await fetch("/api/esp32/status");
    const data = await res.json();
    const connDot = document.getElementById("connDot");
    const connText = document.getElementById("connText");
    if (data.connected) {
      connDot.classList.remove("offline");
      connDot.classList.add("online");
      connText.textContent = "Connected (ESP32)";
    } else {
      connDot.classList.remove("online");
      connDot.classList.add("offline");
      connText.textContent = "Disconnected (ESP32)";
    }
  } catch {
    connDot.classList.remove("online");
    connDot.classList.add("offline");
    connText.textContent = "Disconnected (Server)";
  }
}
setInterval(checkEsp32Connection, 5000);
checkEsp32Connection();
