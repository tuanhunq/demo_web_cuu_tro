export function saveReport(report) {
  const reports = JSON.parse(localStorage.getItem("reports") || "[]");
  reports.push(report);
  localStorage.setItem("reports", JSON.stringify(reports));
}

export function getReports() {
  return JSON.parse(localStorage.getItem("reports") || "[]");
}
