import { getReports } from "../core/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("reportList");
  if (!list) return;

  const reports = getReports();

  // Xóa nội dung cũ (mặc định)
  list.innerHTML = "";

  if (reports.length === 0) {
    list.innerHTML = "<p>Chưa có báo tin nào.</p>";
    return;
  }

  // Duyệt qua các báo tin đã lưu
  reports.forEach((r) => {
    const item = document.createElement("div");
    item.className = "report-card";

    // Chọn icon và nhãn theo loại phản ánh
    let tagIcon = "🆘", tagText = "Cần cứu hộ";
    if (r.category === "doi-cuu-ho") { tagIcon = "🚑"; tagText = "Đội cứu hộ"; }
    else if (r.category === "nhu-yeu-pham") { tagIcon = "📦"; tagText = "Nhu yếu phẩm"; }
    else if (r.category === "cuu-ho-xe") { tagIcon = "🛵"; tagText = "Cứu hộ xe"; }

    item.innerHTML = `
      <span class="tag">${tagIcon} ${tagText}</span>
      <h4>${r.name} (${r.phone})</h4>
      <p>${r.description}</p>
      ${r.mapLink ? `<a href="${r.mapLink}" target="_blank">📍 Xem vị trí</a>` : ""}
      <small>⏰ ${r.time}</small>
    `;

    list.prepend(item); // thêm lên đầu danh sách
  });
});
