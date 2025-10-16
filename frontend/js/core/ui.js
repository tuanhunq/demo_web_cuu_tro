export function createReportCard({ tagClass, tagText, desc, name, phone, link, time }) {
  return `
    <div class="report-card">
      <span class="tag ${tagClass}">${tagText}</span>
      <h4>${desc}</h4>
      <p>Người báo: ${name} (${phone})</p>
      <small>📍 ${link ? `<a href="${link}" target="_blank">Xem vị trí</a>` : "Chưa có vị trí"} — 🕓 ${time}</small>
    </div>
  `;
}