export type AssistantFaq = {
  keywords: string[];
  answer: string;
  sourceName: string;
  sourceUrl: string;
};

export const assistantFaqs: AssistantFaq[] = [
  {
    keywords: ['source', 'sources', 'rule', 'rules', 'legal', 'law', 'act'],
    answer: 'This prototype points to the Department of Consumer Affairs Legal Metrology Act, 2009 and Packaged Commodities Rules, 2011 pages. Use the linked source for the current text before taking enforcement action.',
    sourceName: 'Department of Consumer Affairs - Legal Metrology',
    sourceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/legal-metrology'
  },
  {
    keywords: ['mumbai', 'dataset', 'data', 'analytics', 'area', 'geography'],
    answer: 'The Mumbai views are prototype sample records used to demonstrate the officer workflow. They are not presented as verified live violation statistics.',
    sourceName: 'VeriLabel prototype data note',
    sourceUrl: 'https://consumeraffairs.nic.in/weightsmeasures/weight-and-measures'
  },
  {
    keywords: ['report', 'pdf', 'download', 'inspection'],
    answer: 'Reports are generated from the selected product fixture and include the detected declarations, violations, compliant elements, corrective actions, and optical regions available in the prototype dataset.',
    sourceName: 'VeriLabel inspection report generator',
    sourceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/legal-metrology'
  },
  {
    keywords: ['advice', 'official', 'certain', 'penalty', 'fine'],
    answer: 'This assistant is a source-backed prototype helper, not an official legal-advice channel. Penalties and enforcement decisions must be checked against the current applicable law and an authorized officer review.',
    sourceName: 'Department of Consumer Affairs - Legal Metrology',
    sourceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/legal-metrology'
  }
];
