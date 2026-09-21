export const officerStats = { inspections: 128, compliant: 94, nonCompliant: 34, violations: 61, reports: 117 };

export const recentInspections = [
  { id: 'VL-MUM-0421', sampleId: 'sample1', product: 'Rajkamal Navratan Mix', time: '20 Sep 2026 - 11:20', status: 'NON-COMPLIANT', violation: 'Dual MRP / missing USP', officer: 'LM-MH-042', report: true },
  { id: 'VL-MUM-0419', sampleId: 'sample2', product: 'PureSpring Mineral Water', time: '20 Sep 2026 - 10:05', status: 'COMPLIANT', violation: 'None detected', officer: 'LM-MH-042', report: true },
  { id: 'VL-MUM-0416', sampleId: 'sample3', product: 'NeemAyur Bath Soap', time: '19 Sep 2026 - 16:42', status: 'NON-COMPLIANT', violation: 'USP / date legibility', officer: 'LM-MH-039', report: true },
  { id: 'VL-MUM-0411', sampleId: 'sample4', product: 'GoldenHarvest Rice', time: '19 Sep 2026 - 13:18', status: 'NON-COMPLIANT', violation: 'Numeral height', officer: 'LM-MH-042', report: true }
];

export const violationRecords = [
  { product: 'Rajkamal Navratan Mix', issue: 'Dual MRP declaration', rule: 'PCR 2011 Rule 18(2)', status: 'Open' },
  { product: 'NeemAyur Bath Soap', issue: 'Missing Unit Sale Price', rule: 'PCR 2011 Rule 6(11)', status: 'Review' },
  { product: 'GoldenHarvest Rice', issue: 'Net quantity numeral height', rule: 'PCR 2011 Rule 7 / Table I', status: 'Open' }
];

export const penaltyRecords = [
  { product: 'Rajkamal Navratan Mix', issue: 'Dual MRP declaration', amount: 'INR 5,000 (demo)', status: 'Pending source review' },
  { product: 'NeemAyur Bath Soap', issue: 'Missing USP', amount: 'INR 2,000 (demo)', status: 'Prototype tracking' }
];

export const repeatedOffenders = [
  { entity: 'Sample seller record A', count: 4, recent: 'Dual MRP declaration', status: 'Monitor' },
  { entity: 'Sample manufacturer record B', count: 3, recent: 'Missing consumer helpline', status: 'Review' },
  { entity: 'Sample seller record C', count: 2, recent: 'Date legibility', status: 'Open' }
];

export const evidenceRecords = [
  { id: 'EV-MUM-0421', product: 'Rajkamal Navratan Mix', location: 'Mumbai, Maharashtra', timestamp: '20 Sep 2026 - 11:20', rule: 'PCR 2011 Rule 18(2)', hash: 'sha256: prototype-reference-0421' },
  { id: 'EV-MUM-0416', product: 'NeemAyur Bath Soap', location: 'Mumbai, Maharashtra', timestamp: '19 Sep 2026 - 16:42', rule: 'PCR 2011 Rule 6(11)', hash: 'sha256: prototype-reference-0416' }
];
