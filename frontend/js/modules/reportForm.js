import { saveReport } from "../core/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");
  const msg = document.getElementById("responseMsg");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const report = {
      name: form.querySelector("#name").value.trim(),
      phone: form.querySelector("#phone").value.trim(),
      description: form.querySelector("#description").value.trim(),
      mapLink: form.querySelector("#mapLink").value.trim(),
      category: form.querySelector("#category").value,
      time: new Date().toLocaleString(),
    };

    // Lưu vào localStorage
    saveReport(report);

    // Thông báo tạm thời
    msg.textContent = "✅ Báo tin đã được gửi!";
    msg.style.color = "green";

    // Quay lại trang chính sau 1s
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  });
});
