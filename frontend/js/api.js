// API helpers: keep this file minimal — only backend endpoints and fetch wrappers

const API_BASE = "http://localhost:8080/api/reports";

export async function fetchReports() {
  try {
    const res = await fetch(`${API_BASE}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Lỗi lấy danh sách báo cáo:", err);
    throw err;
  }
}

export async function sendReport(data) {
  try {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Lỗi gửi báo cáo:", err);
    throw err;
  }
}
