import type { Metadata } from "next";
import Link from "next/link";
import { listDistricts, type State } from "@alokana/domain";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Explore by geography" };

export default function ExplorePage() {
  const districts = listDistricts();
  const states: State[] = ["Telangana", "Andhra Pradesh"];
  return (
    <div className="wrap">
      <PageHead
        kicker="Archive"
        title="Explore by geography"
        lede="Records grouped by present-day state and district. Events before 2 June 2014 are also tagged as undivided Andhra Pradesh."
      />
      <div className="case-grid">
        {states.map((s) => (
          <section key={s} className="callout">
            <h2>
              <Link href={`/cases?state=${encodeURIComponent(s)}`}>{s}</Link>
            </h2>
            <table className="data">
              <tbody>
                {districts
                  .filter((d) => d.state === s)
                  .map((d) => (
                    <tr key={d.district}>
                      <td>
                        <Link href={`/cases?district=${encodeURIComponent(d.district)}`}>{d.district}</Link>
                      </td>
                      <td className="muted" style={{ textAlign: "right" }}>
                        {d.count} {d.count === 1 ? "record" : "records"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
      <p className="muted small" style={{ marginTop: 24 }}>
        Map layers will be added only where location precision is safe and useful — never at a level that could identify a
        source or a private home.
      </p>
    </div>
  );
}
