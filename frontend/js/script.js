// UI logic for reports list and interaction with the map
import { fetchReports } from './api.js';

const listContainer = document.getElementById('reportList');
const tabs = document.querySelectorAll('.filterTabs button');
const searchInput = document.getElementById('searchInput');

let localReports = [];
let markers = [];

function getActiveType() {
  const active = document.querySelector('.filterTabs button.active');
  if (!active) return 'all';
  return active.textContent.includes('Cần') ? 'need' :
         active.textContent.includes('Đội') ? 'rescue' :
         active.textContent.includes('Cảnh') ? 'warning' : 'all';
}

export function renderReports(filter = 'all', keyword = '') {
  if (!listContainer) return;
  listContainer.innerHTML = '';

  // remove existing markers from a globally available map (if present)
  try {
    if (window.__cuu_map_markers) {
      window.__cuu_map_markers.forEach(m => m.remove && m.remove());
      window.__cuu_map_markers = [];
    }
  } catch (e) {
    console.warn('Không thể xóa marker cũ:', e);
  }

  const filtered = localReports.filter(r => {
    const matchType = filter === 'all' || r.type === filter;
    const text = (r.title||'') + ' ' + (r.desc||'');
    const matchText = text.toLowerCase().includes((keyword||'').toLowerCase());
    return matchType && matchText;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `<p style="text-align:center;color:#6b7280;">Không có dữ liệu phù hợp.</p>`;
    return;
  }

  filtered.forEach(r => {
    const div = document.createElement('div');
    div.className = 'report-card';
    div.innerHTML = `
      <span class="tag ${r.type}">
        ${r.type === 'need' ? '🆘 Cần cứu' : r.type === 'rescue' ? '🚑 Đội cứu hộ' : '⚠️ Cảnh báo'}
      </span>
      <h4>${r.title||''}</h4>
      <p>${r.desc||''}</p>
    `;

    div.addEventListener('click', () => {
      if (window.cuuMap && r.lat && r.lng) {
        try {
          window.cuuMap.flyTo([r.lat, r.lng], 13);
          L.popup().setLatLng([r.lat, r.lng]).setContent(`<b>${r.title}</b><br>${r.desc}`).openOn(window.cuuMap);
        } catch (e) { console.warn(e); }
      }
    });

    listContainer.appendChild(div);

    if (window.cuuMap && r.lat && r.lng) {
      try {
        const marker = L.marker([r.lat, r.lng]).addTo(window.cuuMap).bindPopup(`<b>${r.title}</b><br>${r.desc}`);
        window.__cuu_map_markers = window.__cuu_map_markers || [];
        window.__cuu_map_markers.push(marker);
      } catch (e) { console.warn('Tạo marker thất bại', e); }
    }
  });
}

// wire tab and search events if present
if (tabs) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      renderReports(getActiveType(), searchInput ? searchInput.value : '');
    });
  });
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    renderReports(getActiveType(), searchInput.value);
  });
}

// initial load: try to fetch from backend, fallback to empty list
(async function init() {
  try {
    localReports = await fetchReports();
  } catch (e) {
    console.warn('Không thể lấy dữ liệu từ API, dùng dữ liệu cục bộ rỗng.');
    localReports = [];
  }
  renderReports(getActiveType(), searchInput ? searchInput.value : '');
})();
