import type { Metadata } from "next";
import Link from "next/link";
import { listCorrections } from "@alokana/domain";
import { PageHead, SyntheticNotice } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Corrections" };

export default function CorrectionsPage() {
  const corrections = listCorrections();
  return (
    <div className="wrap">
      <PageHead
        kicker="Trust infrastructure"
        title="Corrections"
        lede="Every material change to a published record creates a new public version with a dated note. We do not silently delete records."
      />
      <SyntheticNotice compact />
      <div className="table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Record</th>
              <th scope="col">Version</th>
              <th scope="col">What changed</th>
            </tr>
          </thead>
          <tbody>
            {corrections.map((c) => (
              <tr key={`${c.caseId}-${c.version}`}>
                <td style={{ whiteSpace: "nowrap" }}>{formatDate(c.date)}</td>
                <td>
                  <Link href={`/cases/${c.caseSlug}#history`}>{c.caseTitle}</Link>
                  <br />
                  <span className="mono muted">{c.caseId}</span>
                </td>
                <td>v{c.version}</td>
                <td>
                  {c.note} <span className="muted small">({c.changedFields.join(", ")})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose" style={{ marginTop: 40 }}>
        <h2>Our corrections policy</h2>
        <ul>
          <li>Substantiated factual errors are corrected promptly and visibly on the record itself.</li>
          <li>Status updates (new orders, appeals, stays) are recorded with the date and source.</li>
          <li>A record is withdrawn only with a public withdrawal notice and an editor&rsquo;s recorded rationale.</li>
          <li>Previous versions are retained in our internal audit log.</li>
        </ul>
        <p>
          To report an error, see <Link href="/right-of-reply">right of reply and corrections requests</Link>.
        </p>
      </div>
    </div>
  );
}
