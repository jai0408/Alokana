/**
 * Read-only client for the Ghost Content API. Ghost holds long-form editorial
 * content (investigations); structured case records stay in @alokana/domain.
 *
 * Server-side only: the env vars deliberately have no NEXT_PUBLIC_ prefix.
 * Publishing still happens in Ghost Admin, by a named staff editor.
 */

const GHOST_URL = process.env.GHOST_URL?.replace(/\/$/, "");
const GHOST_KEY = process.env.GHOST_CONTENT_API_KEY;

/** Ghost tag (slug) that marks a post as an investigation. */
export const INVESTIGATION_TAG = "investigation";

/** Internal Ghost tags like "#case-SYN-0002" get the slug "hash-case-syn-0002". */
const CASE_TAG_PREFIX = "hash-case-";

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  visibility: "public" | "internal";
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
}

export interface GhostPost {
  id: string;
  slug: string;
  title: string;
  html: string | null;
  excerpt: string | null;
  custom_excerpt: string | null;
  feature_image: string | null;
  feature_image_alt: string | null;
  published_at: string;
  updated_at: string;
  reading_time: number;
  tags?: GhostTag[];
  authors?: GhostAuthor[];
}

export type GhostResult<T> = { ok: true; data: T } | { ok: false; reason: "not-configured" | "unavailable" };

export function ghostConfigured(): boolean {
  return Boolean(GHOST_URL && GHOST_KEY);
}

async function request<T>(path: string, params: Record<string, string>): Promise<GhostResult<T>> {
  if (!GHOST_URL || !GHOST_KEY) return { ok: false, reason: "not-configured" };
  const url = new URL(`${GHOST_URL}/ghost/api/content/${path}`);
  url.searchParams.set("key", GHOST_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  try {
    const res = await fetch(url, {
      headers: { "Accept-Version": "v6.0" },
      next: { revalidate: 60 },
    });
    if (res.status === 404) return { ok: true, data: null as T };
    if (!res.ok) return { ok: false, reason: "unavailable" };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export async function listInvestigations(): Promise<GhostResult<GhostPost[]>> {
  const res = await request<{ posts: GhostPost[] }>("posts/", {
    filter: `tag:${INVESTIGATION_TAG}`,
    include: "tags,authors",
    fields: "id,slug,title,custom_excerpt,excerpt,feature_image,feature_image_alt,published_at,updated_at,reading_time",
    order: "published_at desc",
    limit: "50",
  });
  return res.ok ? { ok: true, data: res.data.posts } : res;
}

export async function getInvestigation(slug: string): Promise<GhostResult<GhostPost | null>> {
  if (!/^[a-z0-9-]{1,190}$/.test(slug)) return { ok: true, data: null };
  const res = await request<{ posts: GhostPost[] } | null>(`posts/slug/${slug}/`, { include: "tags,authors" });
  if (!res.ok) return res;
  const post = res.data?.posts[0];
  // Only posts tagged as investigations are served on this route.
  if (!post || !post.tags?.some((t) => t.slug === INVESTIGATION_TAG)) return { ok: true, data: null };
  return { ok: true, data: post };
}

/** Case IDs linked from a post through internal "#case-<ID>" tags. */
export function linkedCaseIds(post: GhostPost): string[] {
  return (post.tags ?? [])
    .filter((t) => t.slug.startsWith(CASE_TAG_PREFIX))
    .map((t) => t.slug.slice(CASE_TAG_PREFIX.length).toUpperCase());
}

/** Public topic tags, excluding the routing tag and internal tags. */
export function topicTags(post: GhostPost): GhostTag[] {
  return (post.tags ?? []).filter((t) => t.visibility === "public" && t.slug !== INVESTIGATION_TAG);
}
