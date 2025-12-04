export const mermaidTheme = {
  primaryColor: '#dbeafe',
  primaryBorderColor: '#2563eb',
  primaryTextColor: '#1e293b',
  secondaryColor: '#fef3c7',
  tertiaryColor: '#bbf7d0',
  
  // Background colors
  background: '#ffffff',
  mainBkg: '#f8fafc',
  secondBkg: '#f1f5f9',
  
  // Text colors
  textColor: '#1e293b',
  labelTextColor: '#1e293b',
  
  // Border and line colors
  lineColor: '#64748b',
  border1: '#cbd5e1',
  border2: '#94a3b8',
  
  // Node styling
  nodeBorder: '#2563eb',
  clusterBkg: '#f8fafc',
  clusterBorder: '#cbd5e1',
  
  // Sequence diagram colors
  actorBorder: '#2563eb',
  actorBkg: '#dbeafe',
  actorTextColor: '#1e293b',
  actorLineColor: '#64748b',
  signalColor: '#1e293b',
  signalTextColor: '#1e293b',
  labelBoxBkgColor: '#dbeafe',
  labelBoxBorderColor: '#2563eb',
  
  // ER diagram colors
  attributeBackgroundColorOdd: '#f8fafc',
  attributeBackgroundColorEven: '#f1f5f9',
  
  // Font configuration
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  fontSize: '16px',
};

export const mermaidConfig = {
  startOnLoad: false,
  theme: 'base',
  themeVariables: mermaidTheme,
  securityLevel: 'loose',
  fontFamily: mermaidTheme.fontFamily,
  fontSize: 16,
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 30,
    nodeSpacing: 80,
    rankSpacing: 80,
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
  },
  er: {
    layoutDirection: 'TB',
    minEntityWidth: 100,
    minEntityHeight: 75,
    entityPadding: 15,
    fontSize: 14,
  },
  c4: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    c4ShapeMargin: 50,
    c4ShapePadding: 20,
    personBorder: mermaidTheme.primaryBorderColor,
    personBkg: mermaidTheme.primaryColor,
    c4ShapeBorderColor: mermaidTheme.primaryBorderColor,
  },
};

export const legendStyles = {
  container: 'mt-6 p-4 bg-muted/50 rounded-lg border border-border',
  title: 'text-sm font-semibold text-foreground mb-3',
  grid: 'grid grid-cols-2 gap-3',
  item: 'flex items-center gap-2',
  box: 'w-4 h-4 rounded border-2',
  label: 'text-xs text-muted-foreground',
};