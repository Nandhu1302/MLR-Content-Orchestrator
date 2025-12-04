import { demoProofPoints } from "@/utils/biProposalData";
import { CheckCircle2 } from "lucide-react";

export const DemoProofPointsCard = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-primary mb-4">
          This Isn't Vaporware - You've Seen It Work
        </h3>
        <p className="text-2xl text-muted-foreground">
          Recap of your live demo achievements
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {demoProofPoints.map((point, index) => (
          <div
            key={index}
            className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-xl p-8 hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xl font-bold text-primary mb-2">
                  {point.phase}
                </p>
                <p className="text-lg text-foreground">{point.achievement}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border-2 border-primary rounded-xl p-8 text-center">
        <p className="text-2xl font-bold text-foreground mb-4">
          "The platform successfully processed our IPF patient brochure
          end-to-end"
        </p>
        <p className="text-xl text-muted-foreground">
          From upload to export-ready in under 10 minutes - with 92% TM leverage
          and proactive compliance validation
        </p>
      </div>
    </div>
  );
};
