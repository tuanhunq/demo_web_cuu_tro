document.getElementById("provinceSelect").addEventListener("change", (e) => {
  const province = e.target.value;
  if (province && provinces[province]) {
    const [lat, lng] = provinces[province];
    map.flyTo([lat, lng], 11); // Zoom đến tỉnh được chọn
  }
});
let map = L.map('map').setView([21.0285, 105.8542], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;
const locationInput = document.getElementById('location');

// Chọn vị trí trên bản đồ
map.on('click', (e) => {
  const { lat, lng } = e.latlng;
  if (marker) marker.remove();
  marker = L.marker([lat, lng]).addTo(map)
    .bindPopup(`📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();
  locationInput.value = `${lat.toFixed(5)},${lng.toFixed(5)}`;
});

// Xử lý link Google Maps
document.getElementById('loadMap').addEventListener('click', () => {
  const url = document.getElementById('mapLink').value.trim();
  if (!url) return alert('⚠️ Vui lòng dán link Google Maps!');
  const regex = /@?(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
  const match = url.match(regex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (marker) marker.remove();
    marker = L.marker([lat, lng]).addTo(map)
      .bindPopup(`Từ link: ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();
    map.setView([lat, lng], 16);
    locationInput.value = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  } else {
    alert('Không tìm thấy tọa độ trong link này. Hãy chọn trực tiếp trên bản đồ.');
  }
});
