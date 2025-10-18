// expose provinces used by map.js
// js/provinces.js
window.provinces = {
  "An Giang": [10.5216, 105.1259],
  "Bà Rịa - Vũng Tàu": [10.5417, 107.2429],
  "Bắc Giang": [21.2819, 106.1972],
  "Bắc Kạn": [22.147, 105.8348],
  "Bạc Liêu": [9.294, 105.727],
  "Bắc Ninh": [21.1861, 106.0763],
  "Bến Tre": [10.2434, 106.375],
  "Bình Dương": [11.1731, 106.671],
  "Bình Định": [14.1665, 108.9027],
  "Bình Phước": [11.7512, 106.7235],
  "Bình Thuận": [10.9804, 108.2615],
  "Cà Mau": [9.176, 105.15],
  "Cần Thơ": [10.0452, 105.7469],
  "Cao Bằng": [22.6657, 106.257],
  "Đà Nẵng": [16.0544, 108.2022],
  "Đắk Lắk": [12.7100, 108.2378],
  "Đắk Nông": [12.2646, 107.6098],
  "Điện Biên": [21.397, 103.023],
  "Đồng Nai": [10.95, 107.15],
  "Đồng Tháp": [10.48, 105.63],
  "Gia Lai": [13.9833, 108.0],
  "Hà Giang": [22.8, 104.9833],
  "Hà Nam": [20.541, 105.91],
  "Hà Nội": [21.0285, 105.8542],
  "Hà Tĩnh": [18.342, 105.906],
  "Hải Dương": [20.94, 106.33],
  "Hải Phòng": [20.8449, 106.6881],
  "Hậu Giang": [9.7833, 105.4667],
  "Hòa Bình": [20.8172, 105.3376],
  "Hưng Yên": [20.646, 106.051],
  "Khánh Hòa": [12.25, 109.1833],
  "Kiên Giang": [10.0167, 105.0833],
  "Kon Tum": [14.35, 108.0167],
  "Lai Châu": [22.3833, 103.4667],
  "Lâm Đồng": [11.75, 108.3333],
  "Lạng Sơn": [21.8333, 106.7333],
  "Lào Cai": [22.4833, 103.95],
  "Long An": [10.6667, 106.1667],
  "Nam Định": [20.4333, 106.1667],
  "Nghệ An": [18.6667, 105.6667],
  "Ninh Bình": [20.25, 105.975],
  "Ninh Thuận": [11.75, 108.9333],
  "Phú Thọ": [21.3333, 105.1667],
  "Phú Yên": [13.0833, 109.3],
  "Quảng Bình": [17.4833, 106.6],
  "Quảng Nam": [15.5833, 108.4833],
  "Quảng Ngãi": [15.1167, 108.8],
  "Quảng Ninh": [21.0, 107.25],
  "Quảng Trị": [16.75, 107.1833],
  "Sóc Trăng": [9.6, 105.9667],
  "Sơn La": [21.3333, 103.9],
  "Tây Ninh": [11.3333, 106.0833],
  "Thái Bình": [20.45, 106.34],
  "Thái Nguyên": [21.5672, 105.8252],
  "Thanh Hóa": [19.8, 105.7667],
  "Thừa Thiên Huế": [16.4667, 107.6],
  "Tiền Giang": [10.3667, 106.35],
  "TP Hồ Chí Minh": [10.7769, 106.7009],
  "Trà Vinh": [9.9333, 106.35],
  "Tuyên Quang": [21.8167, 105.2167],
  "Vĩnh Long": [10.25, 105.9667],
  "Vĩnh Phúc": [21.3, 105.6],
  "Yên Bái": [21.7, 104.8667],
};

// Khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchProvince");
  if (!input) return;

  input.addEventListener("change", () => {
    const province = input.value.trim();
    const coords = window.provinces[province];
    const map = window.cuuMap;

    if (!coords) {
      alert("⚠️ Không tìm thấy tỉnh này trong dữ liệu!");
      return;
    }
    if (!map) return;

    const [lat, lng] = coords;

    // Bay mượt đến vị trí
    map.flyTo([lat, lng], 10, { duration: 1.3 });

    // Hiển thị popup
    L.popup()
      .setLatLng([lat, lng])
      .setContent(`<b>${province}</b><br>Đã di chuyển đến vị trí này.`)
      .openOn(map);
  });
});


// If a datalist for provinces exists (id="provinces" in index.html), populate it
try {
  const dl = document.getElementById('provinces');
  if (dl && window.provinces) {
    // clear existing options
    dl.innerHTML = '';
    Object.keys(window.provinces).forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      dl.appendChild(opt);
    });
  }
} catch (e) {
  // noop
}
