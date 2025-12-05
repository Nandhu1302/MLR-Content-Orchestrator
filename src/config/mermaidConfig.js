
import mermaid from 'mermaid';
import { mermaidConfig } from '@/styles/mermaidTheme';

let isInitialized = false;

/**
 * Initialize mermaid once (idempotent)
 */
export const initializeMermaid = () => {
  if (!isInitialized) {
    mermaid.initialize(mermaidConfig);
    isInitialized = true;
  }
};

/**
 * Render a mermaid diagram definition to SVG string
 * @param {string} definition
 * @param {string} id
 * @returns {Promise<string>} svg
 */
export const renderDiagram = async (definition, id) => {
  initializeMermaid();
  try {
    const { svg } = await mermaid.render(id, definition);
    return svg;
  } catch (error) {
    console.error('Mermaid rendering error:', error);
    throw new Error('Failed to render diagram');
  }
};

export { mermaid };

export default {
  initializeMermaid,
  renderDiagram,
  mermaid
};
