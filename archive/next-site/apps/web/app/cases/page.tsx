import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORIES,
  STATUSES,
  STATUS_ORDER,
  listCases,
  listDistricts,
  type CaseQuery,
  type CategoryKey,
  type HistoricalJurisdiction,
  type PublicStatus,
  type State,
} from "@alokana/domain";
import { CaseCard, PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Case database" };

type Params = Record<string, string | string[] | undefined>;

const STATES: State[] = ["Telangana", "Andhra Pradesh"];
const JURISDICTIONS: HistoricalJurisdiction[] = ["Undivided Andhra Pradesh", "Telangana", "Andhra Pradesh"];
const YEARS = Array.from({ length: 16 }, (_, i) => 2011 + i);

function one(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.length > 0 ? s : undefined;
}

/** Accept only known values from the query string; anything else is ignored. */
function parseQuery(p: Params): CaseQuery {
  const pick = <T extends string>(v: string | undefined, allowed: readonly T[]) =>
    v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
  const yr = (v: string | undefined) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 2000 && n <= 2030 ? n : undefined;
  };
  return {
    q: one(p.q)?.slice(0, 200),
    state: pick(one(p.state), STATES),
    jurisdiction: pick(one(p.jurisdiction), JURISDICTIONS),
    district: pick(one(p.district), listDistricts().map((d) => d.district)),
    category: pick(one(p.category), Object.keys(CATEGORIES) as CategoryKey[]),
    status: pick(one(p.status), STATUS_ORDER as PublicStatus[]),
    fromYear: yr(one(p.from)),
    toYear: yr(one(p.to)),
  };
}

export default async function CasesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const query = parseQuery(await searchParams);
  const results = listCases(query);
  const districts = listDistricts();
  const active = Object.values(query).some((v) => v !== undefined);

  return (
    <div className="wrap">
      <PageHead
        kicker="Archive"
        title="Case database"
        lede="Structured records of reviewed cases. Search covers only approved public fields — never unpublished leads, source identities or raw uploads."
      />
      <div className="db">
        <form className="filters" method="get" action="/cases" aria-label="Filter cases">
          <div className="field">
            <label htmlFor="q">Search</label>
            <input id="q" name="q" type="search" defaultValue={query.q} placeholder="Title, place, order number…" />
          </div>
          <div className="field">
            <label htmlFor="state">State (present day)</label>
            <select id="state" name="state" defaultValue={query.state ?? ""}>
              <option value="">Any</option>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="jurisdiction">Jurisdiction at event date</label>
            <select id="jurisdiction" name="jurisdiction" defaultValue={query.jurisdiction ?? ""}>
              <option value="">Any</option>
              {JURISDICTIONS.map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="district">District</label>
            <select id="district" name="district" defaultValue={query.district ?? ""}>
              <option value="">Any</option>
              {districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district} ({d.state === "Telangana" ? "TG" : "AP"})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={query.category ?? ""}>
              <option value="">Any</option>
              {(Object.keys(CATEGORIES) as CategoryKey[]).map((k) => (
                <option key={k} value={k}>
                  {CATEGORIES[k].label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">Procedural status</label>
            <select id="status" name="status" defaultValue={query.status ?? ""}>
              <option value="">Any</option>
              {STATUS_ORDER.map((k) => (
                <option key={k} value={k}>
                  {STATUSES[k].label}
                </option>
              ))}
            </select>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="from">From year</label>
              <select id="from" name="from" defaultValue={query.fromYear?.toString() ?? ""}>
                <option value="">2011</option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="to">To year</label>
              <select id="to" name="to" defaultValue={query.toYear?.toString() ?? ""}>
                <option value="">2026</option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filters__actions">
            <button type="submit" className="btn btn--primary">
              Apply filters
            </button>
            {active && (
              <Link href="/cases" className="btn btn--ghost">
                Clear
              </Link>
            )}
          </div>
        </form>

        <div>
          <div className="results-head">
            <p className="muted" style={{ margin: 0 }} aria-live="polite">
              {results.length} {results.length === 1 ? "record" : "records"}
              {active ? " match your filters" : " published"}
            </p>
            <span className="small muted">Sorted by last updated</span>
          </div>
          {results.length > 0 ? (
            <div className="case-grid">
              {results.map((c) => (
                <CaseCard key={c.id} c={c} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>No published records match these filters.</p>
              <Link href="/cases">Clear filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
