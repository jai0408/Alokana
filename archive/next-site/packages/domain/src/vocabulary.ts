import type { AmountType, CategoryKey, EvidenceClass, PublicStatus, VerificationStatus } from "./model";

/** Status labels and the public wording rule for each, from the case lifecycle table. */
export const STATUSES: Record<
  PublicStatus,
  { label: string; wording: string; stage: "early" | "proceeding" | "finding" | "final" }
> = {
  "complaint-received": {
    label: "Complaint received",
    wording: "A complaint was filed with an identifiable body. A complaint does not establish the claim.",
    stage: "early",
  },
  "fir-investigation": {
    label: "FIR / investigation",
    wording: "Police or an agency registered or is investigating the allegation. No finding has been made.",
    stage: "early",
  },
  "charges-filed": {
    label: "Charges filed",
    wording: "The agency has filed a chargesheet or prosecution complaint. The trial outcome is pending.",
    stage: "proceeding",
  },
  "regulatory-finding": {
    label: "Regulatory / audit finding",
    wording: "A regulator, tribunal, auditor or department made a specific finding, attributed here within its scope.",
    stage: "finding",
  },
  "proceeding-pending": {
    label: "Trial / proceeding pending",
    wording: "A court or tribunal proceeding is still active. See the last-checked date.",
    stage: "proceeding",
  },
  "judgment-issued": {
    label: "Judgment / order issued",
    wording: "A court or tribunal decided specific issues. The operative finding is summarised, not one side's argument.",
    stage: "finding",
  },
  "appeal-pending": {
    label: "Appeal / review pending",
    wording: "An appeal, review or stay is pending. The earlier outcome is not final.",
    stage: "proceeding",
  },
  closed: {
    label: "Closed / final outcome",
    wording: "The proceeding is closed. The exact outcome and any remaining appeal route are stated.",
    stage: "final",
  },
};

/** Canonical display order for the lifecycle ladder. */
export const STATUS_ORDER: PublicStatus[] = [
  "complaint-received",
  "fir-investigation",
  "charges-filed",
  "regulatory-finding",
  "proceeding-pending",
  "judgment-issued",
  "appeal-pending",
  "closed",
];

export const CATEGORIES: Record<CategoryKey, { label: string; question: string }> = {
  "land-ownership": {
    label: "Land ownership and land grabbing",
    question: "Competing title claims, forged deeds, assigned-land transfer, government land occupation.",
  },
  "builder-misconduct": {
    label: "Builder and promoter misconduct",
    question: "Collection before a compliant sale agreement, misrepresentation, duplicate sales, non-delivery.",
  },
  "planning-approval": {
    label: "Planning and approval irregularities",
    question: "Unauthorised layouts, construction deviations, missing permissions, encroachment.",
  },
  "official-corruption": {
    label: "Bribery and official corruption",
    question: "Alleged payment demands, trap cases, approvals allegedly influenced by undue advantage.",
  },
  "suspicious-property-money": {
    label: "Undisclosed or suspicious property money",
    question: "Undervaluation, benami allegations, laundering links, shell-company ownership.",
  },
  "government-allotment": {
    label: "Government land allotment and public assets",
    question: "Concessional allotment, non-use, change of purpose, unmet conditions.",
  },
  "buyer-harm": {
    label: "Buyer harm and project failure",
    question: "Delayed possession, refund disputes, hidden charges, missing amenities.",
  },
  "institutional-failure": {
    label: "Institutional failure",
    question: "Complaints not acted upon, repeated permissions despite known violations.",
  },
};

export const EVIDENCE_CLASSES: Record<EvidenceClass, { label: string; examples: string; rule: string }> = {
  A: {
    label: "Final judicial finding",
    examples: "Final judgment, conviction or acquittal, final appellate outcome.",
    rule: "State the precise finding, date, issues decided and appeal status.",
  },
  B: {
    label: "Official adjudicatory or audit finding",
    examples: "RERA order, tribunal order, audit observation, departmental finding.",
    rule: "Attribute to the authority and quote within its scope. An audit observation is not a conviction.",
  },
  C: {
    label: "Formal investigative record",
    examples: "FIR, trap case, chargesheet, prosecution complaint, attachment order.",
    rule: "Say “registered”, “filed”, “alleged” or “attached”. State whether investigation or trial is pending.",
  },
  D: {
    label: "Primary private record",
    examples: "Agreement, receipt, correspondence, bank statement, survey material.",
    rule: "Authenticate origin, context and completeness. Redact third-party personal data.",
  },
  E: {
    label: "First-hand testimony",
    examples: "Buyer, witness, former employee or resident interview.",
    rule: "Attribute carefully, assess basis of knowledge, corroborate independently.",
  },
  F: {
    label: "Secondary reporting",
    examples: "News stories, social posts, public videos.",
    rule: "A lead or attributed account only — never the sole basis for a serious allegation.",
  },
};

export const AMOUNT_TYPES: Record<AmountType, { label: string; meaning: string }> = {
  alleged: { label: "Alleged", meaning: "Amount stated in a complaint or allegation; not established." },
  documented: { label: "Documented", meaning: "Amount shown in a primary record we hold." },
  ordered: { label: "Ordered", meaning: "Amount directed by a court, regulator or authority." },
  recovered: { label: "Recovered", meaning: "Amount confirmed as actually paid or recovered." },
  estimate: { label: "Estimate", meaning: "Our calculation; method stated alongside." },
};

export const VERIFICATION: Record<VerificationStatus, string> = {
  "verified-against-original": "Checked against original record",
  attributed: "Attributed account",
  "disputed-by-subject": "Disputed by subject",
};
