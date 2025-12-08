
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

const DEFAULT_OPTIONS = {
  scale: 2, // High-res by default (3840x2160)
  backgroundColor: '#ffffff',
  quality: 1,
};

export const exportSlideToImage = async (
  slideElement,
  slideName,
  options = {}
) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Store original styles to restore after capture
  const originalOverflow = slideElement.style.overflow;
  const originalWidth = slideElement.style.width;
  const originalHeight = slideElement.style.height;
  const originalMaxWidth = slideElement.style.maxWidth;
  const originalMaxHeight = slideElement.style.maxHeight;
  const originalBorder = slideElement.style.border;
  const originalBoxShadow = slideElement.style.boxShadow;
  const originalBorderRadius = slideElement.style.borderRadius;
  
  // Temporarily adjust for clean, full capture with exact dimensions
  slideElement.style.overflow = 'visible';
  slideElement.style.width = '1920px';
  slideElement.style.height = '1080px';
  slideElement.style.maxWidth = '1920px';
  slideElement.style.maxHeight = '1080px';
  slideElement.style.border = 'none';
  slideElement.style.boxShadow = 'none';
  slideElement.style.borderRadius = '0';
  
  // Wait for layout to stabilize
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const canvas = await html2canvas(slideElement, {
    scale: opts.scale,
    backgroundColor: opts.backgroundColor,
    useCORS: true,
    allowTaint: true,
    logging: false,
    scrollY: 0,
    scrollX: 0,
    width: 1920,
    height: 1080,
    removeContainer: true,
  });
  
  // Restore original styles
  slideElement.style.overflow = originalOverflow;
  slideElement.style.width = originalWidth;
  slideElement.style.height = originalHeight;
  slideElement.style.maxWidth = originalMaxWidth;
  slideElement.style.maxHeight = originalMaxHeight;
  slideElement.style.border = originalBorder;
  slideElement.style.boxShadow = originalBoxShadow;
  slideElement.style.borderRadius = originalBorderRadius;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      'image/png',
      opts.quality
    );
  });
};

export const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportCurrentSlide = async (
  slideElement,
  slideNumber,
  slideName,
  options = {}
) => {
  const blob = await exportSlideToImage(slideElement, slideName, options);
  const fileName = `Content-Orchestrator-Slide-${String(slideNumber).padStart(2, '0')}-${slideName}.png`;
  downloadBlob(blob, fileName);
};

export const exportMarketingDeckToPPT = async (
  slideElements,
  slideNames,
  progressCallback,
  options = {}
) => {
  const zip = new JSZip();
  const folder = zip.folder('Marketing-Deck-Images');

  if (!folder) {
    throw new Error('Failed to create ZIP folder');
  }

  for (let i = 0; i < slideElements.length; i++) {
    try {
      const blob = await exportSlideToImage(slideElements[i], slideNames[i], options);
      const fileName = `Slide-${String(i + 1).padStart(2, '0')}-${slideNames[i]}.png`;
      folder.file(fileName, blob);
      
      const progress = Math.round(((i + 1) / slideElements.length) * 100);
      progressCallback?.(progress);
    } catch (error) {
      console.error(`Failed to export slide ${i + 1}:`, error);
      // Continue with other slides even if one fails
    }
  }

  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const fileName = `Content-Orchestrator-Marketing-Deck-${new Date().toISOString().split('T')[0]}.zip`;
  downloadBlob(zipBlob, fileName);
};

// Helper to get slide name from component
export const getSlideNames = () => {
  return [
    'Title',
    'Industry-Problem',
    'Client-Reality',
    'Hidden-Costs',
    'Solution',
    'Intelligence',
    'Workflow-Detail',
    'Integration',
    'Case-Study',
    'Demo-Proof',
    'Competitive-Detail',
    'ROI-Calculator',
    'Metrics-Dashboard',
    'Implementation-Roadmap',
    'Risk-Mitigation',
    'Security-Compliance',
    'Why-Act-Now',
    'CTA'
  ];
};