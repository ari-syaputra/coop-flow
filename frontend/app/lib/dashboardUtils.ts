// Nama bulan singkat untuk label sumbu X pada chart
export const NAMA_BULAN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// Bangun array 6 bulan terakhir (termasuk bulan berjalan)
export function buildLastNMonths(n: number) {
  const now = new Date();
  const months: { key: string; label: string; year: number; month: number }[] =
    [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: NAMA_BULAN[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return months;
}

// Menentukan sapaan waktu otomatis berdasarkan jam
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 11) return "Selamat Pagi";
  if (hour >= 11 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}
