// ===============================
// 🚨 CỨU HỘ TOÀN QUỐC - JS MAIN
// ===============================

// --- DỮ LIỆU GIẢ LẬP ---
const reports = [
  {
    id: 1,
    type: "need",
    title: "Cần cứu hộ xe ngập nước",
    desc: "Xe ô tô bị chết máy tại đường Lương Ngọc Quyến, TP Thái Nguyên.",
    lat: 21.594,
    lng: 105.848
  },
  {
    id: 2,
    type: "rescue",
    title: "Đội cứu hộ Hà Nội sẵn sàng",
    desc: "Đội Ứng cứu 116 đang trực tại khu vực Cầu Giấy.",
    lat: 21.028,
    lng: 105.835
  },
  {
    id: 3,
    type: "warning",
    title: "Cảnh báo sạt lở nhẹ",
    desc: "Đường đèo Tam Đảo xuất hiện sạt lở, cần chú ý khi di chuyển.",
    lat: 21.433,
    lng: 105.626
  },
  {
    id: 4,
    type: "need",
    title: "Cần hỗ trợ thay lốp xe",
    desc: "Xe tải bị nổ lốp trên cao tốc Hà Nội - Hải Phòng.",
    lat: 20.9,
    lng: 106.7
  }
];

// --- KHỞI TẠO BẢN ĐỒ ---
const map = L.map("map").setView([21.0, 105.8], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];

// --- HIỂN THỊ DANH SÁCH BÁO CÁO ---
const listContainer = document.getElementById("reportList");
const tabs = document.querySelectorAll(".filterTabs button");
const searchInput = document.getElementById("searchInput");

function renderReports(filter = "all", keyword = "") {
  listContainer.innerHTML = "";
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const filtered = reports.filter(r => {
    const matchType = filter === "all" || r.type === filter;
    const matchText =
      r.title.toLowerCase().includes(keyword.toLowerCase()) ||
      r.desc.toLowerCase().includes(keyword.toLowerCase());
    return matchType && matchText;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `<p style="text-align:center;color:#6b7280;">Không có dữ liệu phù hợp.</p>`;
    return;
  }

  filtered.forEach(r => {
    // Tạo thẻ card
    const div = document.createElement("div");
    div.className = "report-card";
    div.innerHTML = `
      <span class="tag ${r.type}">
        ${r.type === "need" ? "🆘 Cần cứu" :
          r.type === "rescue" ? "🚑 Đội cứu hộ" : "⚠️ Cảnh báo"}
      </span>
      <h4>${r.title}</h4>
      <p>${r.desc}</p>
    `;

    // Sự kiện click để focus map
    div.addEventListener("click", () => {
      map.flyTo([r.lat, r.lng], 13);
      L.popup()
        .setLatLng([r.lat, r.lng])
        .setContent(`<b>${r.title}</b><br>${r.desc}`)
        .openOn(map);
    });

    listContainer.appendChild(div);

    // Tạo marker trên bản đồ
    const marker = L.marker([r.lat, r.lng]).addTo(map);
    marker.bindPopup(`<b>${r.title}</b><br>${r.desc}`);
    markers.push(marker);
  });
}

// --- LỌC TAB ---
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    tab.classList.add("active");

    const type = tab.textContent.includes("Cần") ? "need" :
                 tab.textContent.includes("Đội") ? "rescue" :
                 tab.textContent.includes("Cảnh") ? "warning" : "all";

    renderReports(type, searchInput.value);
  });
});

// --- TÌM KIẾM ---
searchInput.addEventListener("input", () => {
  const activeTab = document.querySelector(".filterTabs button.active");
  const type = activeTab.textContent.includes("Cần") ? "need" :
               activeTab.textContent.includes("Đội") ? "rescue" :
               activeTab.textContent.includes("Cảnh") ? "warning" : "all";
  renderReports(type, searchInput.value);
});

// --- KHỞI TẠO LẦN ĐẦU ---
renderReports();

// --- NÚT TRÊN BẢN ĐỒ ---
document.querySelectorAll(".float-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".float-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

console.log("🚀 Giao diện Cứu Hộ Toàn Quốc đã sẵn sàng!");


const API_BASE = "http://localhost:8080/api/reports";

export async function sendReport(data) {
  try {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Lỗi gửi báo cáo:", err);
    throw err;
  }
}
