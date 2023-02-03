export function generateRandomColor(): string {
  return "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");
}

export function formatNumber(number: number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
