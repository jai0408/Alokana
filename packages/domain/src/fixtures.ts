import type { Case } from "./model";

/**
 * SYNTHETIC DEMONSTRATION RECORDS.
 *
 * Every party, document number, amount and event below is invented to
 * exercise the public case page. Names carry a "Sample" / "Example" marker so
 * they cannot be mistaken for real people or companies. Authorities are named
 * generically. Do not replace these with real cases in development — real
 * cases enter only through the reviewed publication workflow.
 */
export const SYNTHETIC_CASES: Case[] = [
  {
    id: "SYN-0001",
    slug: "sample-allotment-institutional-land-2008",
    title: "Institutional land allotment: utilisation conditions not met, resumption ordered",
    state: "Telangana",
    historicalJurisdiction: "Undivided Andhra Pradesh",
    district: "Rangareddy",
    locality: "Sample Village, Sample Mandal",
    category: "government-allotment",
    summary:
      "A state audit observation recorded that 40 acres allotted at a concessional rate in 2008 to a sample educational society for a campus had not been put to the stated use within the allotment period. The district revenue authority later issued a resumption order, which the society challenged. The challenge was dismissed and the order has been confirmed.",
    publicStatus: "closed",
    legalStatus:
      "Resumption order confirmed by the court on 14 Mar 2024. No further appeal was found on the court's case-status record as at the last-checked date.",
    periodStart: "2008-06-12",
    periodEnd: "2024-03-14",
    lastCheckedAt: "2026-10-28",
    lastUpdatedAt: "2026-04-02",
    version: 3,
    claims: [
      {
        id: "C1",
        publicWording:
          "The government order allotted 40 acres to Example Education Society at a concessional rate, conditional on campus construction within three years.",
        subjectPartyId: "P1",
        dateRange: "Jun 2008",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S1", relation: "supports", locator: "Paras 2–4" }],
      },
      {
        id: "C2",
        publicWording:
          "The state audit report observed that the land remained unutilised as of the audit date and that the department had not initiated recovery.",
        dateRange: "2008–2011",
        verificationStatus: "verified-against-original",
        evidence: [
          { sourceId: "S2", relation: "supports", locator: "Chapter 3, para 3.4.2" },
          { sourceId: "S3", relation: "context", locator: "Department reply, p. 2" },
        ],
      },
      {
        id: "C3",
        publicWording:
          "The society stated in its reply to the audit that construction was delayed by a pending boundary dispute.",
        subjectPartyId: "P1",
        dateRange: "2012",
        verificationStatus: "attributed",
        evidence: [{ sourceId: "S3", relation: "context", locator: "Annexure B" }],
      },
      {
        id: "C4",
        publicWording:
          "The court dismissed the society's challenge and upheld the resumption order.",
        subjectPartyId: "P1",
        dateRange: "Mar 2024",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S4", relation: "supports", locator: "Operative para 18" }],
      },
    ],
    sources: [
      {
        id: "S1",
        sourceType: "Government Order",
        issuingAuthority: "Revenue Department (sample)",
        title: "Allotment of land to Example Education Society",
        documentNumber: "SYN-GO-2008-112",
        publicationDate: "2008-06-12",
        acquisitionMethod: "Certified copy via RTI",
        evidenceClass: "B",
        redactedCopyAvailable: true,
      },
      {
        id: "S2",
        sourceType: "Audit report",
        issuingAuthority: "State audit office (sample)",
        title: "Performance audit on allotment of government land, 2006–2011",
        documentNumber: "SYN-AUD-2012-03",
        publicationDate: "2012-12-01",
        acquisitionMethod: "Official public download",
        evidenceClass: "B",
        redactedCopyAvailable: true,
        reliabilityNote: "Audit observation identifies an administrative issue; it does not establish individual culpability.",
      },
      {
        id: "S3",
        sourceType: "Department reply",
        issuingAuthority: "Revenue Department (sample)",
        title: "Reply to audit observation 3.4.2",
        documentNumber: "SYN-REV-2013-0441",
        publicationDate: "2013-02-18",
        acquisitionMethod: "Annexure to audit report",
        evidenceClass: "B",
        redactedCopyAvailable: true,
      },
      {
        id: "S4",
        sourceType: "Court judgment",
        issuingAuthority: "High Court (sample)",
        title: "Example Education Society v. State — writ petition",
        documentNumber: "SYN-WP-2019-8812",
        publicationDate: "2024-03-14",
        acquisitionMethod: "Court website certified copy",
        evidenceClass: "A",
        redactedCopyAvailable: true,
      },
    ],
    parties: [
      { id: "P1", name: "Example Education Society (fictional)", entityType: "company", role: "Allottee" },
      { id: "P2", name: "District Revenue Office (sample)", entityType: "public-authority", role: "Allotting and resuming authority" },
    ],
    timeline: [
      { date: "2008-06-12", eventType: "Allotment", authority: "Revenue Department", description: "Government order allots 40 acres at concessional rate.", sourceId: "S1" },
      { date: "2012-12-01", eventType: "Audit observation", authority: "State audit office", description: "Audit records land as unutilised.", sourceId: "S2" },
      { date: "2014-06-02", eventType: "Jurisdiction change", authority: "—", description: "Parcel falls within Telangana after bifurcation." },
      { date: "2018-09-04", eventType: "Resumption order", authority: "District Revenue Office", caseNumber: "SYN-RES-2018-07", description: "Show-cause followed by resumption order." },
      { date: "2019-01-22", eventType: "Writ petition filed", authority: "High Court", caseNumber: "SYN-WP-2019-8812", description: "Society challenges resumption." },
      { date: "2024-03-14", eventType: "Judgment", authority: "High Court", caseNumber: "SYN-WP-2019-8812", description: "Petition dismissed; resumption upheld.", sourceId: "S4" },
    ],
    financialItems: [
      { amount: 12000000, currency: "INR", amountType: "documented", basis: "Concessional price paid under the allotment order", sourceId: "S1" },
      { amount: 96000000, currency: "INR", amountType: "estimate", basis: "Our estimate of 2008 market value using the sample registration guideline value for the village. Method note available." },
    ],
    replies: [
      { partyId: "P1", sentAt: "2026-02-10", method: "Email and registered post", deadline: "2026-02-24", receivedAt: "2026-02-21", responseSummary: "The society said it accepts the court's decision and that the boundary dispute made timely construction impossible." },
      { partyId: "P2", sentAt: "2026-02-10", method: "Email to public information officer", deadline: "2026-02-24", responseSummary: null },
    ],
    corrections: [
      { date: "2026-03-01", version: 2, changedFields: ["timeline"], note: "Added the 2014 jurisdiction change to the timeline for clarity." },
      { date: "2026-04-02", version: 3, changedFields: ["financialItems"], note: "Estimate basis clarified; the figure did not change." },
    ],
    synthetic: true,
  },
  {
    id: "SYN-0002",
    slug: "sample-rera-refund-order-tower-project",
    title: "RERA refund order for delayed tower project; promoter's appeal pending",
    state: "Telangana",
    historicalJurisdiction: "Telangana",
    district: "Medchal-Malkajgiri",
    locality: "Sample Nagar",
    category: "buyer-harm",
    summary:
      "Fourteen buyers in a registered residential project complained to the real estate regulator that possession was more than two years past the date in their agreements. The regulator ordered the promoter to refund amounts paid with interest. The promoter has appealed to the appellate tribunal, where the matter is pending.",
    publicStatus: "appeal-pending",
    legalStatus:
      "Appeal pending before the appellate tribunal. A conditional stay on the refund order is in place subject to a deposit. Next hearing listed 19 Nov 2026.",
    periodStart: "2019-04-01",
    lastCheckedAt: "2026-10-30",
    lastUpdatedAt: "2026-09-15",
    version: 2,
    claims: [
      {
        id: "C1",
        publicWording: "The project was registered with the regulator with a declared completion date of 31 Dec 2022.",
        subjectPartyId: "P1",
        dateRange: "2019",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S1", relation: "supports", locator: "Registration certificate, field 9" }],
      },
      {
        id: "C2",
        publicWording: "The regulator found that the promoter failed to give possession by the agreed date and ordered refunds with interest to 14 complainants.",
        subjectPartyId: "P1",
        dateRange: "Mar 2025",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S2", relation: "supports", locator: "Paras 21–27" }],
      },
      {
        id: "C3",
        publicWording: "The promoter has said in its appeal that the delay was caused by a change in sanctioned height limits outside its control.",
        subjectPartyId: "P1",
        dateRange: "2025",
        verificationStatus: "disputed-by-subject",
        evidence: [
          { sourceId: "S3", relation: "context", locator: "Grounds of appeal, para 4" },
          { sourceId: "S2", relation: "contradicts", locator: "Para 24 (regulator rejected force majeure)" },
        ],
      },
    ],
    sources: [
      { id: "S1", sourceType: "Regulator registration record", issuingAuthority: "State RERA (sample)", title: "Project registration — Sample Heights", documentNumber: "SYN-RERA-P-2019-0477", publicationDate: "2019-04-01", acquisitionMethod: "Official portal download", evidenceClass: "B", redactedCopyAvailable: true, reliabilityNote: "Portal display; certified copy requested." },
      { id: "S2", sourceType: "Regulator order", issuingAuthority: "State RERA (sample)", title: "Order in complaints of allottees v. Sample Heights Developers", documentNumber: "SYN-RERA-C-2023-1190", publicationDate: "2025-03-11", acquisitionMethod: "Certified copy", evidenceClass: "B", redactedCopyAvailable: true },
      { id: "S3", sourceType: "Appeal memorandum", issuingAuthority: "Appellate tribunal (sample)", title: "Appeal by Sample Heights Developers", documentNumber: "SYN-AT-2025-0063", publicationDate: "2025-05-02", acquisitionMethod: "Provided by promoter with right-of-reply response", evidenceClass: "D", redactedCopyAvailable: false },
    ],
    parties: [
      { id: "P1", name: "Sample Heights Developers Pvt Ltd (fictional)", entityType: "company", role: "Promoter" },
      { id: "P2", name: "14 allottees (names withheld)", entityType: "buyer-group", role: "Complainants" },
      { id: "P3", name: "State RERA (sample)", entityType: "public-authority", role: "Regulator" },
    ],
    timeline: [
      { date: "2019-04-01", eventType: "Project registered", authority: "State RERA", description: "Declared completion: 31 Dec 2022.", sourceId: "S1" },
      { date: "2023-08-17", eventType: "Complaints filed", authority: "State RERA", caseNumber: "SYN-RERA-C-2023-1190", description: "14 allottees file complaints for delayed possession." },
      { date: "2025-03-11", eventType: "Order", authority: "State RERA", description: "Refund with interest ordered.", sourceId: "S2" },
      { date: "2025-05-02", eventType: "Appeal filed", authority: "Appellate tribunal", caseNumber: "SYN-AT-2025-0063", description: "Promoter appeals; conditional stay granted.", sourceId: "S3" },
    ],
    financialItems: [
      { amount: 98400000, currency: "INR", amountType: "ordered", basis: "Total principal refund ordered across 14 complainants, excluding interest", sourceId: "S2" },
      { amount: 0, currency: "INR", amountType: "recovered", basis: "No refund confirmed as paid as at last-checked date (order stayed)" },
    ],
    replies: [
      { partyId: "P1", sentAt: "2026-08-20", method: "Email to registered company address", deadline: "2026-09-03", receivedAt: "2026-09-01", responseSummary: "The promoter said the delay arose from a revised height clearance, that it intends to complete the project, and provided its appeal memorandum." },
    ],
    corrections: [
      { date: "2026-09-15", version: 2, changedFields: ["legalStatus"], note: "Updated to reflect the conditional stay and next hearing date." },
    ],
    synthetic: true,
  },
  {
    id: "SYN-0003",
    slug: "sample-trap-case-registration-office",
    title: "Trap case: official at a registration office charged over alleged payment demand",
    state: "Andhra Pradesh",
    historicalJurisdiction: "Andhra Pradesh",
    district: "Guntur",
    locality: "Sample Town",
    category: "official-corruption",
    summary:
      "The anti-corruption agency registered a case after a complainant alleged that a registration-office employee demanded a payment to register a sale deed. The agency has filed a chargesheet. The trial has not concluded and no finding of guilt has been made.",
    publicStatus: "charges-filed",
    legalStatus:
      "Chargesheet filed before the special court. Trial pending; charges not yet framed as at last-checked date.",
    periodStart: "2023-11-06",
    lastCheckedAt: "2026-10-21",
    lastUpdatedAt: "2026-06-30",
    version: 1,
    claims: [
      {
        id: "C1",
        publicWording: "The anti-corruption agency registered a case alleging that an employee of the registration office demanded a payment to register a sale deed.",
        subjectPartyId: "P1",
        dateRange: "Nov 2023",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S1", relation: "supports", locator: "Full press note" }],
      },
      {
        id: "C2",
        publicWording: "The agency has filed a chargesheet. The accused has not been convicted and is presumed innocent.",
        subjectPartyId: "P1",
        dateRange: "Jun 2025",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S2", relation: "supports", locator: "Case status entry" }],
      },
    ],
    sources: [
      { id: "S1", sourceType: "Agency press note", issuingAuthority: "Anti-corruption agency (sample)", title: "Press note on trap case", documentNumber: "SYN-ACB-PN-2023-219", publicationDate: "2023-11-07", acquisitionMethod: "Official website", evidenceClass: "C", redactedCopyAvailable: true },
      { id: "S2", sourceType: "Court case status", issuingAuthority: "Special court (sample)", title: "Case status record", documentNumber: "SYN-CC-2025-0144", publicationDate: "2025-06-18", acquisitionMethod: "Court case-status portal", evidenceClass: "C", redactedCopyAvailable: false },
    ],
    parties: [
      { id: "P1", name: "Registration office employee (name withheld)", entityType: "individual", role: "Accused — trial pending" },
      { id: "P2", name: "Anti-corruption agency (sample)", entityType: "public-authority", role: "Investigating agency" },
    ],
    timeline: [
      { date: "2023-11-06", eventType: "Case registered", authority: "Anti-corruption agency", description: "Trap case registered on complaint.", sourceId: "S1" },
      { date: "2025-06-18", eventType: "Chargesheet filed", authority: "Special court", caseNumber: "SYN-CC-2025-0144", description: "Chargesheet filed; trial pending.", sourceId: "S2" },
    ],
    financialItems: [
      { amount: 50000, currency: "INR", amountType: "alleged", basis: "Amount stated in the agency's press note as allegedly demanded", sourceId: "S1" },
    ],
    replies: [
      { partyId: "P1", sentAt: "2026-06-05", method: "Letter via counsel of record", deadline: "2026-06-19", responseSummary: null },
    ],
    corrections: [],
    synthetic: true,
  },
  {
    id: "SYN-0004",
    slug: "sample-unauthorised-layout-lake-buffer",
    title: "Unauthorised layout in lake buffer zone: demolition notice and partial compliance",
    state: "Telangana",
    historicalJurisdiction: "Telangana",
    district: "Sangareddy",
    locality: "Sample Cheruvu area",
    category: "planning-approval",
    summary:
      "The planning authority recorded that a 12-acre plotted layout was developed without layout permission and that part of it fell within the full tank level buffer of a lake. It issued show-cause and demolition notices. Inspection records show that roads within the buffer were removed but plot boundary walls remain.",
    publicStatus: "regulatory-finding",
    legalStatus:
      "Final order of the planning authority in force. No court challenge found on the case-status record as at last-checked date. Compliance partially recorded.",
    periodStart: "2021-02-01",
    lastCheckedAt: "2026-10-15",
    lastUpdatedAt: "2026-07-08",
    version: 1,
    claims: [
      {
        id: "C1",
        publicWording: "The planning authority found that the layout was developed without layout permission.",
        subjectPartyId: "P1",
        dateRange: "2022",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S1", relation: "supports", locator: "Order para 6" }],
      },
      {
        id: "C2",
        publicWording: "The authority's survey placed about 3.1 acres of the layout inside the lake's buffer zone.",
        dateRange: "2022",
        verificationStatus: "verified-against-original",
        evidence: [
          { sourceId: "S1", relation: "supports", locator: "Annexure II — survey sketch" },
          { sourceId: "S2", relation: "context", locator: "Field inspection report p. 3" },
        ],
      },
      {
        id: "C3",
        publicWording: "A later inspection recorded that internal roads in the buffer were removed but boundary walls remained.",
        dateRange: "Jan 2026",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S2", relation: "supports", locator: "Inspection report, findings 2–3" }],
      },
    ],
    sources: [
      { id: "S1", sourceType: "Authority order", issuingAuthority: "Urban development authority (sample)", title: "Final order on unauthorised layout, Sy. No. 101–108 (sample)", documentNumber: "SYN-UDA-ENF-2022-311", publicationDate: "2022-10-04", acquisitionMethod: "Certified copy via RTI", evidenceClass: "B", redactedCopyAvailable: true },
      { id: "S2", sourceType: "Inspection report", issuingAuthority: "Urban development authority (sample)", title: "Compliance inspection report", documentNumber: "SYN-UDA-INSP-2026-014", publicationDate: "2026-01-19", acquisitionMethod: "RTI response", evidenceClass: "B", redactedCopyAvailable: true },
    ],
    parties: [
      { id: "P1", name: "Example Layout Ventures LLP (fictional)", entityType: "company", role: "Layout developer" },
      { id: "P2", name: "Urban development authority (sample)", entityType: "public-authority", role: "Planning and enforcement authority" },
    ],
    timeline: [
      { date: "2021-02-01", eventType: "Development observed", authority: "—", description: "Plot demarcation first visible on dated satellite imagery." },
      { date: "2022-04-12", eventType: "Show-cause notice", authority: "Urban development authority", description: "Notice issued to developer." },
      { date: "2022-10-04", eventType: "Final order", authority: "Urban development authority", caseNumber: "SYN-UDA-ENF-2022-311", description: "Demolition of buffer-zone works ordered.", sourceId: "S1" },
      { date: "2026-01-19", eventType: "Compliance inspection", authority: "Urban development authority", description: "Partial compliance recorded.", sourceId: "S2" },
    ],
    financialItems: [],
    replies: [
      { partyId: "P1", sentAt: "2026-06-10", method: "Email and courier to registered office", deadline: "2026-06-24", receivedAt: "2026-06-22", responseSummary: "The developer said plots were sold only outside the buffer and that boundary walls will be removed after a pending boundary resurvey." },
      { partyId: "P2", sentAt: "2026-06-10", method: "Letter to commissioner's office", deadline: "2026-06-24", receivedAt: "2026-07-02", responseSummary: "The authority confirmed the inspection findings and said a further compliance visit is scheduled." },
    ],
    corrections: [],
    synthetic: true,
  },
  {
    id: "SYN-0005",
    slug: "sample-stalled-apartment-project-buyers",
    title: "Stalled apartment project: buyers' complaints pending before regulator",
    state: "Andhra Pradesh",
    historicalJurisdiction: "Andhra Pradesh",
    district: "Visakhapatnam",
    locality: "Sample Puram",
    category: "builder-misconduct",
    summary:
      "Buyers in an apartment project say construction has been halted since 2023 and that payments were collected beyond the stage of construction. Complaints have been filed with the regulator and are pending. The regulator has not made a finding.",
    publicStatus: "complaint-received",
    legalStatus: "Complaints pending before the regulator; first hearing held, next date not yet listed.",
    periodStart: "2020-09-15",
    lastCheckedAt: "2026-10-31",
    lastUpdatedAt: "2026-10-31",
    version: 1,
    claims: [
      {
        id: "C1",
        publicWording: "Twenty-two buyers have filed complaints with the regulator alleging that construction stopped in 2023.",
        subjectPartyId: "P1",
        dateRange: "2025–2026",
        verificationStatus: "verified-against-original",
        evidence: [{ sourceId: "S1", relation: "supports", locator: "Complaint status report rows 4–25" }],
      },
      {
        id: "C2",
        publicWording: "Buyers interviewed by our researchers said they had paid up to 80% of the price while the structure had reached the fourth of twelve floors.",
        dateRange: "2023",
        verificationStatus: "attributed",
        evidence: [
          { sourceId: "S2", relation: "supports", locator: "Interviews 1–5 (identities protected)" },
          { sourceId: "S3", relation: "supports", locator: "Payment receipts, redacted" },
        ],
      },
    ],
    sources: [
      { id: "S1", sourceType: "Regulator status report", issuingAuthority: "State RERA (sample)", title: "Complaint status report", documentNumber: "SYN-APRERA-MIS-2026-10", publicationDate: "2026-10-01", acquisitionMethod: "Official portal report", evidenceClass: "B", redactedCopyAvailable: true, reliabilityNote: "Status report confirms filing only; it records no finding." },
      { id: "S2", sourceType: "Interviews", issuingAuthority: "Project researchers", title: "Buyer interviews, Sep 2026", documentNumber: "SYN-INT-2026-031", publicationDate: "2026-09-20", acquisitionMethod: "In-person interviews with consent", evidenceClass: "E", redactedCopyAvailable: false },
      { id: "S3", sourceType: "Payment receipts", issuingAuthority: "Issued by promoter", title: "Buyer payment receipts (5 buyers)", documentNumber: "SYN-RCPT-BUNDLE-07", publicationDate: "2023-05-01", acquisitionMethod: "Supplied by buyers; originals sighted", evidenceClass: "D", redactedCopyAvailable: true },
    ],
    parties: [
      { id: "P1", name: "Sample Coastal Homes Pvt Ltd (fictional)", entityType: "company", role: "Promoter" },
      { id: "P2", name: "22 buyers (names withheld)", entityType: "buyer-group", role: "Complainants" },
    ],
    timeline: [
      { date: "2020-09-15", eventType: "Project launched", authority: "—", description: "Bookings opened." },
      { date: "2023-03-01", eventType: "Construction halted", authority: "—", description: "According to buyers interviewed; date not independently confirmed." },
      { date: "2025-12-04", eventType: "Complaints filed", authority: "State RERA", description: "First of 22 complaints filed.", sourceId: "S1" },
    ],
    financialItems: [
      { amount: 132000000, currency: "INR", amountType: "alleged", basis: "Total paid as stated in the 22 complaints" },
      { amount: 21600000, currency: "INR", amountType: "documented", basis: "Sum of receipts we have sighted for 5 buyers", sourceId: "S3" },
    ],
    replies: [
      { partyId: "P1", sentAt: "2026-10-14", method: "Email and registered post", deadline: "2026-10-28", responseSummary: null },
    ],
    corrections: [],
    synthetic: true,
  },
];
