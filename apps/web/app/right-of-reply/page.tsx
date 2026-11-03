import type { Metadata } from "next";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Right of reply" };

export default function RightOfReplyPage() {
  return (
    <div className="wrap">
      <PageHead
        kicker="Trust infrastructure"
        title="Right of reply"
        lede="Anyone named in a record is asked specific questions before publication, and can respond or request a correction afterwards."
      />
      <div className="split">
        <div>
          <h2>Before publication</h2>
        </div>
        <ol className="steps">
          <li>
            <strong>We identify every subject</strong>
            <p>Company, promoter, official, department, contractor or other named party in a material claim.</p>
          </li>
          <li>
            <strong>We send specific questions</strong>
            <p>A neutral summary of each claim concerning you, with dates and enough detail for a meaningful answer.</p>
          </li>
          <li>
            <strong>We give a reasonable deadline</strong>
            <p>Proportionate to the story. We keep proof of delivery and follow-up attempts.</p>
          </li>
          <li>
            <strong>We publish your response fairly</strong>
            <p>Including denials, explanations and documents. We do not paraphrase a denial to weaken it.</p>
          </li>
          <li>
            <strong>Silence is not an admission</strong>
            <p>If there is no response, we say when and how we asked — and nothing more.</p>
          </li>
        </ol>
      </div>
      <section className="section">
        <div className="split">
          <div>
            <h2>After publication</h2>
          </div>
          <div className="prose">
            <p>
              If you are named in a record, or you believe something is wrong, write to the editor with the record ID (for
              example <span className="mono">SYN-0002</span>), the specific statement and any document that shows it is
              inaccurate or out of date.
            </p>
            <div className="callout">
              <p className="callout__label">Contact channel — being set up</p>
              <p style={{ margin: 0 }}>
                A dedicated corrections address will be published here before the first real record goes live. Every request
                is logged and answered, and any resulting change appears on the <a href="/corrections">corrections page</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
