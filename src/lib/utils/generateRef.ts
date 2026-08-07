// // Generates inquiry reference: TCC-2026-04271
// export function generateRef(): string {
//   const year = new Date().getFullYear();
//   const num  = Math.floor(10_000 + Math.random() * 90_000);
//   return `TCC-${year}-${num}`;
// }
export function generateRef(): string {
  const year = new Date().getFullYear();
  const num  = Math.floor(10_000 + Math.random() * 90_000);
  return `TCC-${year}-${num}`;
}

export function generateDemoOrderId(): string {
  const year = new Date().getFullYear();
  const num  = Math.floor(10_000 + Math.random() * 90_000);
  return `TCC-DEMO-${year}-${num}`;
}
