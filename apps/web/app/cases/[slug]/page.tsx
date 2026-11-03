import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AMOUNT_TYPES,
  CATEGORIES,
  EVIDENCE_CLASSES,
  STATUSES,
  STATUS_ORDER,
  VERIFICATION,
  getCaseBySlug,
  listCases,
} from "@alokana/domain";
import { StatusBadge, SyntheticNotice } from "@/components/ui";
import { formatDate, formatINR } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCaseBySlug((await params).slug);
  return { title: c ? c.title : "Case not found" };
}

const SECTIONS = [
  ["summary", "Summary"],
  ["claims", "Claims and evidence"],
  ["timeline", "Timeline"],
  ["parties", "Parties and roles"],
  ["money", "Financial amounts"],
  ["documents", "Documents"],
  ["reply", "Right of reply"],
  ["legal", "Legal and appeal status"],
  ["history", "Correction history"],
] as const;

export default async function CasePage({ params }: Props) {
  const c = getCaseBySlug((await params).slug);
  if (!c) notFound();

  const source = (id?: string) => c.sources.find((s) => s.id === id);
  const party = (id?: string) => c.parties.find((p) => p.id === id);

  return (
    <article>
      <header className="case-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/cases">Case database</Link> / <span className="mono">{c.id}</span>
          </nav>
          {c.synthetic && <SyntheticNotice />}
          <p className="kicker">{CATEGORIES[c.category].label}</p>
          <h1>{c.title}</h1>
          <StatusBadge status={c.publicStatus} />
          <p className="muted small" style={{ marginTop: 10, maxWidth: "46rem" }}>
            {STATUSES[c.publicStatus].wording}
          </p>
          <ol className="stepper" aria-label="Procedural stage">
            {STATUS_ORDER.map((k) => (
              <li key={k} aria-current={k === c.publicStatus ? "step" : undefined}>
                {STATUSES[k].label}
              </li>
            ))}
          </ol>
          <dl className="facts">
            <div>
              <dt>Location</dt>
              <dd>
                {c.locality}, {c.district}
              </dd>
            </div>
            <div>
              <dt>State today</dt>
              <dd>{c.state}</dd>
            </div>
            <div>
              <dt>Jurisdiction at event</dt>
              <dd>{c.historicalJurisdiction}</dd>
            </div>
            <div>
              <dt>Period</dt>
              <dd>
                {formatDate(c.periodStart)} – {c.periodEnd ? formatDate(c.periodEnd) : "ongoing"}
              </dd>
            </div>
            <div>
              <dt>Last checked</dt>
              <dd>{formatDate(c.lastCheckedAt)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>
                {formatDate(c.lastUpdatedAt)} · v{c.version}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="wrap case-body">
        <div>
          <section id="summary">
            <h2>Summary</h2>
            <p className="prose" style={{ fontSize: "1.08rem" }}>
              {c.summary}
            </p>
          </section>

          <section id="claims">
            <h2>Claims and evidence</h2>
            <p className="muted small">
              Each material assertion is stated separately. A source proves only what it actually records.
            </p>
            {c.claims.map((cl) => {
              const subject = party(cl.subjectPartyId);
              return (
                <div className="claim" key={cl.id}>
                  <div className="claim__head">
                    <span>
                      <span className="mono">Claim {cl.id}</span> · {cl.dateRange}
                      {subject && <> · concerns {subject.name}</>}
                    </span>
                    <span className={`vs vs--${cl.verificationStatus}`}>{VERIFICATION[cl.verificationStatus]}</span>
                  </div>
                  <p className="claim__text">{cl.publicWording}</p>
                  <ul className="claim__ev">
                    {cl.evidence.map((ev, i) => {
                      const s = source(ev.sourceId);
                      return (
                        <li key={i}>
                          <span className={`rel rel--${ev.relation}`}>{ev.relation}</span>
                          <a href={`#doc-${ev.sourceId}`}>{s?.title ?? ev.sourceId}</a>
                          <span className="muted">
                            {ev.locator}
                            {s && <> · Class {s.evidenceClass}</>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </section>

          <section id="timeline">
            <h2>Timeline</h2>
            <ol className="timeline">
              {c.timeline.map((e, i) => (
                <li key={i}>
                  <time dateTime={e.date}>{formatDate(e.date)}</time>
                  <strong>{e.eventType}</strong>
                  <p>
                    {e.description}
                    {e.authority !== "—" && <> · {e.authority}</>}
                    {e.caseNumber && (
                      <>
                        {" "}
                        · <span className="mono">{e.caseNumber}</span>
                      </>
                    )}
                    {e.sourceId && (
                      <>
                        {" "}
                        · <a href={`#doc-${e.sourceId}`}>source</a>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="parties">
            <h2>Parties and roles</h2>
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">Party</th>
                    <th scope="col">Type</th>
                    <th scope="col">Role in this record</th>
                  </tr>
                </thead>
                <tbody>
                  {c.parties.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td className="muted">{p.entityType.replace("-", " ")}</td>
                      <td>{p.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="money">
            <h2>Financial amounts</h2>
            {c.financialItems.length === 0 ? (
              <p className="muted">No financial amounts are part of this record.</p>
            ) : (
              <div className="table-scroll">
                <table className="data">
                  <thead>
                    <tr>
                      <th scope="col">Amount</th>
                      <th scope="col">Type</th>
                      <th scope="col">Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.financialItems.map((f, i) => (
                      <tr key={i}>
                        <td className="amount">{formatINR(f.amount)}</td>
                        <td>
                          <span className={`amt-type amt-type--${f.amountType}`} title={AMOUNT_TYPES[f.amountType].meaning}>
                            {AMOUNT_TYPES[f.amountType].label}
                          </span>
                        </td>
                        <td>
                          {f.basis}
                          {f.sourceId && (
                            <>
                              {" "}
                              · <a href={`#doc-${f.sourceId}`}>source</a>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section id="documents">
            <h2>Documents</h2>
            <p className="muted small">
              Original files are held privately with a recorded hash and chain of custody. Where a redacted public copy
              exists it has had personal data and metadata removed.
            </p>
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">Document</th>
                    <th scope="col">Class</th>
                    <th scope="col">Obtained</th>
                    <th scope="col">Public copy</th>
                  </tr>
                </thead>
                <tbody>
                  {c.sources.map((s) => (
                    <tr key={s.id} id={`doc-${s.id}`}>
                      <td>
                        <strong>{s.title}</strong>
                        <br />
                        <span className="muted small">
                          {s.sourceType} · {s.issuingAuthority} · {formatDate(s.publicationDate)}
                        </span>
                        <br />
                        <span className="mono muted">{s.documentNumber}</span>
                        {s.reliabilityNote && <p className="small muted" style={{ margin: "6px 0 0" }}>Note: {s.reliabilityNote}</p>}
                      </td>
                      <td title={EVIDENCE_CLASSES[s.evidenceClass].label}>
                        <strong>{s.evidenceClass}</strong>
                        <br />
                        <span className="small muted">{EVIDENCE_CLASSES[s.evidenceClass].label}</span>
                      </td>
                      <td className="small">{s.acquisitionMethod}</td>
                      <td className="small">{s.redactedCopyAvailable ? "Redacted copy (sample — no file)" : "Not published"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="reply">
            <h2>Right of reply</h2>
            {c.replies.map((r, i) => {
              const p = party(r.partyId);
              return (
                <div key={i} className={`reply${r.responseSummary ? "" : " reply--none"}`}>
                  <strong>{p?.name}</strong>
                  <p className="small muted" style={{ margin: 0 }}>
                    Questions sent {formatDate(r.sentAt)} by {r.method.toLowerCase()}; deadline {formatDate(r.deadline)}.
                    {r.receivedAt && <> Response received {formatDate(r.receivedAt)}.</>}
                  </p>
                  {r.responseSummary ? (
                    <blockquote>{r.responseSummary}</blockquote>
                  ) : (
                    <p className="small" style={{ marginTop: 8 }}>
                      No response had been received by the deadline. This should not be read as an admission. We will
                      add any response we receive.
                    </p>
                  )}
                </div>
              );
            })}
          </section>

          <section id="legal">
            <h2>Legal and appeal status</h2>
            <div className="callout">
              <p className="callout__label">As at {formatDate(c.lastCheckedAt)}</p>
              <p style={{ margin: 0 }}>{c.legalStatus}</p>
            </div>
          </section>

          <section id="history">
            <h2>Correction history</h2>
            <ul className="prose" style={{ paddingLeft: 18 }}>
              {c.corrections.map((corr) => (
                <li key={corr.version}>
                  <strong>
                    v{corr.version} · {formatDate(corr.date)}
                  </strong>{" "}
                  — {corr.note} <span className="muted small">(changed: {corr.changedFields.join(", ")})</span>
                </li>
              ))}
              <li>
                <strong>v1 · first published</strong>
              </li>
            </ul>
            <p className="small">
              Spot a factual error, or named in this record? <Link href="/right-of-reply">Request a correction or respond</Link>.
            </p>
          </section>
        </div>

        <nav className="toc" aria-label="On this page">
          <p className="kicker">On this page</p>
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </article>
  );
}
