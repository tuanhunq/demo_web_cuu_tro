// UI logic for reports list and interaction with the map
import { fetchReports } from './api.js';

const listContainers = Array.from(document.querySelectorAll('.report-list'));
const tabs = document.querySelectorAll('.filterTabs button');
const searchInput = document.getElementById('searchInput');

let localReports = [];
let markers = [];

function parseStaticReports() {
  const out = [];
  // take cards from the first .report-list in DOM as fallback data
  const firstList = document.querySelector('.report-list');
  if (!firstList) return out;
  const cards = Array.from(firstList.querySelectorAll('.report-card'));
  cards.forEach(card => {
    const titleEl = card.querySelector('h4');
    const descEl = card.querySelector('p');
    const span = card.querySelector('span');
    let type = 'all';
    if (span) {
      const cls = (span.className || '').toLowerCase();
      if (cls.includes('need') || span.textContent.includes('Cần')) type = 'need';
      else if (cls.includes('rescue') || span.textContent.includes('Đội')) type = 'rescue';
      else if (cls.includes('warning') || span.textContent.includes('Cảnh')) type = 'warning';
    }
    out.push({
      id: undefined,
      type,
      title: titleEl ? titleEl.textContent.trim() : '',
      desc: descEl ? descEl.textContent.trim() : '',
    });
  });
  return out;
}

function getActiveType() {
  const active = document.querySelector('.filterTabs button.active');
  if (!active) return 'all';
  return active.textContent.includes('Cần') ? 'need' :
         active.textContent.includes('Đội') ? 'rescue' :
         active.textContent.includes('Cảnh') ? 'warning' : 'all';
}

export function renderReports(filter = 'all', keyword = '') {
  if (!listContainers || listContainers.length === 0) return;
  listContainers.forEach(c => c.innerHTML = '');

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
    listContainers.forEach(c => c.innerHTML = `<p style="text-align:center;color:#6b7280;">Không có dữ liệu phù hợp.</p>`);
    return;
  }

filtered.forEach(r => {
  const div = document.createElement('div');
  div.className = 'report-card';
    div.innerHTML = `
      <span class="tag tag-${r.type}">
      ${
        r.type === 'need'
          ? '🆘 Cần cứu'
          : r.type === 'rescue'
          ? '🚑 Đội cứu hộ'
          : r.type === 'supply'
          ? '📦 Nhu yếu phẩm'
          : r.type === 'vehicle'
          ? '🛵 Cứu hộ xe'
          : 'Khác'
      }
    </span>
    <h4>${r.title || ''}</h4>
    <p>${r.desc || ''}</p>
  `;

  div.addEventListener('click', () => {
    if (window.cuuMap && r.lat && r.lng) {
      try {
        window.cuuMap.flyTo([r.lat, r.lng], 13);
        L.popup()
          .setLatLng([r.lat, r.lng])
          .setContent(`<b>${r.title}</b><br>${r.desc}`)
          .openOn(window.cuuMap);
      } catch (e) {
        console.warn(e);
      }
    }
  });

  // append to every report list so both sidebars show the same data
  listContainers.forEach(c => c.appendChild(div.cloneNode(true)));

  // hiển thị marker trên bản đồ
  if (window.cuuMap && r.lat && r.lng) {
    try {
      const marker = L.marker([r.lat, r.lng])
        .addTo(window.cuuMap)
        .bindPopup(`<b>${r.title}</b><br>${r.desc}`);
      window.__cuu_map_markers = window.__cuu_map_markers || [];
      window.__cuu_map_markers.push(marker);
    } catch (e) {
      console.warn('Tạo marker thất bại', e);
    }
  }
});

}


// Gắn sự kiện cho tab lọc và ô tìm kiếm
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

// Khởi tạo dữ liệu ban đầu
(async function init() {
  try {
    localReports = await fetchReports();
    if (!localReports || localReports.length === 0) {
      // fallback to static DOM cards
      localReports = parseStaticReports();
    }
  } catch (e) {
    console.warn('Không thể lấy dữ liệu từ API, dùng dữ liệu cục bộ nếu có.');
    localReports = parseStaticReports();
  }
  renderReports(getActiveType(), searchInput ? searchInput.value : '');
})();

// ===============================
// 🧾 FORM GỬI BÁO CÁO CỨU HỘ
// ===============================
const form = document.getElementById('reportForm');
const btn = document.getElementById('submitBtn');
const msg = document.getElementById('responseMsg');

if (form && btn && msg) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "⏳ Đang gửi...";
    
    // Giả lập gửi dữ liệu (2 giây)
    setTimeout(() => {
      msg.textContent = "✅ Báo tin đã được gửi thành công! Đội cứu hộ sẽ liên hệ sớm.";
      msg.style.color = "#22c55e";
      btn.disabled = false;
      btn.textContent = "🚀 Gửi Báo Tin";
      form.reset();
    }, 2000);
  });
}
