import Link from "next/link";
import { CATEGORIES, STATUSES, type Case, type PublicStatus } from "@alokana/domain";
import { formatDate } from "@/lib/format";

export function StatusBadge({ status }: { status: PublicStatus }) {
  const s = STATUSES[status];
  return (
    <span className={`status status--${s.stage}`}>
      <span className="status__dot" aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function SyntheticNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`synthetic${compact ? " synthetic--compact" : ""}`} role="note">
      <strong>Synthetic sample record.</strong>{" "}
      {compact
        ? "Invented to demonstrate the case format. Not a real case."
        : "Every party, document number, amount and date on this page is invented to demonstrate how a published case will look. It describes no real person, company or event."}
    </div>
  );
}

export function CaseCard({ c }: { c: Case }) {
  return (
    <article className="case-card">
      <div className="case-card__meta">
        <span className="mono">{c.id}</span>
        <span aria-hidden="true">·</span>
        <span>{CATEGORIES[c.category].label}</span>
      </div>
      <h3 className="case-card__title">
        <Link href={`/cases/${c.slug}`}>{c.title}</Link>
      </h3>
      <p className="case-card__place">
        {c.district}, {c.state}
        {c.historicalJurisdiction === "Undivided Andhra Pradesh" && (
          <span className="tag">Event in undivided AP</span>
        )}
      </p>
      <div className="case-card__foot">
        <StatusBadge status={c.publicStatus} />
        <span className="muted small">Last checked {formatDate(c.lastCheckedAt)}</span>
      </div>
      {c.synthetic && <span className="case-card__syn">Synthetic sample</span>}
    </article>
  );
}

export function PageHead({ kicker, title, lede }: { kicker: string; title: string; lede?: React.ReactNode }) {
  return (
    <header className="page-head">
      <p className="kicker">{kicker}</p>
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}
