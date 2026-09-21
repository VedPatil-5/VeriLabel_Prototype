import { jsPDF } from 'jspdf';
import { SampleDataset } from '../types';

export type PdfLanguage = 'en' | 'hi' | 'mr';
const pdfFontName = 'NotoSansDevanagari-Regular.ttf';
let fontPromise: Promise<string | null> | null = null;

async function loadUnicodeFont(): Promise<string | null> {
  if (!fontPromise) {
    fontPromise = fetch(`/fonts/${pdfFontName}`).then(async (response) => {
      if (!response.ok) return null;
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = '';
      bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
      return btoa(binary);
    }).catch(() => null);
  }
  return fontPromise;
}

const pdfCopy: Record<PdfLanguage, Record<string, string>> = {
  en: { title: 'VeriLabel Inspection Report', form: 'FORM LM-VI', summary: 'INSPECTION AUDIT SUMMARY', violations: 'Violations Found', compliant: 'Compliant Elements', actions: 'Change Log & Corrective Action Plan', optical: 'Detected Optical Regions & Bounding-Box Analysis', status: 'Status', product: 'Product', category: 'Category', quantity: 'Declared Net Qty', date: 'Mfg / Pkg Date', reference: 'Case Reference', timestamp: 'Audit Timestamp', mrp: 'Declared MRP', footer: 'VeriLabel Automated Legal Metrology Inspection • Prototype' },
  hi: { title: 'VeriLabel निरीक्षण रिपोर्ट', form: 'फॉर्म LM-VI', summary: 'निरीक्षण ऑडिट सारांश', violations: 'मिले उल्लंघन', compliant: 'अनुपालक तत्व', actions: 'परिवर्तन लॉग और सुधार योजना', optical: 'पता चले ऑप्टिकल क्षेत्र और बाउंडिंग-बॉक्स विश्लेषण', status: 'स्थिति', product: 'उत्पाद', category: 'श्रेणी', quantity: 'घोषित मात्रा', date: 'निर्माण / पैकिंग तिथि', reference: 'केस संदर्भ', timestamp: 'ऑडिट समय', mrp: 'घोषित MRP', footer: 'VeriLabel स्वचालित कानूनी मेट्रोलॉजी निरीक्षण • प्रोटोटाइप' },
  mr: { title: 'VeriLabel तपासणी अहवाल', form: 'फॉर्म LM-VI', summary: 'तपासणी ऑडिट सारांश', violations: 'आढळलेली उल्लंघने', compliant: 'अनुपालक घटक', actions: 'बदल नोंद आणि सुधारणा योजना', optical: 'आढळलेले ऑप्टिकल क्षेत्र आणि बाउंडिंग-बॉक्स विश्लेषण', status: 'स्थिती', product: 'उत्पादन', category: 'श्रेणी', quantity: 'घोषित प्रमाण', date: 'निर्मिती / पॅकिंग तारीख', reference: 'केस संदर्भ', timestamp: 'ऑडिट वेळ', mrp: 'घोषित MRP', footer: 'VeriLabel स्वयंचलित कायदेशीर मेट्रोलॉजी तपासणी • प्रोटोटाइप' }
};

/**
 * Sanitizes text for standard jsPDF Helvetica fonts (WinAnsi encoding).
 * Replaces Indian Rupee symbol with 'Rs.', Unicode checkmarks, bullets, and dashes
 * with clean, reliable ASCII representations to prevent garbled characters.
 */
function cleanPdfText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/₹/g, 'Rs. ')
    .replace(/✓/g, '[PASS]')
    .replace(/•/g, '-')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates an official Legal Metrology Inspection Summary PDF (Form LM-VI)
 * incorporating VeriLabel branding, Case Metadata, Overall Verdict,
 * Violations Found, Compliant Elements, Change Log & Corrective Actions,
 * and Detected Optical Regions / Bounding-Box Details.
 */
export async function generateInspectionPdf(sample: SampleDataset, options: { language?: PdfLanguage } = {}): Promise<Blob> {
  const language = options.language || 'en';
  const copy = pdfCopy[language];
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  const fontData = await loadUnicodeFont();
  // Keep English reports on jsPDF's stable built-in font. The Devanagari font
  // is only needed for Hindi/Marathi; using it for English was the source of
  // the all-black/garbled report symptom in some PDF viewers.
  const reportFont = language === 'en' ? 'helvetica' : (fontData ? 'NotoSansDevanagari' : 'helvetica');
  if (fontData) {
    doc.addFileToVFS(pdfFontName, fontData);
    doc.addFont(pdfFontName, 'NotoSansDevanagari', 'normal');
    doc.addFont(pdfFontName, 'NotoSansDevanagari', 'bold');
    doc.setFont('NotoSansDevanagari', 'normal');
  }

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let currentPage = 1;

  let y = 14;

  // Helper to draw running footer on every page
  const drawFooter = (pageNum: number) => {
    const footerY = pageHeight - 9;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

    doc.setTextColor(100, 116, 139);
    doc.setFont(reportFont, 'normal');
    doc.setFontSize(7.5);
    doc.text(
      cleanPdfText(copy.footer),
      margin,
      footerY + 1
    );
    doc.text(`Page ${pageNum}`, pageWidth - margin, footerY + 1, { align: 'right' });
  };

  // Helper to check page break and draw headers/footers
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      drawFooter(currentPage);
      doc.addPage();
      currentPage++;
      y = 16;

      // Running top mini-header on subsequent pages
      doc.setFillColor(15, 42, 89);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont(reportFont, 'bold');
      doc.setFontSize(8);
      doc.text(`${copy.title} (Contd.)`, margin + 3, y + 5.5);
      doc.setFont(reportFont, 'normal');
      doc.text(`Case: ${caseId}`, pageWidth - margin - 3, y + 5.5, { align: 'right' });
      y += 13;
    }
  };

  // Case ID and Timestamp
  const caseId = `VL-${sample.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const locale = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
  const timestamp = new Date().toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // 1. Official Header Top Bar
  doc.setFillColor(15, 42, 89); // Sovereign Navy
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont(reportFont, 'bold');
  doc.setFontSize(16);
  doc.text('VeriLabel', margin + 6, y + 9);

  doc.setFont(reportFont, 'normal');
  doc.setFontSize(8.5);
  doc.text(language === 'en' ? 'Every Label, Verified - Statutory Legal Metrology Inspection' : copy.title, margin + 6, y + 16);

  doc.setFont(reportFont, 'bold');
  doc.setFontSize(9.5);
  doc.text(copy.form, pageWidth - margin - 6, y + 9, { align: 'right' });
  doc.setFont(reportFont, 'normal');
  doc.setFontSize(8);
  doc.text('Rule 6 / Rule 18 Audit Dossier', pageWidth - margin - 6, y + 16, { align: 'right' });

  y += 27;

  // 2. Inspection Record & Case Metadata Card
  const colWidth = (contentWidth - 6) / 2; // ~88mm
  const col1X = margin + 4;
  const col2X = margin + colWidth + 5;

  // Prepare metadata fields
  const cleanName = cleanPdfText(sample.name);
  const cleanCategory = cleanPdfText(sample.category);
  const cleanQty = cleanPdfText(sample.netQuantity);
  const cleanMfg = cleanPdfText(sample.mfgDate || 'N/A');
  const cleanMrp = cleanPdfText(sample.mrp);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  doc.setTextColor(15, 42, 89);
  doc.setFont(reportFont, 'bold');
  doc.setFontSize(9.5);
  doc.text(copy.summary, col1X, y + 6);

  doc.setFont(reportFont, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  // Left Column
  const nameLines = doc.splitTextToSize(`${copy.product}: ${cleanName}`, colWidth - 2);
  doc.text(nameLines[0] || `${copy.product}: ${cleanName}`, col1X, y + 12.5);
  doc.text(`${copy.category}: ${cleanCategory}`, col1X, y + 18);
  doc.text(`${copy.quantity}: ${cleanQty}`, col1X, y + 23.5);
  doc.text(`${copy.date}: ${cleanMfg}`, col1X, y + 29);

  // Right Column
  doc.text(`${copy.reference}: ${caseId}`, col2X, y + 12.5);
  doc.text(`${copy.timestamp}: ${cleanPdfText(timestamp)}`, col2X, y + 18);
  doc.text(`${copy.mrp}: ${cleanMrp}`, col2X, y + 23.5);
  const verdictLabel = sample.violations && sample.violations.length > 0 ? 'NON-COMPLIANT' : 'COMPLIANT';
  doc.text(`${copy.status}: ${verdictLabel}`, col2X, y + 29);

  y += 36;

  // 3. Overall Verdict Banner
  const isViolation = sample.violations && sample.violations.length > 0;
  if (isViolation) {
    doc.setFillColor(254, 242, 242); // Red-50
    doc.setDrawColor(252, 165, 165);
    doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFont(reportFont, 'bold');
    doc.setFontSize(9.5);
    doc.text(
      `VERDICT: STATUTORY INFRACTIONS DETECTED (${sample.violations.length} VIOLATION${sample.violations.length > 1 ? 'S' : ''})`,
      margin + 5,
      y + 7.5
    );
  } else {
    doc.setFillColor(240, 253, 244); // Green-50
    doc.setDrawColor(134, 239, 172);
    doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFont(reportFont, 'bold');
    doc.setFontSize(9.5);
    doc.text('VERDICT: 100% STATUTORY COMPLIANCE SATISFIED', margin + 5, y + 7.5);
  }

  y += 17;

  // 4. Section 1: Violations Found
  checkPageBreak(24);
  doc.setTextColor(185, 28, 28);
  doc.setFont(reportFont, 'bold');
  doc.setFontSize(10.5);
  doc.text(`1. ${copy.violations} (${sample.violations ? sample.violations.length : 0})`, margin, y);
  doc.setDrawColor(185, 28, 28);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 7;

  if (!sample.violations || sample.violations.length === 0) {
    doc.setTextColor(21, 128, 61);
    doc.setFont(reportFont, 'normal');
    doc.setFontSize(8.5);
    doc.text('- No statutory infractions detected under PCR 2011 Rule 6 / Rule 18.', margin + 3, y);
    y += 7;
  } else {
    sample.violations.forEach((v, idx) => {
      const cleanDesc = cleanPdfText(v.desc);
      const cleanRule = cleanPdfText(v.rule);
      const descLines = doc.splitTextToSize(`Finding: ${cleanDesc}`, contentWidth - 8);
      const ruleLines = doc.splitTextToSize(`Statute: ${cleanRule}`, contentWidth - 8);
      const itemHeight = 6 + descLines.length * 3.7 + ruleLines.length * 3.7 + 3;

      checkPageBreak(itemHeight);

      // Item Card
      doc.setFillColor(255, 245, 245);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, 'FD');

      // Header Tag
      doc.setTextColor(185, 28, 28);
      doc.setFont(reportFont, 'bold');
      doc.setFontSize(8.5);
      doc.text(
        `${idx + 1}. [${cleanPdfText(v.code)}] - Severity: ${cleanPdfText(v.badge).toUpperCase()}`,
        margin + 4,
        y + 4.5
      );

      // Description
      doc.setTextColor(30, 41, 59);
      doc.setFont(reportFont, 'normal');
      doc.setFontSize(8);
      let textY = y + 8.5;
      doc.text(descLines, margin + 4, textY);
      textY += descLines.length * 3.7;

      // Statutory Rule
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      doc.text(ruleLines, margin + 4, textY);

      y += itemHeight + 2.5;
    });
  }

  y += 4;

  // 5. Section 2: Compliant Elements
  checkPageBreak(24);
  doc.setTextColor(21, 128, 61);
  doc.setFont(reportFont, 'bold');
  doc.setFontSize(10.5);
  doc.text(`2. ${copy.compliant} (${sample.compliant ? sample.compliant.length : 0})`, margin, y);
  doc.setDrawColor(21, 128, 61);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 7;

  if (sample.compliant && sample.compliant.length > 0) {
    sample.compliant.forEach((c) => {
      const cleanLabel = cleanPdfText(c.label);
      const cleanVal = cleanPdfText(c.value);
      const cleanDetail = cleanPdfText(c.desc);

      const valLines = doc.splitTextToSize(`Declared Value: ${cleanVal}`, contentWidth - 10);
      const detailLines = doc.splitTextToSize(`Verification: ${cleanDetail}`, contentWidth - 10);
      const itemHeight = 6 + valLines.length * 3.6 + detailLines.length * 3.5 + 2;

      checkPageBreak(itemHeight);

      // Item Card
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, 'FD');

      // Title & Pass Tag
      doc.setTextColor(15, 42, 89);
      doc.setFont(reportFont, 'bold');
      doc.setFontSize(8.5);
      doc.text(`[PASS] ${cleanLabel}`, margin + 4, y + 4.5);

      // Declared Value
      doc.setTextColor(30, 41, 59);
      doc.setFont(reportFont, 'normal');
      doc.setFontSize(8);
      let textY = y + 8.5;
      doc.text(valLines, margin + 4, textY);
      textY += valLines.length * 3.6;

      // Verification Detail
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.5);
      doc.text(detailLines, margin + 4, textY);

      y += itemHeight + 2.5;
    });
  }

  y += 4;

  // 6. Section 3: Change Log & Corrective Action Plan
  checkPageBreak(26);
  doc.setTextColor(15, 42, 89);
  doc.setFont(reportFont, 'bold');
  doc.setFontSize(10.5);
  doc.text(`3. ${copy.actions}`, margin, y);
  doc.setDrawColor(15, 42, 89);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 7;

  if (sample.changeLog && sample.changeLog.length > 0) {
    sample.changeLog.forEach((cl, idx) => {
      const cleanTarget = cleanPdfText(cl.targetViolation);
      const cleanAction = cleanPdfText(cl.actionRequired);
      const cleanRef = cleanPdfText(cl.statutoryReference);

      const actionLines = doc.splitTextToSize(`Mandatory Correction: ${cleanAction}`, contentWidth - 8);
      const refLines = cleanRef
        ? doc.splitTextToSize(`Statutory Reference: ${cleanRef}`, contentWidth - 8)
        : [];
      const itemHeight = 6 + actionLines.length * 3.7 + (refLines.length > 0 ? refLines.length * 3.5 + 1 : 0) + 2;

      checkPageBreak(itemHeight);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, 'FD');

      doc.setTextColor(15, 42, 89);
      doc.setFont(reportFont, 'bold');
      doc.setFontSize(8.5);
      doc.text(`Action ${idx + 1}: ${cleanTarget}`, margin + 4, y + 4.5);

      doc.setTextColor(30, 41, 59);
      doc.setFont(reportFont, 'normal');
      doc.setFontSize(8);
      let textY = y + 8.5;
      doc.text(actionLines, margin + 4, textY);
      textY += actionLines.length * 3.7;

      if (refLines.length > 0) {
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7.5);
        doc.text(refLines, margin + 4, textY);
      }

      y += itemHeight + 2.5;
    });
  } else {
    doc.setTextColor(71, 85, 105);
    doc.setFont(reportFont, 'normal');
    doc.setFontSize(8.5);
    doc.text(
      'No corrective packaging modifications required. All declarations conform to statutory standards.',
      margin + 3,
      y
    );
    y += 7;
  }

  y += 4;

  // 7. Section 4: Detected Optical Regions & Bounding-Box Analysis (NEW)
  if (sample.boundingBoxes && sample.boundingBoxes.length > 0) {
    checkPageBreak(26);
    doc.setTextColor(15, 42, 89);
    doc.setFont(reportFont, 'bold');
    doc.setFontSize(10.5);
    doc.text(`4. ${copy.optical} (${sample.boundingBoxes.length})`, margin, y);
    doc.setDrawColor(15, 42, 89);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 7;

    sample.boundingBoxes.forEach((box, idx) => {
      const cleanLabel = cleanPdfText(box.label);
      const cleanDetail = cleanPdfText(box.detail || 'Text detected in bounding region');
      const cleanRule = cleanPdfText(box.ruleCode || 'PCR 2011');
      const coords = `Position: X: ${box.xPercent}%, Y: ${box.yPercent}% | Dimensions: W: ${box.widthPercent}%, H: ${box.heightPercent}%`;

      const detailLines = doc.splitTextToSize(`Extraction: ${cleanDetail}`, contentWidth - 12);
      const itemHeight = 6 + detailLines.length * 3.6 + 8;

      checkPageBreak(itemHeight);

      // Color coding based on boxColor
      let strokeColor: [number, number, number] = [203, 213, 225];
      let fillColor: [number, number, number] = [248, 250, 252];
      let badgeTag = '[INFO]';
      let tagColor: [number, number, number] = [15, 42, 89];

      if (box.boxColor === 'red') {
        strokeColor = [252, 165, 165];
        fillColor = [255, 245, 245];
        badgeTag = '[DEFECT DETECTED]';
        tagColor = [185, 28, 28];
      } else if (box.boxColor === 'green') {
        strokeColor = [187, 247, 208];
        fillColor = [240, 253, 244];
        badgeTag = '[VERIFIED REGION]';
        tagColor = [21, 128, 61];
      } else if (box.boxColor === 'amber') {
        strokeColor = [253, 230, 138];
        fillColor = [255, 251, 235];
        badgeTag = '[WARNING REGION]';
        tagColor = [180, 83, 9];
      }

      doc.setFillColor(...fillColor);
      doc.setDrawColor(...strokeColor);
      doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, 'FD');

      // Left colored vertical indicator strip
      doc.setFillColor(...tagColor);
      doc.rect(margin, y, 2.5, itemHeight, 'F');

      // Header with Tag and Label
      doc.setTextColor(...tagColor);
      doc.setFont(reportFont, 'bold');
      doc.setFontSize(8.5);
      doc.text(`${idx + 1}. ${badgeTag} ${cleanLabel}`, margin + 5, y + 4.5);

      // Extraction detail
      doc.setTextColor(30, 41, 59);
      doc.setFont(reportFont, 'normal');
      doc.setFontSize(8);
      let textY = y + 8.5;
      doc.text(detailLines, margin + 5, textY);
      textY += detailLines.length * 3.6;

      // Coordinates & Statute
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.text(`${coords} • Statute: ${cleanRule}`, margin + 5, textY + 1);

      y += itemHeight + 2.5;
    });
  }

  // Draw footer on final page
  drawFooter(currentPage);

  // Return generated Blob and trigger download
  const blob = doc.output('blob');
  doc.save(`VeriLabel_Inspection_${sample.id}.pdf`);
  return blob;
}

export const generateNoticePdf = generateInspectionPdf;
