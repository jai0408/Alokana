import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseById, type Case } from "@alokana/domain";
import { CaseCard } from "@/components/ui";
import { GhostUnavailable } from "@/components/ghost-notice";
import { formatDate } from "@/lib/format";
import { getInvestigation, linkedCaseIds, topicTags } from "@/lib/ghost";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await getInvestigation((await params).slug);
  const post = res.ok ? res.data : null;
  return post ? { title: post.title, description: post.custom_excerpt ?? post.excerpt ?? undefined } : { title: "Investigation" };
}

export default async function InvestigationPage({ params }: Props) {
  const res = await getInvestigation((await params).slug);
  if (!res.ok) {
    return (
      <div className="wrap" style={{ paddingTop: 56 }}>
        <GhostUnavailable reason={res.reason} />
      </div>
    );
  }
  const post = res.data;
  if (!post) notFound();

  const cases = linkedCaseIds(post)
    .map(getCaseById)
    .filter((c): c is Case => c !== undefined);
  const updated = post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10);

  return (
    <article>
      <header className="case-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/investigations">Investigations</Link>
          </nav>
          <p className="kicker">
            {topicTags(post)
              .map((t) => t.name)
              .join(" · ") || "Investigation"}
          </p>
          <h1 style={{ maxWidth: "24ch" }}>{post.title}</h1>
          {post.custom_excerpt && <p className="lede">{post.custom_excerpt}</p>}
          <p className="small muted" style={{ margin: 0 }}>
            {post.authors && post.authors.length > 0 && <>By {post.authors.map((a) => a.name).join(", ")} · </>}
            Published {formatDate(post.published_at.slice(0, 10))}
            {updated && <> · Updated {formatDate(post.updated_at.slice(0, 10))}</>} · {post.reading_time} min read
          </p>
        </div>
      </header>

      <div className="wrap inv-body">
        {post.feature_image && (
          <figure className="inv-figure">
            {/* Plain <img>: the Ghost image host varies by deployment. */}
            <img src={post.feature_image} alt={post.feature_image_alt ?? ""} />
          </figure>
        )}
        {/* HTML comes from Ghost staff editors (trusted authors), not from the public. */}
        <div className="ghost-content" dangerouslySetInnerHTML={{ __html: post.html ?? "" }} />

        {cases.length > 0 && (
          <aside className="inv-cases" aria-labelledby="linked-records">
            <h2 id="linked-records">Case records in this investigation</h2>
            <p className="muted small">Claim-by-claim evidence, current status and right-of-reply responses for each record.</p>
            <div className="case-grid">
              {cases.map((c) => (
                <CaseCard key={c.id} c={c} />
              ))}
            </div>
          </aside>
        )}

        <p className="small muted" style={{ marginTop: 40 }}>
          Spot an error, or named in this piece? <Link href="/right-of-reply">Request a correction or respond</Link>.
        </p>
      </div>
    </article>
  );
}
