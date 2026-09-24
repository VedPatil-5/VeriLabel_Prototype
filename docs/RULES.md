# Rules and validation

## 1. Purpose

This document governs how VeriLabel may describe legal requirements, inspection findings, prototype data, and assistant answers. It protects users from confusing a UI demonstration with an authoritative legal or enforcement system.

## 2. Source hierarchy

Use the following order when preparing or reviewing content:

1. Current official legislation, rules, amendments, notifications, and regulator guidance.
2. Official Department of Consumer Affairs and Legal Metrology publications.
3. Official FSSAI material for food-related requirements where applicable.
4. Reviewed internal product requirements and fixture notes.
5. Prototype explanations and assistant copy.

The links in `src/data/legalSources.ts` are starting points for source review. They do not turn the assistant into an official advice channel.

## 3. Fixture finding rules

- A finding must be supported by the supplied image/panel and fixture data.
- If the supplied image shows only one panel, say that an item is “not visible in the captured frame” rather than asserting it is absent from the full package.
- Preserve the distinction between a `VIOLATION`, `WARNING`, and `COMPLIANT` fixture status.
- Every violation should have a stable id, a readable code, a severity, an explanation, and a rule/standard reference.
- Every compliant element should state what was observed and the value represented by the fixture.
- Every corrective action should identify a target and a practical next step.
- Bounding boxes are visual annotations from prepared data; they are not proof of a live computer-vision result.

## 4. Legal wording

Use cautious language such as “prototype finding,” “fixture marks this element as compliant,” “potential issue,” or “requires source review.” Avoid unqualified claims such as “legally approved,” “official violation,” or “penalty due.”

Rule labels such as PCR 2011 and FSSAI references must remain tied to the relevant fixture or reviewed source. Do not invent rule numbers, amounts, applicability, or enforcement outcomes. When a rule has changed or a fact is uncertain, update the source and mark the fixture for review.

## 5. Officer dashboard data

The officer dashboard is populated from `src/data/officerPrototypeData.ts`. Its Mumbai-labelled totals, inspection rows, penalty examples, repeated-offender records, timestamps, and evidence hashes are sample data. They must not be described as government statistics, real cases, or verified evidence. Keep prototype labels visible in user-facing copy.

Penalty values in the prototype are demonstration values and must not be used to calculate or communicate a real sanction. A production implementation would require a reviewed legal and policy service.

## 6. Assistant behaviour

The assistant uses local keyword matching against the FAQ records in `src/data/legalSources.ts`. It should:

- provide a source name and link when a prepared answer matches;
- state that it is a prototype helper, not official legal advice;
- direct users to current authoritative material for rules, penalties, and enforcement;
- describe dashboard data as prototype data; and
- return a clear no-match state rather than fabricating an answer.

Do not add a remote legal or generative answer path without an explicit source, privacy, error, and review design.

## 7. Report rules

The PDF is a client-generated inspection summary. It may include the fixture’s case reference, status, violations, compliant elements, corrective action plan, and optical-region details. It must not be called an official Form LM-VI filing unless a future reviewed workflow establishes that status. Keep the prototype disclaimer available in the report or surrounding UI.

## 8. Data minimisation and privacy

- Use synthetic or intentionally supplied demo data only.
- Do not add personal identity data, real officer credentials, customer records, or private images to fixtures.
- Do not put API keys or service credentials in the frontend.
- Treat browser storage values as convenience state, not secure storage.
- If real inspection data is ever introduced, add server-side access control, retention, audit, and deletion policies first.

## 9. Change review checklist

Before merging a legal/content change, confirm:

1. the source is current and authoritative;
2. the claim is supported by the image or source;
3. partial-panel uncertainty is stated;
4. rule and penalty wording is not overclaimed;
5. prototype/sample labels remain visible;
6. English, Hindi, and Marathi copy agree in meaning; and
7. report and assistant text use the same reviewed terminology.
