// Builds a Ghost content import (Settings → Advanced → Import/Export → Import) from the
// SYNTHETIC fixtures in the archived domain package, plus the trust pages.
//
//   node content/build-import.mjs   →   content/alokana-sample-content.json
//
// Every record produced here is synthetic and tagged #synthetic. Real cases enter Ghost
// only through the reviewed publication workflow, never through this script.
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { SYNTHETIC_CASES } from "../archive/next-site/packages/domain/src/fixtures.ts";
import {
  AMOUNT_TYPES,
  CATEGORIES,
  EVIDENCE_CLASSES,
  STATUSES,
  STATUS_ORDER,
  VERIFICATION,
} from "../archive/next-site/packages/domain/src/vocabulary.ts";

const OUT = new URL("./alokana-sample-content.json", import.meta.url);

// ---------- helpers ----------
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const id = (key) => createHash("sha1").update(key).digest("hex").slice(0, 24);
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fmtDate = (iso) => dateFmt.format(new Date(`${iso}T00:00:00Z`));
const trimNum = (n) => n.toFixed(2).replace(/\.?0+$/, "");
const fmtINR = (a) => (a >= 1e7 ? `₹${trimNum(a / 1e7)} crore` : a >= 1e5 ? `₹${trimNum(a / 1e5)} lakh` : `₹${a.toLocaleString("en-IN")}`);
const iso = (d) => new Date(`${d}T09:00:00Z`).toISOString();

/** Ghost's custom_excerpt is limited to 300 characters; cut at a sentence end where possible. */
function excerpt(text) {
  if (text.length <= 300) return text;
  const cut = text.slice(0, 300);
  const end = cut.lastIndexOf(". ");
  return end > 120 ? cut.slice(0, end + 1) : `${cut.slice(0, 297).trimEnd()}…`;
}

// Lexical nodes. Structured sections are HTML cards so their markup survives import intact;
// headings and prose stay native so editors can work on them in the Ghost editor.
const text = (t) => ({ detail: 0, format: 0, mode: "normal", style: "", text: t, type: "extended-text", version: 1 });
const heading = (t, tag = "h2") => ({ children: [text(t)], direction: "ltr", format: "", indent: 0, type: "extended-heading", version: 1, tag });
const para = (t) => ({ children: [text(t)], direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1 });
const html = (h) => ({ type: "html", version: 1, html: h.trim() });
const lexical = (children) =>
  JSON.stringify({ root: { children, direction: "ltr", format: "", indent: 0, type: "root", version: 1 } });

// ---------- tags ----------
const tags = new Map();
function tag(name, slug, extra = {}) {
  if (!tags.has(slug)) {
    tags.set(slug, {
      id: id(`tag:${slug}`),
      name,
      slug,
      visibility: name.startsWith("#") ? "internal" : "public",
      ...extra,
    });
  }
  return tags.get(slug);
}
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const internal = (name) => tag(`#${name}`, `hash-${slugify(name)}`);

const T_CASE = tag("Case record", "case", { description: "Structured records of documented events." });
const T_INV = tag("Investigation", "investigation", { description: "Long-form reported pieces." });
const T_TRUST = tag("Trust infrastructure", "trust");
const T_ARCHIVE = tag("Archive", "archive");
for (const [key, c] of Object.entries(CATEGORIES)) tag(c.label, key, { description: c.question });

// ---------- case records ----------
function caseBody(c) {
  const source = (sid) => c.sources.find((s) => s.id === sid);
  const party = (pid) => c.parties.find((p) => p.id === pid);
  const docLink = (sid) => (sid ? ` · <a href="#doc-${esc(sid)}">source</a>` : "");

  const facts = `
<dl class="facts">
  <div><dt>Record ID</dt><dd class="mono">${esc(c.id)}</dd></div>
  <div><dt>Location</dt><dd>${esc(c.locality)}, ${esc(c.district)}</dd></div>
  <div><dt>State today</dt><dd>${esc(c.state)}</dd></div>
  <div><dt>Jurisdiction at event</dt><dd>${esc(c.historicalJurisdiction)}</dd></div>
  <div><dt>Period</dt><dd>${fmtDate(c.periodStart)} – ${c.periodEnd ? fmtDate(c.periodEnd) : "ongoing"}</dd></div>
  <div><dt>Last checked</dt><dd>${fmtDate(c.lastCheckedAt)}</dd></div>
  <div><dt>Version</dt><dd>v${c.version} · ${fmtDate(c.lastUpdatedAt)}</dd></div>
</dl>`;

  const claims = `
<p class="muted small">Each material assertion is stated separately. A source proves only what it actually records.</p>
${c.claims
  .map((cl) => {
    const subject = party(cl.subjectPartyId);
    const ev = cl.evidence
      .map((e) => {
        const s = source(e.sourceId);
        return `<li><span class="rel rel--${e.relation}">${e.relation}</span><a href="#doc-${esc(e.sourceId)}">${esc(s?.title ?? e.sourceId)}</a><span class="muted">${esc(e.locator)}${s ? ` · Class ${s.evidenceClass}` : ""}</span></li>`;
      })
      .join("");
    return `<div class="claim">
  <div class="claim__head"><span><span class="mono">Claim ${esc(cl.id)}</span> · ${esc(cl.dateRange)}${subject ? ` · concerns ${esc(subject.name)}` : ""}</span><span class="vs vs--${cl.verificationStatus}">${esc(VERIFICATION[cl.verificationStatus])}</span></div>
  <p class="claim__text">${esc(cl.publicWording)}</p>
  <ul class="claim__ev">${ev}</ul>
</div>`;
  })
  .join("\n")}`;

  const timeline = `
<ol class="timeline">
${c.timeline
  .map(
    (e) =>
      `<li><time datetime="${e.date}">${fmtDate(e.date)}</time><strong>${esc(e.eventType)}</strong><p>${esc(e.description)}${e.authority !== "—" ? ` · ${esc(e.authority)}` : ""}${e.caseNumber ? ` · <span class="mono">${esc(e.caseNumber)}</span>` : ""}${docLink(e.sourceId)}</p></li>`,
  )
  .join("\n")}
</ol>`;

  const parties = `
<div class="table-scroll"><table class="data">
<thead><tr><th scope="col">Party</th><th scope="col">Type</th><th scope="col">Role in this record</th></tr></thead>
<tbody>${c.parties.map((p) => `<tr><td>${esc(p.name)}</td><td class="muted">${esc(p.entityType.replace("-", " "))}</td><td>${esc(p.role)}</td></tr>`).join("")}</tbody>
</table></div>`;

  const money =
    c.financialItems.length === 0
      ? `<p class="muted">No financial amounts are part of this record.</p>`
      : `
<div class="table-scroll"><table class="data">
<thead><tr><th scope="col">Amount</th><th scope="col">Type</th><th scope="col">Basis</th></tr></thead>
<tbody>${c.financialItems
          .map(
            (f) =>
              `<tr><td class="amount">${fmtINR(f.amount)}</td><td><span class="amt-type amt-type--${f.amountType}" title="${esc(AMOUNT_TYPES[f.amountType].meaning)}">${AMOUNT_TYPES[f.amountType].label}</span></td><td>${esc(f.basis)}${docLink(f.sourceId)}</td></tr>`,
          )
          .join("")}</tbody>
</table></div>`;

  const documents = `
<p class="muted small">Original files are held privately with a recorded hash and chain of custody. Where a redacted public copy exists it has had personal data and metadata removed.</p>
<div class="table-scroll"><table class="data">
<thead><tr><th scope="col">Document</th><th scope="col">Class</th><th scope="col">Obtained</th><th scope="col">Public copy</th></tr></thead>
<tbody>${c.sources
    .map(
      (s) =>
        `<tr id="doc-${esc(s.id)}"><td><strong>${esc(s.title)}</strong><br><span class="muted small">${esc(s.sourceType)} · ${esc(s.issuingAuthority)} · ${fmtDate(s.publicationDate)}</span><br><span class="mono muted">${esc(s.documentNumber)}</span>${s.reliabilityNote ? `<p class="small muted">Note: ${esc(s.reliabilityNote)}</p>` : ""}</td><td title="${esc(EVIDENCE_CLASSES[s.evidenceClass].label)}"><strong>${s.evidenceClass}</strong><br><span class="small muted">${esc(EVIDENCE_CLASSES[s.evidenceClass].label)}</span></td><td class="small">${esc(s.acquisitionMethod)}</td><td class="small">${s.redactedCopyAvailable ? "Redacted copy (sample — no file)" : "Not published"}</td></tr>`,
    )
    .join("")}</tbody>
</table></div>`;

  const replies = c.replies
    .map((r) => {
      const p = party(r.partyId);
      const meta = `Questions sent ${fmtDate(r.sentAt)} by ${esc(r.method.toLowerCase())}; deadline ${fmtDate(r.deadline)}.${r.receivedAt ? ` Response received ${fmtDate(r.receivedAt)}.` : ""}`;
      return r.responseSummary
        ? `<div class="reply"><strong>${esc(p?.name ?? r.partyId)}</strong><p class="small muted">${meta}</p><blockquote>${esc(r.responseSummary)}</blockquote></div>`
        : `<div class="reply reply--none"><strong>${esc(p?.name ?? r.partyId)}</strong><p class="small muted">${meta}</p><p class="small" style="margin-top:8px">No response had been received by the deadline. This should not be read as an admission. We will add any response we receive.</p></div>`;
    })
    .join("\n");

  const legal = `
<div class="callout"><p class="callout__label">As at ${fmtDate(c.lastCheckedAt)}</p><p style="margin:0">${esc(c.legalStatus)}</p></div>`;

  const history = `
<ul style="padding-left:18px">
${c.corrections.map((k) => `<li><strong>v${k.version} · ${fmtDate(k.date)}</strong> — ${esc(k.note)} <span class="muted small">(changed: ${esc(k.changedFields.join(", "))})</span></li>`).join("\n")}
<li><strong>v1 · first published</strong></li>
</ul>`;

  return [
    html(facts),
    heading("Summary"),
    para(c.summary),
    heading("Claims and evidence"),
    html(claims),
    heading("Timeline"),
    html(timeline),
    heading("Parties and roles"),
    html(parties),
    heading("Financial amounts"),
    html(money),
    heading("Documents"),
    html(documents),
    heading("Right of reply"),
    html(replies),
    heading("Legal and appeal status"),
    html(legal),
    heading("Correction history"),
    html(history),
  ];
}

const posts = [];
const postsTags = [];
function addPost({ key, type = "post", title, slug, excerptText, body, tagList, publishedAt, updatedAt }) {
  const pid = id(`post:${key}`);
  posts.push({
    id: pid,
    title,
    slug,
    type,
    status: "published",
    visibility: "public",
    featured: 0,
    lexical: lexical(body),
    mobiledoc: null,
    custom_excerpt: excerptText ?? null,
    published_at: publishedAt,
    created_at: publishedAt,
    updated_at: updatedAt ?? publishedAt,
  });
  tagList.forEach((t, i) => postsTags.push({ id: id(`pt:${key}:${t.slug}`), post_id: pid, tag_id: t.id, sort_order: i }));
}

for (const c of SYNTHETIC_CASES) {
  // Tag order is a theme convention: Case record, category, district, state, then internal tags.
  const tagList = [
    T_CASE,
    tags.get(c.category),
    tag(c.district, slugify(c.district)),
    tag(c.state, slugify(c.state)),
    internal(`status-${c.publicStatus}`),
    internal(`case-${c.id}`),
    internal("synthetic"),
  ];
  if (c.historicalJurisdiction === "Undivided Andhra Pradesh") tagList.push(internal("undivided-ap"));
  const firstPublished = c.corrections.length ? c.corrections[c.corrections.length - 1].date : c.lastUpdatedAt;
  addPost({
    key: `case:${c.id}`,
    title: c.title,
    slug: c.slug,
    excerptText: excerpt(c.summary),
    body: caseBody(c),
    tagList,
    publishedAt: iso(firstPublished < c.lastUpdatedAt ? firstPublished : c.lastUpdatedAt),
    updatedAt: iso(c.lastUpdatedAt),
  });
}

// ---------- sample investigation ----------
{
  const linked = SYNTHETIC_CASES.filter((c) => c.id === "SYN-0002" || c.id === "SYN-0005");
  addPost({
    key: "investigation:sample",
    title: "Sample investigation: what happens to buyers when a project stalls",
    slug: "sample-investigation-stalled-projects",
    excerptText:
      "A format demonstration. It shows how a long-form piece sits on top of structured case records. Every record it refers to is synthetic.",
    body: [
      html(`<div class="synthetic" role="note"><strong>Synthetic sample.</strong> This piece demonstrates the investigation format. It refers only to invented sample records and describes no real person, company or event.</div>`),
      para(
        "An investigation explains a pattern or a single case in depth. It is written and edited in Ghost, but it does not carry its own evidence: every material claim points back to a structured case record, where the claim, its sources, its current status and the subject's response are set out one by one.",
      ),
      heading("How the pieces connect"),
      para(
        `This sample is linked to ${linked.map((c) => `${c.id} (${c.title})`).join(" and ")}. The link is made with internal Ghost tags of the form #case-SYN-0002, which put each record's card at the end of the article and list the article on the record's own page.`,
      ),
      heading("What an investigation may not do"),
      para(
        "It may not state as fact anything the linked records only allege, and it must use the status wording for each record: a complaint received is not a finding, and charges filed are not a conviction. A complaint, FIR or chargesheet is not a finding of guilt.",
      ),
    ],
    tagList: [T_INV, tags.get("buyer-harm"), ...linked.map((c) => internal(`case-${c.id}`)), internal("synthetic")],
    publishedAt: iso("2026-10-30"),
  });
}

// ---------- trust pages ----------
const split = (left, right) => `<section class="section"><div class="split"><div>${left}</div>${right}</div></section>`;

const methodologySteps = [
  ["Lead discovery", "Candidate leads come from official portals, court records, audit reports, news archives and citizen tips. A lead gets an internal ID and is never published at this stage."],
  ["Lead triage", "We assess public-interest value, relevance to the states and period, potential harm, source reliability, duplication and legal risk."],
  ["Record acquisition", "Official downloads, certified copies, RTI responses, filings, agreements and interviews — with acquisition date and method logged."],
  ["Preservation", "The original is stored read-only with a SHA-256 hash and source reference. Work happens on a copy."],
  ["Claim decomposition", "The story is split into atomic claims: what is asserted, about whom, over what dates, supported by what."],
  ["Corroboration", "Material disputed claims need at least two independent sources where feasible. An original official record is strong evidence of what that record itself states."],
  ["Contradiction search", "We actively look for later orders, stays, reversals, acquittals, corrective action and alternative explanations."],
  ["Right of reply", "Every material subject receives specific, fair questions. We record how and when notice was served and whether a response came."],
  ["Pre-publication review", "An editor checks sourcing and wording; counsel reviews high-risk allegations; a fact-checker verifies amounts and dates; personal data is redacted."],
  ["Publication and monitoring", "A named editor publishes the approved version. We monitor new orders and replies and update status with a visible change history."],
];
const steps = (items) => `<ol class="steps">${items.map(([t, d]) => `<li><strong>${esc(t)}</strong><p>${esc(d)}</p></li>`).join("")}</ol>`;
const stageClass = (k) => `status status--${STATUSES[k].stage}`;

const pages = [
  {
    slug: "methodology",
    title: "Methodology",
    lede: "How a lead becomes a published record — and why most leads never do.",
    tag: T_TRUST,
    body: [
      html(
        split(
          `<h2>Evidence hierarchy</h2><p class="muted">Every source is classed A–F. The class decides how we may describe what it shows. An FIR proves a case was registered — not that the accused committed the offence.</p>`,
          `<div class="ev-grid">${Object.entries(EVIDENCE_CLASSES)
            .map(([k, e]) => `<div class="ev"><span class="ev__class">${k}</span><h3>${esc(e.label)}</h3><p>${esc(e.examples)}</p><p><strong>How we describe it:</strong> ${esc(e.rule)}</p></div>`)
            .join("")}</div>`,
        ),
      ),
      html(
        split(
          `<h2>Status labels</h2><p class="muted">The status on a record describes the procedural stage reached — nothing more.</p>`,
          `<ol class="ladder">${STATUS_ORDER.map((k) => `<li><span><span class="${stageClass(k)}"><span class="status__dot" aria-hidden="true"></span>${esc(STATUSES[k].label)}</span></span><p>${esc(STATUSES[k].wording)}</p></li>`).join("")}</ol>`,
        ),
      ),
      html(
        split(
          `<h2>Ten-step research workflow</h2><p class="muted">AI tools may assist with extraction and drafting under human review. They never decide guilt, status or publication.</p>`,
          steps(methodologySteps),
        ),
      ),
      html(
        split(
          `<h2>Labelled money</h2><p class="muted">Amounts are never blurred together.</p>`,
          `<div class="table-scroll"><table class="data"><tbody>${Object.values(AMOUNT_TYPES)
            .map((a) => `<tr><th scope="row" style="text-transform:none;letter-spacing:0;font-size:0.93rem;color:var(--ink);width:30%">${esc(a.label)}</th><td class="muted">${esc(a.meaning)}</td></tr>`)
            .join("")}</tbody></table></div>`,
        ),
      ),
      html(
        split(
          `<h2>Scope</h2><p class="muted">1 January 2011 to 2 November 2026, Telangana and Andhra Pradesh. Some records link to earlier origins or later outcomes.</p>`,
          `<div class="prose"><p><strong>Jurisdiction is recorded as at the event date.</strong> Telangana became a separate state on 2 June 2014. Events before that date are recorded as undivided Andhra Pradesh, with the district and authority as they were at the time. We do not retroactively assign a pre-2014 event to a present-day state without checking.</p>
<h3 style="margin-top:28px">Categories</h3>
<div class="table-scroll"><table class="data"><tbody>${Object.entries(CATEGORIES)
            .map(([k, c]) => `<tr><th scope="row" style="text-transform:none;letter-spacing:0;font-size:0.93rem;width:40%"><a href="/tag/${k}/">${esc(c.label)}</a></th><td class="muted">${esc(c.question)}</td></tr>`)
            .join("")}</tbody></table></div>
<h3 style="margin-top:28px">Language we avoid</h3>
<p>We do not label a transaction “black money”, a person “corrupt” or a company a “scam” unless the evidence and legal status justify exactly that wording. We publish no rankings or scores of people.</p></div>`,
        ),
      ),
    ],
  },
  {
    slug: "corrections",
    title: "Corrections",
    lede: "Every material change to a published record creates a new public version with a dated note. We do not silently delete records.",
    tag: T_TRUST,
    body: [
      html(`<div class="synthetic synthetic--compact" role="note"><strong>Synthetic sample records.</strong> Invented to demonstrate the format. Not real cases.</div>
<div class="table-scroll"><table class="data">
<thead><tr><th scope="col">Date</th><th scope="col">Record</th><th scope="col">Version</th><th scope="col">What changed</th></tr></thead>
<tbody>${SYNTHETIC_CASES.flatMap((c) => c.corrections.map((k) => ({ c, k })))
        .sort((a, b) => b.k.date.localeCompare(a.k.date))
        .map(({ c, k }) => `<tr><td style="white-space:nowrap">${fmtDate(k.date)}</td><td><a href="/cases/${c.slug}/#correction-history">${esc(c.title)}</a><br><span class="mono muted">${c.id}</span></td><td>v${k.version}</td><td>${esc(k.note)} <span class="muted small">(${esc(k.changedFields.join(", "))})</span></td></tr>`)
        .join("")}</tbody>
</table></div>`),
      heading("Our corrections policy"),
      html(`<ul>
<li>Substantiated factual errors are corrected promptly and visibly on the record itself.</li>
<li>Status updates (new orders, appeals, stays) are recorded with the date and source.</li>
<li>A record is withdrawn only with a public withdrawal notice and an editor’s recorded rationale.</li>
<li>Previous versions are retained in our internal audit log.</li>
</ul>
<p>To report an error, see <a href="/right-of-reply/">right of reply and corrections requests</a>.</p>`),
    ],
  },
  {
    slug: "right-of-reply",
    title: "Right of reply",
    lede: "Anyone named in a record is asked specific questions before publication, and can respond or request a correction afterwards.",
    tag: T_TRUST,
    body: [
      html(
        split(
          `<h2>Before publication</h2>`,
          steps([
            ["We identify every subject", "Company, promoter, official, department, contractor or other named party in a material claim."],
            ["We send specific questions", "A neutral summary of each claim concerning you, with dates and enough detail for a meaningful answer."],
            ["We give a reasonable deadline", "Proportionate to the story. We keep proof of delivery and follow-up attempts."],
            ["We publish your response fairly", "Including denials, explanations and documents. We do not paraphrase a denial to weaken it."],
            ["Silence is not an admission", "If there is no response, we say when and how we asked — and nothing more."],
          ]),
        ),
      ),
      html(
        split(
          `<h2>After publication</h2>`,
          `<div class="prose"><p>If you are named in a record, or you believe something is wrong, write to the editor with the record ID (for example <span class="mono">SYN-0002</span>), the specific statement and any document that shows it is inaccurate or out of date.</p>
<div class="callout"><p class="callout__label">Contact channel — being set up</p><p style="margin:0">A dedicated corrections address will be published here before the first real record goes live. Every request is logged and answered, and any resulting change appears on the <a href="/corrections/">corrections page</a>.</p></div></div>`,
        ),
      ),
    ],
  },
  {
    slug: "independence",
    title: "Funding & independence",
    lede: "No one can pay to add, suppress, remove or alter a record.",
    tag: T_TRUST,
    body: [
      heading("Editorial independence"),
      html(`<ul>
<li>No developer, broker, political party, official or complainant can pay to add, suppress, remove or alter a case.</li>
<li>Sponsorship, advertising and donations are kept separate from case selection and editorial decisions.</li>
<li>Political and commercial affiliations play no part in which cases we investigate.</li>
<li>Serious allegations follow a two-person rule: one researcher builds the case; a second editor independently checks each material claim.</li>
<li>Corrections are public and versioned.</li>
</ul>`),
      heading("Funding sources"),
      html(`<div class="callout" style="max-width:46rem"><p class="callout__label">To be published before launch</p><p style="margin:0">A full list of funders and our conflict-of-interest policy will appear here before the archive publishes its first real record.</p></div>`),
    ],
  },
  {
    slug: "report",
    title: "Report a concern",
    lede: "Tips and documents help us find patterns. They are a starting point for research — never published as received.",
    tag: tag("Secure intake", "secure-intake"),
    body: [
      // Preview only: no form action and every control disabled, so nothing can be submitted or stored.
      html(`<div class="intake-closed" role="status"><h2 style="font-size:1.25rem">Intake is not open yet</h2><p style="margin:0">We will accept reports only after an independent security review and legal sign-off on how submissions are stored, who can see them and how long they are kept. The form below shows what intake will ask for; it cannot be submitted.</p></div>
<div class="split">
<div class="prose">
<h2>Before you share anything</h2>
<p><strong>We cannot promise absolute anonymity.</strong> When intake opens, this page will explain exactly what the channel records (for example IP addresses or email headers), who on the team can see your identity, and when we might be legally compelled to share information.</p>
<p>Your identity will be stored separately from any case record. Case editors will not see it by default.</p>
<h3 style="margin-top:24px">Never send us</h3>
<ul class="dont"><li>Aadhaar or PAN numbers</li><li>Full bank account or card numbers</li><li>Passwords or login details</li><li>Unrelated family information</li><li>Material obtained by trespass, hacking or unlawful recording</li></ul>
</div>
<form aria-label="Report form preview (disabled)" onsubmit="return false">
<fieldset disabled><legend>What happened</legend>
<div class="field"><label for="r-cat">Type of concern</label><select id="r-cat">${Object.values(CATEGORIES).map((c) => `<option>${esc(c.label)}</option>`).join("")}</select></div>
<div class="field-row"><div class="field"><label for="r-state">State</label><select id="r-state"><option>Telangana</option><option>Andhra Pradesh</option></select></div><div class="field"><label for="r-district">District</label><input id="r-district"></div></div>
<div class="field"><label for="r-desc">Describe what you know first-hand (English or Telugu)</label><textarea id="r-desc"></textarea></div>
<div class="field"><label for="r-refs">Any official reference numbers (RERA, FIR, court case, survey number)</label><input id="r-refs"></div>
</fieldset>
<fieldset disabled><legend>Contact (optional)</legend>
<div class="field"><label for="r-contact">A safe way to reach you</label><input id="r-contact"></div>
<p class="small muted" style="margin:0">File upload will be added only after malware scanning, quarantine storage and encryption are in place.</p>
</fieldset>
<button type="button" class="btn btn--primary" disabled>Submission not yet available</button>
</form>
</div>`),
    ],
  },
  {
    slug: "explore",
    title: "Explore by geography",
    lede: "Records by district and state, with jurisdiction recorded as it was at the time of each event.",
    tag: T_ARCHIVE,
    body: [],
  },
];

for (const p of pages) {
  addPost({
    key: `page:${p.slug}`,
    type: "page",
    title: p.title,
    slug: p.slug,
    excerptText: p.lede,
    body: p.body,
    tagList: [p.tag],
    publishedAt: iso("2026-10-30"),
  });
}

// ---------- write ----------
const data = {
  db: [
    {
      meta: { exported_on: Date.now(), version: "6.0.0" },
      data: { posts, tags: [...tags.values()], posts_tags: postsTags },
    },
  ],
};
writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${posts.filter((p) => p.type === "post").length} posts, ${pages.length} pages, ${tags.size} tags → ${OUT.pathname}`);
