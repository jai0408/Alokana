/**
 * Public case model. Mirrors the "Core data entities" in the implementation
 * blueprint, restricted to fields that may appear on the public site.
 *
 * Confidential source identity, raw evidence storage keys and unpublished
 * claims are deliberately absent: they belong to a separate restricted store
 * and must never be added to these types.
 */

export type State = "Telangana" | "Andhra Pradesh";

/** Jurisdiction as of the event date. Pre-2 June 2014 events are undivided AP. */
export type HistoricalJurisdiction =
  | "Undivided Andhra Pradesh"
  | "Telangana"
  | "Andhra Pradesh";

export type CategoryKey =
  | "land-ownership"
  | "builder-misconduct"
  | "planning-approval"
  | "official-corruption"
  | "suspicious-property-money"
  | "government-allotment"
  | "buyer-harm"
  | "institutional-failure";

/** Public lifecycle statuses. "Lead - not verified" is internal and never published. */
export type PublicStatus =
  | "complaint-received"
  | "fir-investigation"
  | "charges-filed"
  | "regulatory-finding"
  | "proceeding-pending"
  | "judgment-issued"
  | "appeal-pending"
  | "closed";

/** Evidence hierarchy A–F. */
export type EvidenceClass = "A" | "B" | "C" | "D" | "E" | "F";

export type AmountType = "alleged" | "documented" | "ordered" | "recovered" | "estimate";

export type VerificationStatus =
  | "verified-against-original"
  | "attributed"
  | "disputed-by-subject";

export interface Source {
  id: string;
  sourceType: string;
  issuingAuthority: string;
  title: string;
  documentNumber: string;
  publicationDate: string;
  acquisitionMethod: string;
  evidenceClass: EvidenceClass;
  /** Whether a redacted public copy exists. Originals are never public. */
  redactedCopyAvailable: boolean;
  reliabilityNote?: string;
}

export interface EvidenceLink {
  sourceId: string;
  relation: "supports" | "contradicts" | "context";
  /** Exact page / paragraph / timestamp. */
  locator: string;
}

export interface Claim {
  id: string;
  /** Approved public wording — precise and attributed. */
  publicWording: string;
  subjectPartyId?: string;
  dateRange: string;
  verificationStatus: VerificationStatus;
  evidence: EvidenceLink[];
}

export interface Party {
  id: string;
  name: string;
  entityType: "company" | "public-authority" | "individual" | "buyer-group";
  role: string;
}

export interface CaseEvent {
  date: string;
  eventType: string;
  authority: string;
  caseNumber?: string;
  description: string;
  sourceId?: string;
}

export interface FinancialItem {
  amount: number;
  currency: "INR";
  amountType: AmountType;
  basis: string;
  sourceId?: string;
}

export interface ReplyRecord {
  partyId: string;
  sentAt: string;
  method: string;
  deadline: string;
  receivedAt?: string;
  /** Fair summary of the response, or null if none received. */
  responseSummary: string | null;
}

export interface Correction {
  date: string;
  version: number;
  changedFields: string[];
  note: string;
}

export interface Case {
  id: string;
  slug: string;
  title: string;
  state: State;
  historicalJurisdiction: HistoricalJurisdiction;
  district: string;
  locality: string;
  category: CategoryKey;
  summary: string;
  publicStatus: PublicStatus;
  /** Plain statement of current legal / appeal posture. */
  legalStatus: string;
  periodStart: string;
  periodEnd?: string;
  lastCheckedAt: string;
  lastUpdatedAt: string;
  version: number;
  claims: Claim[];
  sources: Source[];
  parties: Party[];
  timeline: CaseEvent[];
  financialItems: FinancialItem[];
  replies: ReplyRecord[];
  corrections: Correction[];
  /** True for fabricated demonstration records. Every fixture sets this. */
  synthetic: boolean;
}
