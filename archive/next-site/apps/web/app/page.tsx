import Link from "next/link";
import { STATUSES, STATUS_ORDER, listCases } from "@alokana/domain";
import { CaseCard, StatusBadge } from "@/components/ui";

export default function Home() {
  const recent = listCases().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <p className="kicker">Telangana · Andhra Pradesh · 2011–2026</p>
            <h1>
              A public record of <em>documented</em> real-estate events.
            </h1>
            <p className="lede">
              Land, housing and public resources: case records built from original documents, official findings and
              attributed testimony — each with its current legal status, the subject&rsquo;s response and a visible
              correction history.
            </p>
            <div className="hero__actions">
              <Link href="/cases" className="btn btn--primary">
                Browse the case database
              </Link>
              <Link href="/methodology" className="btn btn--ghost">
                How we verify
              </Link>
            </div>
          </div>
          <aside className="principle" aria-label="Central principle">
            <p className="kicker">The central principle</p>
            <p>
              Not a rumour board. Every published claim points to evidence, shows its current status, includes a fair
              response and is approved by a named human editor.
            </p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="kicker">Reading a case page</p>
          <h2>What every record tells you</h2>
          <div className="reads">
            <div>
              <span className="num">01</span>
              <h3>Claim by claim</h3>
              <p>Each assertion is stated separately and linked to the exact page or paragraph that supports it.</p>
            </div>
            <div>
              <span className="num">02</span>
              <h3>Where it stands</h3>
              <p>Complaint, FIR, charge, finding, judgment, appeal or final outcome — and when we last checked.</p>
            </div>
            <div>
              <span className="num">03</span>
              <h3>Both sides</h3>
              <p>Every named subject is sent specific questions before publication. Responses are published fairly.</p>
            </div>
            <div>
              <span className="num">04</span>
              <h3>Labelled money</h3>
              <p>Amounts are marked alleged, documented, ordered, recovered or estimated. Never blurred together.</p>
            </div>
            <div>
              <span className="num">05</span>
              <h3>Jurisdiction in time</h3>
              <p>Events before 2 June 2014 are recorded as undivided Andhra Pradesh, as they were at the time.</p>
            </div>
            <div>
              <span className="num">06</span>
              <h3>Versioned</h3>
              <p>Material changes create a new public version with a dated note. Nothing is silently deleted.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="results-head">
            <div>
              <p className="kicker">Recently updated</p>
              <h2 style={{ margin: 0 }}>From the archive</h2>
            </div>
            <Link href="/cases">All records →</Link>
          </div>
          <div className="case-grid case-grid--3">
            {recent.map((c) => (
              <CaseCard key={c.id} c={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <p className="kicker">Status labels</p>
            <h2>A complaint is not a conviction</h2>
            <p className="muted">
              The status on a record describes the procedural stage reached — nothing more. We use the wording the stage
              justifies.
            </p>
          </div>
          <ol className="ladder">
            {STATUS_ORDER.map((key) => (
              <li key={key}>
                <span>
                  <StatusBadge status={key} />
                </span>
                <p>{STATUSES[key].wording}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <p className="kicker">Report a concern</p>
            <h2>Have documents or first-hand knowledge?</h2>
          </div>
          <div className="prose">
            <p>
              Public intake is not open yet. It opens only after an independent security review and legal sign-off on
              how submissions are stored, who can see them and how long they are kept.
            </p>
            <p>
              <Link href="/report">Read what intake will look like and what we will never ask for →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
