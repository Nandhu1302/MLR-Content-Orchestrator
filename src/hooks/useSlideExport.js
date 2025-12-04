import { useState } from 'react';
import { toast } from 'sonner';
import { exportMarketingDeckToPPT } from '@/utils/marketingDeckExport';
import { exportCurrentSlide, exportSlideToImage, getSlideNames, downloadBlob } from '@/utils/marketingDeckImageExport';
import { exportAllSlidesToPDF } from '@/utils/marketingDeckPDFExport';
import { exportAllSlidesToDOCX } from '@/utils/marketingDeckDocxExport';
import JSZip from 'jszip';

export const useSlideExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExportPDF = async (
    currentSlideIndex,
    totalSlides,
    setCurrentSlide
  ) => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      const originalSlide = currentSlideIndex;
      const toastId = toast.loading('Generating PDF... 0%');
      const pdfBlob = await exportAllSlidesToPDF(
        totalSlides,
        setCurrentSlide,
        (progress) => {
          setExportProgress(progress);
          toast.loading(`Generating PDF... ${progress}%`, { id: toastId });
        }
      );
      setCurrentSlide(originalSlide);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(pdfBlob, `Marketing-Deck-${timestamp}.pdf`);
      setExportProgress(100);
      toast.success('PDF exported successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleExportPNG = async (currentSlide) => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      const slideNames = getSlideNames();
      const slideElement = document.querySelector('[data-slide-content]');
      if (!slideElement) {
        throw new Error('Slide element not found');
      }
      toast.loading('Generating high-resolution image...');
      await exportCurrentSlide(slideElement, currentSlide + 1, slideNames[currentSlide], {
        scale: 2,
      });
      toast.success(`Slide ${currentSlide + 1} exported successfully!`);
    } catch (error) {
      console.error('PNG export failed:', error);
      toast.error('Failed to export slide as PNG. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleExportAllPNG = async (
    currentSlideIndex,
    totalSlides,
    setCurrentSlide
  ) => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      const slideNames = getSlideNames();
      const slideBlobs = [];
      const originalSlide = currentSlideIndex;
      const toastId = toast.loading('Exporting all slides as high-res images... 0%');
      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlide(i);
        await new Promise(resolve => setTimeout(resolve, 300));
        const slideElement = document.querySelector('[data-slide-content]');
        if (!slideElement) {
          throw new Error(`Slide ${i + 1} element not found`);
        }
        const blob = await exportSlideToImage(slideElement, slideNames[i], { scale: 2 });
        slideBlobs.push(blob);
        const progress = Math.round(((i + 1) / totalSlides) * 70);
        setExportProgress(progress);
        toast.loading(`Capturing slides... ${progress}%`, { id: toastId });
      }
      toast.loading('Creating ZIP file... 75%', { id: toastId });
      const zip = new JSZip();
      const folder = zip.folder('Marketing-Deck-Images');
      slideBlobs.forEach((blob, i) => {
        const fileName = `Slide-${String(i + 1).padStart(2, '0')}-${slideNames[i]}.png`;
        folder && folder.file(fileName, blob);
      });
      setExportProgress(90);
      toast.loading('Finalizing ZIP... 90%', { id: toastId });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, 'Marketing-Deck-All-Slides.zip');
      setCurrentSlide(originalSlide);
      setExportProgress(100);
      toast.success('All slides exported successfully!', { id: toastId });
    } catch (error) {
      console.error('Bulk PNG export failed:', error);
      toast.error('Failed to export all slides. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleExportPPT = async () => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      const toastId = toast.loading('Generating editable PowerPoint... 0%');
      await exportMarketingDeckToPPT((progress) => {
        setExportProgress(progress);
        toast.loading(`Generating PowerPoint... ${progress}%`, { id: toastId });
      });
      toast.success('PowerPoint deck exported successfully!', { id: toastId });
    } catch (error) {
      console.error('PPT export failed:', error);
      toast.error('Failed to export PowerPoint. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleExportDOCX = async (
    currentSlideIndex,
    totalSlides,
    setCurrentSlide
  ) => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      const originalSlide = currentSlideIndex;
      const toastId = toast.loading('Generating Word document... 0%');
      const docxBlob = await exportAllSlidesToDOCX(
        totalSlides,
        setCurrentSlide,
        (progress) => {
          setExportProgress(progress);
          toast.loading(`Generating Word document... ${progress}%`, { id: toastId });
        }
      );
      setCurrentSlide(originalSlide);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(docxBlob, `Marketing-Deck-${timestamp}.docx`);
      setExportProgress(100);
      toast.success('Word document exported successfully!', { id: toastId });
    } catch (error) {
      console.error('DOCX export failed:', error);
      toast.error('Failed to export Word document. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleCopySlideLink = (currentSlide) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const slideUrl = `${baseUrl}?slide=${currentSlide + 1}`;
    navigator.clipboard.writeText(slideUrl).then(() => {
      toast.success(`Slide ${currentSlide + 1} link copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return {
    isExporting,
    exportProgress,
    handleExportPDF,
    handleExportPNG,
    handleExportAllPNG,
    handleExportPPT,
    handleExportDOCX,
    handleCopySlideLink,
  };
};
