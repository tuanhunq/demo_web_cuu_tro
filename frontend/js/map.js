window.addEventListener("load", () => {
  document.getElementById("reportList").style.display = "block";
});



// map.js
const mapEl = document.getElementById("map");
if (mapEl && typeof L !== "undefined") {
  if (!window.cuuMap) {
    window.cuuMap = L.map("map").setView([21.0285, 105.8542], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(window.cuuMap);
  }

  let marker = null;
  const locationInput = document.getElementById("location");

  // 🔍 Thanh tìm kiếm tỉnh thành
  const searchProvince = document.getElementById("searchProvince");
  if (searchProvince) {
    searchProvince.addEventListener("input", (e) => {
      const province = e.target.value.trim();
      if (province && window.provinces && window.provinces[province]) {
        const [lat, lng] = window.provinces[province];
        window.cuuMap.flyTo([lat, lng], 10);
        if (marker) marker.remove();
        marker = L.marker([lat, lng])
          .addTo(window.cuuMap)
          .bindPopup(`📍 ${province}`)
          .openPopup();
      }
    });
  }

  // 🖱️ Chọn tọa độ thủ công trên bản đồ
  window.cuuMap.on("click", async (e) => {
  const { lat, lng } = e.latlng;
  if (marker) marker.remove();

  // Gọi API Nominatim để lấy tên địa điểm
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`
    );
    const data = await response.json();
    const placeName = data.display_name || "Không rõ vị trí";

    marker = L.marker([lat, lng])
      .addTo(window.cuuMap)
      .bindPopup(`📍 ${placeName}`)
      .openPopup();
  } catch (err) {
    console.error("Lỗi khi lấy tên vị trí:", err);
    marker = L.marker([lat, lng])
      .addTo(window.cuuMap)
      .bindPopup(`📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      .openPopup();
  }

  if (locationInput)
    locationInput.value = `${lat.toFixed(5)},${lng.toFixed(5)}`;
});

  // 📎 Nạp từ link Google Maps
  const loadBtn = document.getElementById("loadMap");
  const mapLinkInput = document.getElementById("mapLink");
  if (loadBtn && mapLinkInput) {
    loadBtn.addEventListener("click", () => {
      const url = mapLinkInput.value.trim();
      if (!url) return alert("⚠️ Vui lòng dán link Google Maps!");
      const regex = /@?(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
      const match = url.match(regex);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (marker) marker.remove();
        marker = L.marker([lat, lng])
          .addTo(window.cuuMap)
          .bindPopup(`Từ link: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
          .openPopup();
        window.cuuMap.setView([lat, lng], 16);
        if (locationInput)
          locationInput.value = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      } else {
        alert("Không tìm thấy tọa độ trong link này. Hãy chọn trực tiếp trên bản đồ.");
      }
    });
  }

  // 📍 Nút "Lấy vị trí của tôi"
  const locateBtn = document.getElementById("locateBtn");
  if (locateBtn) {
    locateBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
        return;
      }

      locateBtn.disabled = true;
      locateBtn.textContent = "⏳ Đang định vị...";

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (marker) marker.remove();
          marker = L.marker([latitude, longitude])
            .addTo(window.cuuMap)
            .bindPopup("📍 Vị trí của bạn")
            .openPopup();
          window.cuuMap.flyTo([latitude, longitude], 15);
          if (locationInput)
            locationInput.value = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;

          locateBtn.disabled = false;
          locateBtn.textContent = "📍";
        },
        (err) => {
          alert("Không thể lấy vị trí: " + err.message);
          locateBtn.disabled = false;
          locateBtn.textContent = "📍";
        }
      );
    });
  }
}
