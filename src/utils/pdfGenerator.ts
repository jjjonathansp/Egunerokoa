import jsPDF from 'jspdf';

interface DiaryEntry {
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Diary {
  title: string;
  description: string;
}

export function generateDiaryPDF(diary: Diary, entries: DiaryEntry[]) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addTextWithWrapping = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    for (let i = 0; i < lines.length; i++) {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(lines[i], x, y);
      y += fontSize * 0.4;
    }
    return y + 5;
  };

  // Helper function to convert HTML to plain text
  const htmlToText = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Title page
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(diary.title, contentWidth);
  for (let i = 0; i < titleLines.length; i++) {
    pdf.text(titleLines[i], pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
  }

  yPosition += 10;

  if (diary.description) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    yPosition = addTextWithWrapping(diary.description, pageWidth / 2, yPosition, contentWidth, 14);
    yPosition += 10;
  }

  // Date generated
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

  // Add entries
  entries.forEach((entry, index) => {
    pdf.addPage();
    yPosition = margin;

    // Entry title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    yPosition = addTextWithWrapping(entry.title, margin, yPosition, contentWidth, 18);
    yPosition += 5;

    // Entry date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Created: ${formatDate(entry.created_at)}`, margin, yPosition);
    yPosition += 15;

    if (entry.updated_at !== entry.created_at) {
      pdf.text(`Updated: ${formatDate(entry.updated_at)}`, margin, yPosition);
      yPosition += 15;
    }

    // Add separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Entry content
    if (entry.content) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const plainText = htmlToText(entry.content);
      yPosition = addTextWithWrapping(plainText, margin, yPosition, contentWidth, 12);
    }
  });

  // Save the PDF
  const fileName = `${diary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_diary.pdf`;
  pdf.save(fileName);
}