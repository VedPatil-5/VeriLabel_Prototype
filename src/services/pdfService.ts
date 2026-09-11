import { jsPDF } from 'jspdf';
import { SampleDataset } from '../types';

/**
 * Generates an official Legal Metrology Inspection Summary PDF (Form LM-VI)
 * incorporating VeriLabel branding, Violations Found, Compliant Elements,
 * and the mandatory statutory Change Log.
 */
export async function generateInspectionPdf(sample: SampleDataset): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = 14;

  // 1. Official Header Top Bar
  doc.setFillColor(15, 42, 89); // Sovereign Navy (#0F2A59)
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('VeriLabel', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Every label, Verified • Statutory Legal Metrology Inspection', margin + 6, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FORM LM-VI', pageWidth - margin - 6, y + 9, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('Rule 6 / Rule 18 Audit', pageWidth - margin - 6, y + 16, { align: 'right' });

  y += 28;

  // 2. Inspection Record & Case Metadata
  const caseId = `VL-${sample.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  doc.setFillColor(241, 245, 249); // Slate-100 / Parchment
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'S');

  doc.setTextColor(15, 42, 89);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('INSPECTION AUDIT SUMMARY', margin + 4, y + 6);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  doc.text(`Product Name: ${sample.name}`, margin + 4, y + 13);
  doc.text(`Category: ${sample.category}`, margin + 4, y + 19);
  doc.text(`Declared Net Qty: ${sample.netQuantity}`, margin + 4, y + 24);

  doc.text(`Case Reference: ${caseId}`, margin + 95, y + 13);
  doc.text(`Audit Timestamp: ${timestamp}`, margin + 95, y + 19);
  doc.text(`Declared MRP: ${sample.mrp}`, margin + 95, y + 24);

  y += 32;

  // 3. Overall Verdict Banner
  const isViolation = sample.violations && sample.violations.length > 0;
  if (isViolation) {
    doc.setFillColor(254, 242, 242); // Red-50
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`VERDICT: STATUTORY INFRACTIONS DETECTED (${sample.violations.length} VIOLATIONS)`, margin + 4, y + 8);
  } else {
    doc.setFillColor(240, 253, 244); // Green-50
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('VERDICT: 100% STATUTORY COMPLIANCE SATISFIED', margin + 4, y + 8);
  }

  y += 18;

  // Helper for text wrapping & page overflow
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 16;
    }
  };

  // 4. Section 1: Violations Found
  checkPageBreak(25);
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`1. Violations Found (${sample.violations.length})`, margin, y);
  doc.setDrawColor(185, 28, 28);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 7;

  if (sample.violations.length === 0) {
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('• No statutory infractions detected under PCR 2011 Rule 6 / Rule 18.', margin + 4, y);
    y += 7;
  } else {
    sample.violations.forEach((v, idx) => {
      checkPageBreak(18);
      doc.setTextColor(15, 42, 89);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`${idx + 1}. [${v.code}] - Severity: ${v.badge.toUpperCase()}`, margin + 2, y);
      y += 4.5;

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const descLines = doc.splitTextToSize(`Finding: ${v.desc}`, contentWidth - 6);
      doc.text(descLines, margin + 4, y);
      y += descLines.length * 3.8;

      doc.setTextColor(100, 116, 139);
      const ruleLines = doc.splitTextToSize(`Statute: ${v.rule}`, contentWidth - 6);
      doc.text(ruleLines, margin + 4, y);
      y += ruleLines.length * 3.8 + 2;
    });
  }

  y += 4;

  // 5. Section 2: Compliant Elements
  checkPageBreak(25);
  doc.setTextColor(21, 128, 61);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`2. Compliant Elements (${sample.compliant.length})`, margin, y);
  doc.setDrawColor(21, 128, 61);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 7;

  sample.compliant.forEach((c, idx) => {
    checkPageBreak(12);
    doc.setTextColor(15, 42, 89);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`✓ ${c.label}: `, margin + 2, y);

    const labelWidth = doc.getTextWidth(`✓ ${c.label}: `);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(21, 128, 61);
    doc.text(`[${c.status}]`, margin + 2 + labelWidth, y);

    const statusWidth = doc.getTextWidth(`[${c.status}] `);
    doc.setTextColor(51, 65, 85);
    doc.text(`- Value: ${c.value}`, margin + 2 + labelWidth + statusWidth, y);
    y += 4.5;

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    const detailLines = doc.splitTextToSize(c.desc, contentWidth - 8);
    doc.text(detailLines, margin + 6, y);
    y += detailLines.length * 3.4 + 1.5;
  });

  y += 4;

  // 6. Section 3: Change Log (Required Remediation)
  checkPageBreak(30);
  doc.setTextColor(15, 42, 89);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. Change Log & Corrective Action Plan', margin, y);
  doc.setDrawColor(15, 42, 89);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 7;

  if (sample.changeLog && sample.changeLog.length > 0) {
    sample.changeLog.forEach((cl, idx) => {
      checkPageBreak(18);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y - 1, contentWidth, 14, 1.5, 1.5, 'FD');

      doc.setTextColor(15, 42, 89);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`Action ${idx + 1}: ${cl.targetViolation}`, margin + 3, y + 3.5);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const actionLines = doc.splitTextToSize(`Mandatory Correction: ${cl.actionRequired}`, contentWidth - 8);
      doc.text(actionLines, margin + 3, y + 8);

      y += 16;
    });
  } else {
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('No corrective packaging modifications required. All declarations conform to standard.', margin + 4, y);
    y += 8;
  }

  // 7. Micro Footer with Verification Hash
  const footerY = pageHeight - 14;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('VeriLabel Automated Legal Metrology Inspection • Client-Side Verified Report • Sample Prototype Data', margin, footerY + 1);
  doc.text(`Verified: ${timestamp}`, pageWidth - margin, footerY + 1, { align: 'right' });

  // Return generated Blob and trigger download
  const blob = doc.output('blob');
  doc.save(`VeriLabel_Inspection_${sample.id}.pdf`);
  return blob;
}

export const generateNoticePdf = generateInspectionPdf;
