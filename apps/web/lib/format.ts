const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(`${iso}T00:00:00Z`));
}

/** Indian notation with lakh / crore wording, e.g. ₹9.84 crore. */
export function formatINR(amount: number): string {
  if (amount >= 1e7) return `₹${trim(amount / 1e7)} crore`;
  if (amount >= 1e5) return `₹${trim(amount / 1e5)} lakh`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function trim(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, "");
}
