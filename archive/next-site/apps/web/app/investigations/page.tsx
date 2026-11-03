import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui";
import { GhostUnavailable } from "@/components/ghost-notice";
import { formatDate } from "@/lib/format";
import { linkedCaseIds, listInvestigations, topicTags } from "@/lib/ghost";

export const metadata: Metadata = { title: "Investigations" };
export const revalidate = 60;

export default async function InvestigationsPage() {
  const res = await listInvestigations();

  return (
    <div className="wrap">
      <PageHead
        kicker="Long-form"
        title="Investigations"
        lede="Reported pieces that explain a pattern or a single case in depth. Every material claim links back to a structured case record and its evidence."
      />
      {!res.ok ? (
        <GhostUnavailable reason={res.reason} />
      ) : res.data.length === 0 ? (
        <div className="empty">
          <p>No investigations have been published yet.</p>
        </div>
      ) : (
        <ol className="inv-list">
          {res.data.map((p) => {
            const cases = linkedCaseIds(p);
            return (
              <li key={p.id} className="inv-item">
                <p className="inv-item__meta">
                  <time dateTime={p.published_at}>{formatDate(p.published_at.slice(0, 10))}</time>
                  {topicTags(p).map((t) => (
                    <span key={t.id} className="tag">
                      {t.name}
                    </span>
                  ))}
                </p>
                <h2 className="inv-item__title">
                  <Link href={`/investigations/${p.slug}`}>{p.title}</Link>
                </h2>
                {(p.custom_excerpt ?? p.excerpt) && <p className="inv-item__dek">{p.custom_excerpt ?? p.excerpt}</p>}
                <p className="small muted" style={{ margin: 0 }}>
                  {p.reading_time} min read
                  {cases.length > 0 && <> · {cases.length} linked case {cases.length === 1 ? "record" : "records"}</>}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
