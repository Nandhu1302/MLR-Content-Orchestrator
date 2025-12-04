
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import PptxGenJS from 'pptxgenjs';
import { Canvg } from 'canvg';
import { renderDiagram } from '@/config/mermaidConfig';

export class DiagramExportService {
  static getScale(resolution) {
    switch (resolution) {
      case 'high':
        return 4; // 4K equivalent
      case 'print':
        return 5; // High-quality printing at 300 DPI
      case 'standard':
      default:
        return 3; // Better default quality
    }
  }

  static parseSVGDimensions(svgElement) {
    const widthAttr = svgElement.getAttribute('width');
    const heightAttr = svgElement.getAttribute('height');
    if (widthAttr && heightAttr) {
      const w = parseFloat(widthAttr);
      const h = parseFloat(heightAttr);
      if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        console.log('Using explicit width/height attributes:', w, 'x', h);
        return { width: w, height: h };
      }
    }
    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.split(/\s+/);
      if (parts.length === 4) {
        const w = parseFloat(parts[2]);
        const h = parseFloat(parts[3]);
        if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
          console.log('Using viewBox dimensions:', w, 'x', h, 'from viewBox:', viewBox);
          return { width: w, height: h };
        }
      }
    }
    console.warn('Could not parse SVG dimensions, using fallback: 1200 x 800');
    return { width: 1200, height: 800 };
  }

  static async exportDiagram(diagram, options) {
    console.log('exportDiagram called for:', diagram.name, 'options:', options);
    try {
      const svg = await renderDiagram(diagram.mermaidSyntax, `diagram-${diagram.id}-${Date.now()}`);
      console.log('Diagram rendered to SVG, length:', svg.length);
      switch (options.format) {
        case 'svg':
          console.log('Exporting as SVG');
          return this.exportToSVG(svg);
        case 'png':
          console.log('Exporting as PNG with resolution:', options.resolution);
          return this.exportToPNG(svg, options.resolution || 'standard');
        case 'pdf':
          console.log('Exporting as PDF');
          return this.exportToPDF([{ name: diagram.name, svg }]);
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }
    } catch (error) {
      console.error('exportDiagram failed:', error);
      throw error;
    }
  }

  static async exportMultipleDiagrams(diagrams, format, resolution = 'standard') {
    if (format === 'pdf') {
      const diagramsWithSvg = await Promise.all(
        diagrams.map(async (diagram) => ({
          name: diagram.name,
          svg: await renderDiagram(diagram.mermaidSyntax, `diagram-${diagram.id}`),
        }))
      );
      return this.exportToPDF(diagramsWithSvg);
    }
    const zip = new JSZip();
    const folder = zip.folder('architecture-diagrams');
    for (const diagram of diagrams) {
      const blob = await this.exportDiagram(diagram, { format, resolution });
      const fileName = `${this.sanitizeFileName(diagram.name)}.${format}`;
      folder?.file(fileName, blob);
    }
    return zip.generateAsync({ type: 'blob' });
  }

  static async exportToSVG(svg) {
    return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  }

  static async exportToPNG(svg, resolution) {
    console.log('Starting PNG export with canvg, resolution:', resolution);
    const scale = this.getScale(resolution);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svg;
    const svgElement = tempDiv.querySelector('svg');
    if (!svgElement) {
      throw new Error('Invalid SVG: No SVG element found');
    }
    const { width, height } = this.parseSVGDimensions(svgElement);
    console.log('Parsed SVG dimensions:', width, 'x', height, 'with scale:', scale);
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    console.log('Canvas created with scaled dimensions:', canvas.width, 'x', canvas.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log('Canvas background filled');
    try {
      console.log('Rendering SVG with canvg...');
      const v = await Canvg.from(ctx, svg, {
        ignoreMouse: true,
        ignoreAnimation: true,
        scaleWidth: canvas.width,
        scaleHeight: canvas.height,
      });
      await v.render();
      console.log('SVG rendered successfully with canvg');
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('PNG blob created successfully, size:', blob.size, 'bytes');
              console.log('Final image dimensions:', canvas.width, 'x', canvas.height);
              resolve(blob);
            } else {
              console.error('Failed to create PNG blob - blob is null');
              reject(new Error('Failed to create PNG blob'));
            }
          },
          'image/png',
          1.0
        );
      });
    } catch (canvgError) {
      console.error('Canvg rendering failed:', canvgError);
      throw new Error('Failed to render SVG with canvg: ' + canvgError.message);
    }
  }

  static async exportToPDF(diagrams) {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    pdf.setFontSize(24);
    pdf.text('Glocalization Module', pageWidth / 2, 40, { align: 'center' });
    pdf.setFontSize(18);
    pdf.text('Architecture Documentation', pageWidth / 2, 55, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(new Date().toLocaleDateString(), pageWidth / 2, 70, { align: 'center' });
    for (let i = 0; i < diagrams.length; i++) {
      const diagram = diagrams[i];
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text(diagram.name, margin, margin + 5);
      try {
        const img = await this.svgToDataURL(diagram.svg);
        const maxWidth = pageWidth - 2 * margin;
        const maxHeight = pageHeight - 2 * margin - 10;
        pdf.addImage(img, 'PNG', margin, margin + 10, maxWidth, maxHeight, undefined, 'FAST');
      } catch (error) {
        console.error('Failed to add diagram to PDF:', error);
        pdf.setFontSize(10);
        pdf.text('Failed to render diagram', margin, margin + 20);
      }
      pdf.setFontSize(10);
      pdf.text(`Page ${i + 2} of ${diagrams.length + 1}`, pageWidth - margin, pageHeight - margin, { align: 'right' });
    }
    return pdf.output('blob');
  }

  static async svgToDataURL(svg) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      img.src = url;
    });
  }

  static sanitizeFileName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  static downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async exportDiagramToPPT(diagram) {
    try {
      console.log('Starting PPT export for:', diagram.name);
      const pptx = new PptxGenJS();
      pptx.author = 'Glocalization Module';
      pptx.title = diagram.name;
      pptx.subject = 'Architecture Diagram';
      const slide = pptx.addSlide();
      slide.addText(diagram.name, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: '363636',
      });
      if (diagram.description) {
        slide.addText(diagram.description, {
          x: 0.5,
          y: 0.9,
          w: 9,
          h: 0.4,
          fontSize: 12,
          color: '666666',
        });
      }
      console.log('Rendering diagram to SVG...');
      const uniqueId = `ppt-export-${diagram.id}-${Date.now()}`;
      const svg = await renderDiagram(diagram.mermaidSyntax, uniqueId);
      console.log('SVG rendered successfully, length:', svg.length);
      slide.addText('Diagram: ' + diagram.name, {
        x: 1,
        y: 2,
        w: 8,
        h: 4,
        fontSize: 14,
        color: '666666',
        align: 'center',
        valign: 'middle',
      });
      slide.addText('⚠️ For best quality, use the Download button to get PNG/PDF formats', {
        x: 1,
        y: 6,
        w: 8,
        h: 0.5,
        fontSize: 11,
        color: '999999',
        align: 'center',
        italic: true,
      });
      slide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
        x: 0.5,
        y: 7.2,
        w: 9,
        h: 0.3,
        fontSize: 10,
        color: '999999',
        align: 'right',
      });
      const fileName = `${this.sanitizeFileName(diagram.name)}.pptx`;
      console.log('Writing PPT file:', fileName);
      await pptx.writeFile({ fileName });
      console.log('PPT export completed successfully');
    } catch (error) {
      console.error('PPT export failed:', error);
      throw error;
    }
  }

  static async blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}