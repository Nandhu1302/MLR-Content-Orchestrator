import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileDown, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';



const topCauses = [
  {
    icon: '🎯',
    category: 'Strategy Silos',
    impact: '40% Time Wasted',
    issues
      'Disconnected planning tools',
      'No cross-functional visibility',
      'Inconsistent initiative handoffs'
    ],
    color: 'from-red-500 to-red-600'
  },
  {
    icon: '📝',
    category: 'Content Creation Gaps',
    impact: '3x Duplicate Work',
    issues
      'No campaign asset reuse',
      'Manual duplicate entry',
      'Lost institutional knowledge'
    ],
    color: 'from-red-400 to-red-500'
  },
  {
    icon: '🎨',
    category: 'Design/Brand Compliance Breakdown',
    impact: '65% Brand Inconsistency',
    issues
      'Brand guidelines not centralized',
      'Visual inconsistencies across channels',
      'Design review bottlenecks'
    ],
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: '⚖️',
    category: 'Compliance & Regulatory Fragmentation',
    impact: 'Multiple MLR Cycles',
    issues
      'Regulatory reviews in isolation',
      'No version control',
      'Repeated approval loops'
    ],
    color: 'from-orange-400 to-orange-500'
  }
];

const bottomCauses = [
  {
    icon: '🌍',
    category: 'Localization Barriers',
    impact: '6-8 Week Delays',
    issues
      'Slow regional adaptation',
      'Lost context in translation',
      'Manual localization workflows'
    ],
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: '📊',
    category: 'Performance & Feedback Gaps',
    impact: 'No Real-Time Insights',
    issues
      'Delayed analytics integration',
      'Poor feedback loops',
      'Learnings not fed back to strategy'
    ],
    color: 'from-amber-400 to-amber-500'
  },
  {
    icon: '🔌',
    category: 'Technical Integration Failure',
    impact: '85% Manual Handoffs',
    issues
      'No workflow automation',
      'Manual data transfers',
      'Siloed systems & databases'
    ],
    color: 'from-yellow-500 to-amber-500'
  }
];

export const FishboneProblemDiagramRFP = () => {
  const diagramRef = useRef<HTMLDivElement>(null);

  const exportToPNG = async () => {
    if (!diagramRef.current) return;
    
    try {
      const canvas = await html2canvas(diagramRef.current, {
        scale,
        backgroundColor: '#ffffff',
        logging,
      });
      
      const link = document.createElement('a');
      link.download = 'fishbone-analysis.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('PNG exported successfully');
    } catch (error) {
      toast.error('Failed to export PNG');
      console.error(error);
    }
  };

  const exportToPDF = async () => {
    if (!diagramRef.current) return;
    
    try {
      const canvas = await html2canvas(diagramRef.current, {
        scale,
        backgroundColor: '#ffffff',
        logging,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('fishbone-analysis.pdf');
      
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error(error);
    }
  };

  const exportToSVG = async () => {
    if (!diagramRef.current) return;
    
    try {
      const canvas = await html2canvas(diagramRef.current, {
        scale,
        backgroundColor: '#ffffff',
        logging,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'fishbone-analysis-raster.png';
      link.href = imgData;
      link.click();
      
      toast.success('High-res image exported');
    } catch (error) {
      toast.error('Failed to export');
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-8">
      <div className="w-full max-w-[1800px] space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            Root Cause Analysis Marketing Operations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            7 Critical Failure Points Driving Inefficiency & Waste
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={exportToPNG} variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
            <Button onClick={exportToPDF} variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={exportToSVG} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              High-Res Export
            </Button>
          </div>
        </div>

        {/* Fishbone Diagram */}
        <div 
          ref={diagramRef}
          className="bg-white p-12 rounded-xl shadow-lg border border-border relative"
          style={{ minHeight: '800px' }}
        >
          {/* Top Causes */}
          <div className="absolute top-[15%] left-0 right-[25%] flex justify-around items-start">
            {topCauses.map((cause, index) => (
              <div key={index} className="relative" style={{ width: '22%' }}>
                {/* Connecting Line */}
                <div 
                  className="absolute left-1/2 top-full w-0.5 bg-gradient-to-b from-gray-400 to-gray-600"
                  style={{ 
                    height: `${80 + index * 20}px`,
                    transform: 'translateX(-50%)'
                  }}
                />
                
                {/* Cause Card */}
                <div className={`bg-gradient-to-br ${cause.color} p-4 rounded-lg shadow-lg text-white transform hover-105 transition-transform`}>
                  <div className="text-4xl mb-2 text-center">{cause.icon}</div>
                  <h3 className="font-bold text-lg mb-1 text-center">{cause.category}</h3>
                  <div className="text-sm font-semibold bg-white/20 rounded px-2 py-1 mb-3 text-center">
                    {cause.impact}
                  </div>
                  <ul className="text-xs space-y-1">
                    {cause.issues.map((issue, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Central Spine (Arrow) */}
          <div className="absolute top-1/2 left-0 right-[22%] transform -translate-y-1/2">
            <div className="relative h-3 bg-gradient-to-r from-gray-600 via-gray-700 to-red-600 rounded-full">
              {/* Arrow Head */}
              <div 
                className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2"
                style={{
                  width,
                  height,
                  borderTop: '20px solid transparent',
                  borderBottom: '20px solid transparent',
                  borderLeft: '30px solid #dc2626'
                }}
              />
            </div>
          </div>

          {/* Bottom Causes */}
          <div className="absolute bottom-[15%] left-0 right-[25%] flex justify-around items-end">
            {bottomCauses.map((cause, index) => (
              <div key={index} className="relative" style={{ width: '30%' }}>
                {/* Connecting Line */}
                <div 
                  className="absolute left-1/2 bottom-full w-0.5 bg-gradient-to-t from-gray-400 to-gray-600"
                  style={{ 
                    height: `${80 + index * 20}px`,
                    transform: 'translateX(-50%)'
                  }}
                />
                
                {/* Cause Card */}
                <div className={`bg-gradient-to-br ${cause.color} p-4 rounded-lg shadow-lg text-white transform hover-105 transition-transform`}>
                  <div className="text-4xl mb-2 text-center">{cause.icon}</div>
                  <h3 className="font-bold text-lg mb-1 text-center">{cause.category}</h3>
                  <div className="text-sm font-semibold bg-white/20 rounded px-2 py-1 mb-3 text-center">
                    {cause.impact}
                  </div>
                  <ul className="text-xs space-y-1">
                    {cause.issues.map((issue, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Problem Statement Box */}
          <div className="absolute top-1/2 right-[2%] transform -translate-y-1/2" style={{ width: '20%' }}>
            <div className="p-6 rounded-xl shadow-2xl text-white border-4" style={{ 
              background: 'linear-gradient(to bottom right, hsl(var(--destructive)), hsl(var(--destructive) / 0.8))',
              borderColor: 'hsl(var(--destructive))'
            }}>
              <div className="text-5xl mb-3 text-center">💥</div>
              <h3 className="font-bold text-xl mb-3 text-center">CORE PROBLEM</h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-center">Inefficient Pharma Content Operations</p>
                <div className="bg-white/20 rounded px-3 py-2 text-center">
                  <div className="font-bold text-2xl">$2B</div>
                  <div className="text-xs">Annual Industry Waste</div>
                </div>
                <p className="text-xs text-center leading-relaxed">
                  Fragmented Systems & Disconnected Workflows
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Summary Panel */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="text-3xl font-bold" style={{ color: 'hsl(var(--destructive))' }}>$2B</div>
            <div className="text-sm text-muted-foreground mt-1">Total Annual Industry Waste</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="text-3xl font-bold" style={{ color: 'hsl(var(--theme-color-1))' }}>320hrs</div>
            <div className="text-sm text-muted-foreground mt-1">Time Lost Per Campaign</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="text-3xl font-bold" style={{ color: 'hsl(var(--theme-color-2))' }}>85%</div>
            <div className="text-sm text-muted-foreground mt-1">Manual Workflows</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="text-3xl font-bold" style={{ color: 'hsl(var(--theme-color-3))' }}>High</div>
            <div className="text-sm text-muted-foreground mt-1">Error Rate Due to Fragmentation</div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold text-lg mb-4">Impact Severity Legend</h3>
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
              <span className="text-sm">Critical Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-400 to-orange-500"></div>
              <span className="text-sm">High Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 to-amber-500"></div>
              <span className="text-sm">Moderate Impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default FishboneProblemDiagramRFP;