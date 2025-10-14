// map.js: initialize and expose a global `cuuMap` safely
// Only run when the #map element exists to support pages without a map
const mapEl = document.getElementById('map');
if (mapEl && typeof L !== 'undefined') {
  // avoid re-initialization
  if (!window.cuuMap) {
    window.cuuMap = L.map('map').setView([21.0285, 105.8542], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window.cuuMap);
  }

  let marker = null;
  const locationInput = document.getElementById('location');

  // province select
  const provinceSel = document.getElementById('provinceSelect');
  if (provinceSel) {
    provinceSel.addEventListener('change', (e) => {
      const province = e.target.value;
      if (province && window.provinces && window.provinces[province]) {
        const [lat, lng] = window.provinces[province];
        window.cuuMap.flyTo([lat, lng], 11);
      }
    });
  }

  // click to choose
  window.cuuMap.on('click', (e) => {
    const { lat, lng } = e.latlng;
    if (marker) marker.remove();
    marker = L.marker([lat, lng]).addTo(window.cuuMap)
      .bindPopup(`📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();
    if (locationInput) locationInput.value = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  });

  // load from Google Maps link if inputs exist
  const loadBtn = document.getElementById('loadMap');
  const mapLinkInput = document.getElementById('mapLink');
  if (loadBtn && mapLinkInput) {
    loadBtn.addEventListener('click', () => {
      const url = mapLinkInput.value.trim();
      if (!url) return alert('⚠️ Vui lòng dán link Google Maps!');
      const regex = /@?(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
      const match = url.match(regex);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (marker) marker.remove();
        marker = L.marker([lat, lng]).addTo(window.cuuMap)
          .bindPopup(`Từ link: ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();
        window.cuuMap.setView([lat, lng], 16);
        if (locationInput) locationInput.value = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      } else {
        alert('Không tìm thấy tọa độ trong link này. Hãy chọn trực tiếp trên bản đồ.');
      }
    });
  }
}
