import type { Metadata } from "next";
import { CATEGORIES, EVIDENCE_CLASSES, type CategoryKey, type EvidenceClass } from "@alokana/domain";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Methodology" };

const STEPS: [string, string][] = [
  ["Lead discovery", "Candidate leads come from official portals, court records, audit reports, news archives and citizen tips. A lead gets an internal ID and is never published at this stage."],
  ["Lead triage", "We assess public-interest value, relevance to the states and period, potential harm, source reliability, duplication and legal risk."],
  ["Record acquisition", "Official downloads, certified copies, RTI responses, filings, agreements and interviews — with acquisition date and method logged."],
  ["Preservation", "The original is stored read-only with a SHA-256 hash and source reference. Work happens on a copy."],
  ["Claim decomposition", "The story is split into atomic claims: what is asserted, about whom, over what dates, supported by what."],
  ["Corroboration", "Material disputed claims need at least two independent sources where feasible. An original official record is strong evidence of what that record itself states."],
  ["Contradiction search", "We actively look for later orders, stays, reversals, acquittals, corrective action and alternative explanations."],
  ["Right of reply", "Every material subject receives specific, fair questions. We record how and when notice was served and whether a response came."],
  ["Pre-publication review", "An editor checks sourcing and wording; counsel reviews high-risk allegations; a fact-checker verifies amounts and dates; personal data is redacted."],
  ["Publication and monitoring", "A named editor publishes the approved version. We monitor new orders and replies and update status with a visible change history."],
];

export default function MethodologyPage() {
  return (
    <div className="wrap">
      <PageHead
        kicker="Trust infrastructure"
        title="Methodology"
        lede="How a lead becomes a published record — and why most leads never do."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="split">
          <div>
            <h2>Evidence hierarchy</h2>
            <p className="muted">
              Every source is classed A–F. The class decides how we may describe what it shows. An FIR proves a case was
              registered — not that the accused committed the offence.
            </p>
          </div>
          <div className="ev-grid">
            {(Object.keys(EVIDENCE_CLASSES) as EvidenceClass[]).map((k) => (
              <div key={k} className="ev">
                <span className="ev__class">{k}</span>
                <h3>{EVIDENCE_CLASSES[k].label}</h3>
                <p>{EVIDENCE_CLASSES[k].examples}</p>
                <p>
                  <strong>How we describe it:</strong> {EVIDENCE_CLASSES[k].rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div>
            <h2>Ten-step research workflow</h2>
            <p className="muted">AI tools may assist with extraction and drafting under human review. They never decide guilt, status or publication.</p>
          </div>
          <ol className="steps">
            {STEPS.map(([t, d]) => (
              <li key={t}>
                <strong>{t}</strong>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div>
            <h2>Scope</h2>
            <p className="muted">
              1 January 2011 to 2 November 2026, Telangana and Andhra Pradesh. Some records link to earlier origins or later
              outcomes.
            </p>
          </div>
          <div className="prose">
            <p>
              <strong>Jurisdiction is recorded as at the event date.</strong> Telangana became a separate state on 2 June
              2014. Events before that date are recorded as undivided Andhra Pradesh, with the district and authority as
              they were at the time. We do not retroactively assign a pre-2014 event to a present-day state without checking.
            </p>
            <h3 style={{ marginTop: 28 }}>Categories</h3>
            <div className="table-scroll">
              <table className="data">
                <tbody>
                  {(Object.keys(CATEGORIES) as CategoryKey[]).map((k) => (
                    <tr key={k}>
                      <th scope="row" style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.93rem", color: "var(--ink)", width: "40%" }}>
                        {CATEGORIES[k].label}
                      </th>
                      <td className="muted">{CATEGORIES[k].question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={{ marginTop: 28 }}>Language we avoid</h3>
            <p>
              We do not label a transaction &ldquo;black money&rdquo;, a person &ldquo;corrupt&rdquo; or a company a
              &ldquo;scam&rdquo; unless the evidence and legal status justify exactly that wording. We publish no rankings or
              scores of people.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
