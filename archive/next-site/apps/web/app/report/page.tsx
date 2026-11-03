import type { Metadata } from "next";
import { CATEGORIES, type CategoryKey } from "@alokana/domain";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Report a concern" };

/**
 * Preview only. Intake stays closed until the security review, threat model and
 * legal sign-off on retention are complete (roadmap phase 4). This form has no
 * action and every control is disabled, so nothing can be submitted or stored.
 */
export default function ReportPage() {
  return (
    <div className="wrap">
      <PageHead
        kicker="Secure intake"
        title="Report a concern"
        lede="Tips and documents help us find patterns. They are a starting point for research — never published as received."
      />

      <div className="intake-closed" role="status">
        <h2 style={{ fontSize: "1.25rem" }}>Intake is not open yet</h2>
        <p style={{ margin: 0 }}>
          We will accept reports only after an independent security review and legal sign-off on how submissions are
          stored, who can see them and how long they are kept. The form below shows what intake will ask for; it cannot be
          submitted.
        </p>
      </div>

      <div className="split">
        <div className="prose">
          <h2>Before you share anything</h2>
          <p>
            <strong>We cannot promise absolute anonymity.</strong> When intake opens, this page will explain exactly what
            the channel records (for example IP addresses or email headers), who on the team can see your identity, and
            when we might be legally compelled to share information.
          </p>
          <p>Your identity will be stored separately from any case record. Case editors will not see it by default.</p>
          <h3 style={{ marginTop: 24 }}>Never send us</h3>
          <ul className="dont">
            <li>Aadhaar or PAN numbers</li>
            <li>Full bank account or card numbers</li>
            <li>Passwords or login details</li>
            <li>Unrelated family information</li>
            <li>Material obtained by trespass, hacking or unlawful recording</li>
          </ul>
        </div>

        <form aria-label="Report form preview (disabled)">
          <fieldset disabled>
            <legend>What happened</legend>
            <div className="field">
              <label htmlFor="r-cat">Type of concern</label>
              <select id="r-cat">
                {(Object.keys(CATEGORIES) as CategoryKey[]).map((k) => (
                  <option key={k}>{CATEGORIES[k].label}</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="r-state">State</label>
                <select id="r-state">
                  <option>Telangana</option>
                  <option>Andhra Pradesh</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="r-district">District</label>
                <input id="r-district" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="r-desc">Describe what you know first-hand (English or Telugu)</label>
              <textarea id="r-desc" />
            </div>
            <div className="field">
              <label htmlFor="r-refs">Any official reference numbers (RERA, FIR, court case, survey number)</label>
              <input id="r-refs" />
            </div>
          </fieldset>
          <fieldset disabled>
            <legend>Contact (optional)</legend>
            <div className="field">
              <label htmlFor="r-contact">A safe way to reach you</label>
              <input id="r-contact" />
            </div>
            <p className="small muted" style={{ margin: 0 }}>
              File upload will be added only after malware scanning, quarantine storage and encryption are in place.
            </p>
          </fieldset>
          <button type="button" className="btn btn--primary" disabled>
            Submission not yet available
          </button>
        </form>
      </div>
    </div>
  );
}
