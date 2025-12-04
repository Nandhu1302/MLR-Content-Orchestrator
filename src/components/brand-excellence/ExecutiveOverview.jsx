import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

export const ExecutiveOverview = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Executive Overview: The Content Operations Transformation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* The Challenge */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-xl font-semibold text-foreground">The Challenge: Content Operations Trilemma</h3>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Pharmaceutical marketing teams face an impossible trade-off: <span className="font-semibold text-foreground">Speed vs. Compliance vs. Quality</span>. 
              Current manual processes create significant operational challenges:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-orange-600 dark:text-orange-400 mr-2 font-bold">•</span>
                <span><span className="font-semibold text-foreground">Extended Timelines:</span> 12+ weeks for complex assets, impacting launch readiness</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-orange-600 dark:text-orange-400 mr-2 font-bold">•</span>
                <span><span className="font-semibold text-foreground">High Rejection Rates:</span> 60% MLR rejection baseline causing costly rework cycles</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-orange-600 dark:text-orange-400 mr-2 font-bold">•</span>
                <span><span className="font-semibold text-foreground">Fragmented Operations:</span> Disconnected tools across 6-8 platforms creating workflow inefficiencies</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-orange-600 dark:text-orange-400 mr-2 font-bold">•</span>
                <span><span className="font-semibold text-foreground">Market Pressures:</span> Accelerating launch timelines, expanding global footprint, increasing regulatory complexity</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-orange-600 dark:text-orange-400 mr-2 font-bold">•</span>
                <span><span className="font-semibold text-foreground">Opportunity Cost:</span> Delayed time-to-market equals <span className="font-bold text-foreground">$3.2M+ lost annually per brand</span></span>
              </li>
            </ul>
          </div>
        </div>

        {/* The Solution */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-foreground">The Solution: Brand Excellence Platform</h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 space-y-3 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-muted-foreground">
              A <span className="font-semibold text-foreground">three-pillar integrated ecosystem</span> that addresses the entire content lifecycle 
              from strategic planning through compliance to global deployment:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2 font-bold">1.</span>
                <span><span className="font-semibold text-foreground">Strategic Content Intelligence Hub:</span> AI analyzes competitive landscape, market dynamics, and brand guidelines to generate strategic themes with real-time guardrails</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2 font-bold">2.</span>
                <span><span className="font-semibold text-foreground">PreMLR Compliance Companion:</span> Predictive system learns from historical MLR decisions to provide compliance scoring and pre-approved alternatives before formal review</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2 font-bold">3.</span>
                <span><span className="font-semibold text-foreground">Global-Local Orchestration Engine:</span> Culturally-intelligent translation leveraging TM, medical terminology, and regulatory frameworks for true "glocalization"</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Technology Foundation:</span> Built on Enterprise AI Engines (GPT-5, Gemini 2.5) + 
                pharmaceutical-specific training data (MedDRA, SNOMED, regulatory frameworks) + proven marketing expertise
              </p>
            </div>
          </div>
        </div>

        {/* The Value Proposition */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-semibold text-foreground">The Value Proposition: Quantified Business Outcomes</h3>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">75%</div>
                  <div className="text-sm font-semibold text-foreground">Time-to-Market Reduction</div>
                </div>
                <p className="text-xs text-muted-foreground">12 weeks → 3 weeks for complex assets</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">90%</div>
                  <div className="text-sm font-semibold text-foreground">First-Pass MLR Approval</div>
                </div>
                <p className="text-xs text-muted-foreground">vs. 40% industry baseline</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">102</div>
                  <div className="text-sm font-semibold text-foreground">Localized Assets/Year</div>
                </div>
                <p className="text-xs text-muted-foreground">34 assets × 3 markets with existing resources</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">$3.2M+</div>
                  <div className="text-sm font-semibold text-foreground">Annual Value Per Brand</div>
                </div>
                <p className="text-xs text-muted-foreground">12-18 month payback period</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Additional Benefits:</p>
                <p className="text-xs text-muted-foreground">
                  • 50+ market regulatory framework coverage with real-time validation<br/>
                  • 30% translation cost reduction through TM leverage and AI optimization<br/>
                  • 40% labor efficiency improvement increasing capacity without headcount growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};