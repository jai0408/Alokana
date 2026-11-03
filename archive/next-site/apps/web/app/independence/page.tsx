import type { Metadata } from "next";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Funding & independence" };

export default function IndependencePage() {
  return (
    <div className="wrap">
      <PageHead
        kicker="Trust infrastructure"
        title="Funding & independence"
        lede="No one can pay to add, suppress, remove or alter a record."
      />
      <div className="prose">
        <h2>Editorial independence</h2>
        <ul>
          <li>No developer, broker, political party, official or complainant can pay to add, suppress, remove or alter a case.</li>
          <li>Sponsorship, advertising and donations are kept separate from case selection and editorial decisions.</li>
          <li>Political and commercial affiliations play no part in which cases we investigate.</li>
          <li>Serious allegations follow a two-person rule: one researcher builds the case; a second editor independently checks each material claim.</li>
          <li>Corrections are public and versioned.</li>
        </ul>
        <h2 style={{ marginTop: 40 }}>Funding sources</h2>
        <div className="callout">
          <p className="callout__label">To be published before launch</p>
          <p style={{ margin: 0 }}>
            A full list of funders and our conflict-of-interest policy will appear here before the archive publishes its first
            real record.
          </p>
        </div>
      </div>
    </div>
  );
}
