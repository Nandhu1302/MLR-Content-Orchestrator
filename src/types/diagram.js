/**
 * @typedef {'c4-context'|'c4-container'|'deployment'|'c4-component'|'erd'|'sequence-translation'|'sequence-cultural'|'data-flow'} DiagramType
 */

/**
 * @typedef {'svg'|'png'|'pdf'} ExportFormat
 */

/**
 * @typedef {'standard'|'high'|'print'} ResolutionOption
 */

/**
 * @typedef {Object} DiagramDefinition
 * @property {DiagramType} id
 * @property {string} name
 * @property {string} description
 * @property {'high-level'|'deep-dive'} category
 * @property {string} mermaidSyntax
 * @property {string} [audience]
 * @property {string} [purpose]
 * @property {string} [keyInsight]
 */

/**
 * @typedef {Object} ExportOptions
 * @property {ExportFormat} format
 * @property {ResolutionOption} [resolution]
 * @property {number} [scale]
 */

/**
 * @typedef {Object} DiagramExport
 * @property {string} name
 * @property {Blob} blob
 * @property {ExportFormat} format
 */

/*
  JSDoc typedefs replace TypeScript types so editors still get type hints in plain JavaScript.
*/

export default {};