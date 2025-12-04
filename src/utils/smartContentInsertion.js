
export class SmartContentInsertion {
  /**
   * Analyzes content structure to identify optimal insertion points
   */
  static analyzeContentStructure(content) {
    const sections = [];
    const sentences = [];
    // Split content into paragraphs
    const paragraphs = content.split(/\n\s*\n/);
    let currentPosition = 0;
    paragraphs.forEach((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) return;
      const startPos = content.indexOf(trimmedParagraph, currentPosition);
      const endPos = startPos + trimmedParagraph.length;
      // Classify paragraph type
      let sectionType = 'intro';
      if (index === 0 ||
        trimmedParagraph.toLowerCase().includes('dear ')) {
        sectionType = 'intro';
      } else if (trimmedParagraph.toLowerCase().includes('efficacy') ||
        trimmedParagraph.toLowerCase().includes('clinical') ||
        trimmedParagraph.toLowerCase().includes('study') ||
        trimmedParagraph.toLowerCase().includes('trial')) {
        sectionType = 'efficacy';
      } else if (trimmedParagraph.toLowerCase().includes('safety') ||
        trimmedParagraph.toLowerCase().includes('adverse') ||
        trimmedParagraph.toLowerCase().includes('side effect')) {
        sectionType = 'safety';
      } else if (trimmedParagraph.toLowerCase().includes('reference') ||
        trimmedParagraph.toLowerCase().includes('citation') ||
        /^\d+\.\s/.test(trimmedParagraph)) {
        sectionType = 'references';
      } else if (index === paragraphs.length - 1 ||
        trimmedParagraph.toLowerCase().includes('regards') ||
        trimmedParagraph.toLowerCase().includes('sincerely')) {
        sectionType = 'conclusion';
      }
      sections.push({
        type: sectionType,
        start: startPos,
        end: endPos,
        content: trimmedParagraph
      });
      // Analyze sentences within paragraph
      const sentenceMatches = trimmedParagraph.match(/[^.!?]+[.!?]+/g) || [trimmedParagraph];
      let sentencePosition = startPos;
      sentenceMatches.forEach(sentence => {
        const sentenceStart = typeof sentence === 'string' ?
          content.indexOf(sentence.trim(), sentencePosition) : -1;
        const sentenceEnd = sentenceStart >= 0 && typeof sentence === 'string' ?
          sentenceStart + sentence.trim().length : -1;
        let sentenceType = 'general';
        if (sentence.toLowerCase().includes('indicated for') ||
          sentence.toLowerCase().includes('indication')) {
          sentenceType = 'indication';
        } else if (sentence.toLowerCase().includes('efficacy') ||
          sentence.toLowerCase().includes('reduced') ||
          sentence.toLowerCase().includes('improved') ||
          sentence.toLowerCase().includes('demonstrated')) {
          sentenceType = 'claim';
        } else if (sentence.toLowerCase().includes('adverse') ||
          sentence.toLowerCase().includes('safety') ||
          sentence.toLowerCase().includes('warning')) {
          sentenceType = 'safety';
        } else if (/\[\d+\]/.test(sentence) ||
          sentence.toLowerCase().includes('study')) {
          sentenceType = 'reference';
        }
        sentences.push({
          start: sentenceStart,
          end: sentenceEnd,
          content: typeof sentence === 'string' ? sentence.trim() : '',
          type: sentenceType
        });
        sentencePosition = sentenceEnd;
      });
      currentPosition = endPos;
    });
    return { sections, sentences };
  }

  /**
   * Finds optimal insertion point for specific content types
   */
  static findOptimalInsertionPoint(content, insertionType, insertionText) {
    const analysis = this.analyzeContentStructure(content);
    switch (insertionType) {
      case 'indication':
        return this.findIndicationInsertionPoint(content, analysis);
      case 'safety':
      case 'fair_balance':
        return this.findSafetyInsertionPoint(content, analysis);
      case 'disclaimer':
        return this.findDisclaimerInsertionPoint(content, analysis);
      case 'reference':
        return this.findReferenceInsertionPoint(content, analysis);
      default:
        return {
          position: content.length,
          reason: 'Default end position',
          confidence: 0.3
        };
    }
  }

  static findIndicationInsertionPoint(content, analysis) {
    // Look for existing product mentions to insert indication nearby
    const productNames = ['JARDIANCE', 'OFEV', 'PRADAXA'];
    for (const productName of productNames) {
      const productIndex = content.indexOf(productName);
      if (productIndex !== -1) {
        // Find end of sentence containing product name
        const sentence = analysis.sentences.find(s =>
          s.start <= productIndex && s.end >= productIndex
        );
        if (sentence) {
          return {
            position: sentence.end + 1,
            reason: `After product name mention: "${sentence.content.substring(0, 50)}..."`,
            confidence: 0.9
          };
        }
      }
    }
    // Fallback: after introduction
    const introSection = analysis.sections.find(s => s.type === 'intro');
    if (introSection) {
      return {
        position: introSection.end + 1,
        reason: 'After introduction section',
        confidence: 0.7
      };
    }
    return {
      position: 0,
      reason: 'At document beginning',
      confidence: 0.5
    };
  }

  static findSafetyInsertionPoint(content, analysis) {
    // Look for efficacy claims to insert safety information after
    const efficacyClaims = analysis.sentences.filter(s => s.type === 'claim');
    if (efficacyClaims.length > 0) {
      const lastEfficacyClaim = efficacyClaims[efficacyClaims.length - 1];
      return {
        position: lastEfficacyClaim.end + 1,
        reason: `After efficacy claim: "${lastEfficacyClaim.content.substring(0, 50)}..."`,
        confidence: 0.95
      };
    }
    // Look for existing safety section
    const safetySection = analysis.sections.find(s => s.type === 'safety');
    if (safetySection) {
      return {
        position: safetySection.start,
        reason: 'At beginning of existing safety section',
        confidence: 0.8
      };
    }
    // Insert before conclusion
    const conclusionSection = analysis.sections.find(s => s.type === 'conclusion');
    if (conclusionSection) {
      return {
        position: conclusionSection.start - 1,
        reason: 'Before conclusion section',
        confidence: 0.7
      };
    }
    return {
      position: content.length,
      reason: 'At document end',
      confidence: 0.4
    };
  }

  static findDisclaimerInsertionPoint(content, analysis) {
    // Disclaimers typically go at the end
    const conclusionSection = analysis.sections.find(s => s.type === 'conclusion');
    if (conclusionSection) {
      return {
        position: conclusionSection.start - 1,
        reason: 'Before conclusion/signature',
        confidence: 0.9
      };
    }
    return {
      position: content.length,
      reason: 'At document end',
      confidence: 0.8
    };
  }

  static findReferenceInsertionPoint(content, analysis) {
    // References go at the very end
    const referencesSection = analysis.sections.find(s => s.type === 'references');
    if (referencesSection) {
      return {
        position: referencesSection.end,
        reason: 'At end of existing references section',
        confidence: 0.9
      };
    }
    return {
      position: content.length,
      reason: 'At document end for new references section',
      confidence: 0.8
    };
  }

  /**
   * Inserts text at the optimal position with proper formatting
   */
  static insertTextAtOptimalPosition(content, insertionType, insertionText) {
    const insertionPoint = this.findOptimalInsertionPoint(content, insertionType, insertionText);
    // Add proper spacing and formatting
    let formattedText = insertionText;
    // Add spacing before insertion
    if (insertionPoint.position > 0 && !content[insertionPoint.position - 1].match(/\s/)) {
      formattedText = '\n\n' + formattedText;
    } else if (insertionPoint.position > 0 && content[insertionPoint.position - 1] === '\n') {
      formattedText = '\n' + formattedText;
    }
    // Add spacing after insertion
    if (insertionPoint.position < content.length && !content[insertionPoint.position].match(/\s/)) {
      formattedText = formattedText + '\n\n';
    }
    const newContent = content.slice(0, insertionPoint.position) +
      formattedText +
      content.slice(insertionPoint.position);
    return { newContent, insertionPoint };
  }

  /**
   * Provides a preview of where text will be inserted
   */
  static getInsertionPreview(content, insertionType, insertionText) {
    const insertionPoint = this.findOptimalInsertionPoint(
      content,
      insertionType,
      insertionText
    );
    const contextStart = Math.max(0, insertionPoint.position - 100);
    const contextEnd = Math.min(content.length, insertionPoint.position + 100);
    const beforeText = content.slice(contextStart, insertionPoint.position);
    const afterText = content.slice(insertionPoint.position, contextEnd);
    return {
      beforeText,
      afterText,
      insertionPoint,
      insertionText
    };
  }
}