
import jsPDF from 'jspdf';

class AgencyHandoffService {
  static async generateHandoffPackage(
    designProject,
    template,
    asset,
    variations,
    brand
  ) {
    const pdf = new jsPDF();
    let yPos = 30;

    // Page 1: Cover
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Creative Brief', 20, yPos);
    yPos += 15;

    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${brand.company} - ${brand.brand_name}`, 20, yPos);
    yPos += 20;

    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Project: ${asset.asset_name}`, 20, yPos);
    pdf.text(`Asset Type: ${asset.asset_type}`, 20, yPos + 10);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos + 20);
    pdf.text(`Status: ${designProject.status}`, 20, yPos + 30);

    // Page 2: Content Variations
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Content Variations', 20, yPos);
    yPos += 15;

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    if (variations.length > 0) {
      variations.forEach((variation, i) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.setFontSize(12);
        pdf.setTextColor(40, 40, 40);
        pdf.text(`${i + 1}. ${variation.variation_name}`, 20, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        if (variation.target_context) {
          const context = variation.target_context;
          if (context.audience) pdf.text(` Audience: ${context.audience}`, 20, yPos);
          yPos += 6;
          if (context.hcp_experience_level) pdf.text(` HCP Level: ${context.hcp_experience_level}`, 20, yPos);
          yPos += 6;
        }
        yPos += 8;
      });
    } else {
      pdf.text('Primary content variation', 20, yPos);
    }

    // Page 3: Brand Guidelines
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Brand Guidelines', 20, yPos);
    yPos += 15;

    pdf.setFontSize(12);
    pdf.text('Brand Colors:', 20, yPos);
    yPos += 10;

    if (brand.primary_color) {
      const rgb = this.hexToRgb(brand.primary_color);
      pdf.setFillColor(rgb.r, rgb.g, rgb.b);
      pdf.rect(20, yPos, 30, 15, 'F');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Primary', 55, yPos + 10);
      yPos += 20;
    }

    if (brand.secondary_color) {
      const rgb = this.hexToRgb(brand.secondary_color);
      pdf.setFillColor(rgb.r, rgb.g, rgb.b);
      pdf.rect(20, yPos, 30, 15, 'F');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Secondary', 55, yPos + 10);
      yPos += 20;
    }

    yPos += 10;
    pdf.setFontSize(12);
    pdf.text('Typography:', 20, yPos);
    yPos += 10;
    pdf.setFontSize(10);
    pdf.text(`Font Family: ${brand.font_family || 'Arial'}`, 20, yPos);

    // Page 4: Template Specifications
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Design Template Specifications', 20, yPos);
    yPos += 15;

    pdf.setFontSize(12);
    pdf.text(`Template: ${template.template_name}`, 20, yPos);
    yPos += 10;
    pdf.text(`Category: ${template.template_category}`, 20, yPos);
    yPos += 10;
    pdf.text(`Dimensions: ${template.base_layout.dimensions.width}x${template.base_layout.dimensions.height}px`, 20, yPos);
    yPos += 10;
    pdf.text(`Layout Structure: ${template.base_layout.structure}`, 20, yPos);
    yPos += 15;

    pdf.setFontSize(12);
    pdf.text('Template Zones:', 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    template.base_layout.zones.forEach(zone => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`• ${zone.name} (${zone.type})`, 25, yPos);
      yPos += 6;
      pdf.setTextColor(100, 100, 100);
      pdf.text(` Position: ${zone.position.width}x${zone.position.height}px`, 25, yPos);
      yPos += 6;
      if (zone.constraints.maxCharacters) {
        pdf.text(` Max characters: ${zone.constraints.maxCharacters}`, 25, yPos);
        yPos += 6;
      }
      pdf.setTextColor(40, 40, 40);
      yPos += 2;
    });

    // Page 5: Regulatory Requirements
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Regulatory Requirements', 20, yPos);
    yPos += 15;

    pdf.setFontSize(11);
    pdf.text('Mandatory Compliance Rules:', 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    const requirements = [
      'Important Safety Information (ISI) must be clearly visible and legible',
      'Fair balance of risk and benefit information required',
      'Only approved brand colors may be used',
      'All claims must be substantiated and referenced',
      'Font sizes must meet minimum readability standards',
      'Regulatory zones cannot be modified or removed'
    ];

    requirements.forEach(req => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`• ${req}`, 20, yPos);
      yPos += 8;
    });

    // Page 6: Deliverables Checklist
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Deliverables Checklist', 20, yPos);
    yPos += 15;

    pdf.setFontSize(11);
    pdf.text('Required Assets:', 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    const deliverables = [
      'Final design files (layered PSD/AI)',
      'Export-ready assets (PNG, JPG)',
      'HTML email version (if applicable)',
      'Mobile-responsive versions',
      'All content variations implemented',
      'Compliance validation checklist',
      'Source files and fonts used'
    ];

    deliverables.forEach(item => {
      pdf.rect(20, yPos - 3, 3, 3);
      pdf.text(item, 28, yPos);
      yPos += 8;
    });

    return pdf.output('blob');
  }

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  }
}

export default AgencyHandoffService;
