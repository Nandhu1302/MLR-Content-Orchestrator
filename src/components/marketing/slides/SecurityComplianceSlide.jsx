
import { securityCompliance } from '@/utils/marketingDeckData';
import { Shield, CheckCircle2 } from 'lucide-react';

const SecurityComplianceSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">Technical & Security</h2>
        <p className="text-2xl text-muted-foreground">Enterprise-Grade Security & Compliance</p>
      </div>

      {/* Compliance and Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Compliance Standards */}
        <div className="space-y-4">
          {securityCompliance.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xl font-bold text-foreground">{item.standard}</p>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-semibold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infrastructure & Architecture */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">Infrastructure & Architecture</h3>
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-base font-semibold text-foreground mb-2">Cloud-Native Platform</p>
              <p className="text-sm text-muted-foreground">AWS/Azure with auto-scaling capabilities</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-base font-semibold text-foreground mb-2">99.9% Uptime SLA</p>
              <p className="text-sm text-muted-foreground">Guaranteed availability with disaster recovery</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-base font-semibold text-foreground mb-2">Data Encryption</p>
              <p className="text-sm text-muted-foreground">At rest and in transit (AES-256, TLS 1.3)</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-base font-semibold text-foreground mb-2">Role-Based Access Control</p>
              <p className="text-sm text-muted-foreground">Granular permissions with SSO support</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-base font-semibold text-foreground mb-2">Complete Audit Trail</p>
              <p className="text-sm text-muted-foreground">Every action logged for 21 CFR Part 11 compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Technical Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
            <p className="font-semibold text-foreground">Minimum 10 Mbps bandwidth</p>
          </div>
          <div>
            <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
            <p className="font-semibold text-foreground">Chrome, Edge, Safari compatible</p>
          </div>
          <div>
            <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
            <p className="font-semibold text-foreground">SAML 2.0 SSO integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityComplianceSlide;
