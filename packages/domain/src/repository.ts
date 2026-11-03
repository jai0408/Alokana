import { SYNTHETIC_CASES } from "./fixtures";
import type { Case, CategoryKey, HistoricalJurisdiction, PublicStatus, State } from "./model";

/**
 * Read-only access to published cases. Backed by synthetic fixtures until the
 * PostgreSQL store exists; the public site should only ever call this module,
 * so swapping the backing store does not touch page code.
 */

export interface CaseQuery {
  q?: string;
  state?: State;
  jurisdiction?: HistoricalJurisdiction;
  district?: string;
  category?: CategoryKey;
  status?: PublicStatus;
  fromYear?: number;
  toYear?: number;
}

const year = (iso: string) => Number(iso.slice(0, 4));

export function listCases(query: CaseQuery = {}): Case[] {
  const q = query.q?.trim().toLowerCase();
  return SYNTHETIC_CASES.filter((c) => {
    if (query.state && c.state !== query.state) return false;
    if (query.jurisdiction && c.historicalJurisdiction !== query.jurisdiction) return false;
    if (query.district && c.district !== query.district) return false;
    if (query.category && c.category !== query.category) return false;
    if (query.status && c.publicStatus !== query.status) return false;
    const start = year(c.periodStart);
    const end = c.periodEnd ? year(c.periodEnd) : 2026;
    if (query.fromYear && end < query.fromYear) return false;
    if (query.toYear && start > query.toYear) return false;
    if (q) {
      const haystack = [c.id, c.title, c.summary, c.district, c.locality, ...c.sources.map((s) => s.documentNumber)]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => b.lastUpdatedAt.localeCompare(a.lastUpdatedAt));
}

export function getCaseBySlug(slug: string): Case | undefined {
  return SYNTHETIC_CASES.find((c) => c.slug === slug);
}

export function listDistricts(): { state: State; district: string; count: number }[] {
  const map = new Map<string, { state: State; district: string; count: number }>();
  for (const c of SYNTHETIC_CASES) {
    const key = `${c.state}|${c.district}`;
    const entry = map.get(key) ?? { state: c.state, district: c.district, count: 0 };
    entry.count += 1;
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => a.state.localeCompare(b.state) || a.district.localeCompare(b.district));
}

export function listCorrections() {
  return SYNTHETIC_CASES.flatMap((c) =>
    c.corrections.map((corr) => ({ ...corr, caseId: c.id, caseSlug: c.slug, caseTitle: c.title })),
  ).sort((a, b) => b.date.localeCompare(a.date));
}
