
import { ArrowRight, Calendar, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASlide = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary via-primary to-primary-hover p-16 flex flex-col items-center justify-center text-white">
      <Sparkles className="w-20 h-20 mb-8 text-primary-foreground/90" />

      <h2 className="text-6xl font-bold mb-6 text-center">
        Transform Your Pharmaceutical Marketing Operations
      </h2>

      <p className="text-2xl text-primary-foreground/80 mb-16 text-center max-w-3xl">
        Join leading pharmaceutical companies leveraging intelligence-driven content orchestration
      </p>

      <div className="grid grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
          <h3 className="text-xl font-semibold mb-3">Schedule a Demo</h3>
          <p className="text-primary-foreground/80 mb-4">
            See the platform in action with your use case
          </p>
          <Button variant="secondary" className="w-full">
            Book 30-min Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
          <h3 className="text-xl font-semibold mb-3">Start a Pilot</h3>
          <p className="text-primary-foreground/80 mb-4">
            Launch with a single campaign to prove ROI
          </p>
          <Button variant="secondary" className="w-full">
            Request Pilot Program
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
          <h3 className="text-xl font-semibold mb-3">Get in Touch</h3>
          <p className="text-primary-foreground/80 mb-4">
            Discuss custom requirements and pricing
          </p>
          <Button variant="secondary" className="w-full">
            Contact Sales
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg text-primary-foreground/80 mb-2">Ready to get started?</p>
        <p className="text-2xl font-semibold">demo@contentorchestrator.com</p>
      </div>
    </div>
  );
};

export default CTASlide;
