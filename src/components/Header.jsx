
import { Bell, Search, User, ChevronDown, LogOut, Shield, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Breadcrumb from "./navigation/Breadcrumb";
import ModuleSwitcher from "./navigation/ModuleSwitcher";
import BrandIndicator from "./brand/BrandIndicator";
import { EnhancedGuardrailsPanel } from "./guardrails/EnhancedGuardrailsPanel";
import { useBrand } from "@/contexts/BrandContext";
import { useAuth } from "@/contexts/AuthContext";
import { GuardrailsService } from "@/services/guardrailsService";

const Header = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { user, signOut } = useAuth();
  const [guardrailsDialogOpen, setGuardrailsDialogOpen] = useState(false);
  const [guardrailsStatus, setGuardrailsStatus] = useState(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  useEffect(() => {
    if (selectedBrand) {
      loadGuardrailsStatus();
    }
  }, [selectedBrand]);

  const loadGuardrailsStatus = async () => {
    if (!selectedBrand) return;
    try {
      const guardrails = await GuardrailsService.getGuardrails(selectedBrand.id);
      const status = GuardrailsService.getGuardrailsStatus(guardrails);
      setGuardrailsStatus(status);
    } catch (error) {
      console.error('Error loading guardrails status:', error);
    }
  };

  const userDisplayName = user?.user_metadata?.display_name || user?.email || 'User';
  const userInitials = userDisplayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getGuardrailsBadgeVariant = (level) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 max-w-[2560px]">
        {/* Left Section: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:bg-transparent p-0 h-auto shrink-0"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-xl">
                {selectedBrand?.brand_name?.charAt(0) || 'P'}
              </span>
            </div>
            <div className="text-left hidden lg:block min-w-0">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent truncate">
                {selectedBrand?.brand_name || 'Pharmaceutical'} Content Hub
              </h1>
              <p className="text-sm text-muted-foreground font-medium truncate">
                {selectedBrand?.company || 'Multi-Brand Platform'}
              </p>
            </div>
          </Button>
          <div className="hidden xl:flex items-center gap-6">
            <ModuleSwitcher />
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-4">
              <Breadcrumb />
              <BrandIndicator />
            </div>
          </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="flex-1 max-w-xl hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns, content, or assets..."
              className="pl-10 bg-muted/50 h-10"
            />
          </div>
        </div>

        {/* Right Section: Actions & User Profile */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          {/* Guardrails Button */}
          <Dialog open={guardrailsDialogOpen} onOpenChange={setGuardrailsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hidden md:flex">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Guardrails</span>
                {guardrailsStatus?.needs_attention && (
                  <Badge
                    variant={getGuardrailsBadgeVariant(guardrailsStatus.staleness_level)}
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {guardrailsStatus.staleness_level === 'critical' ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : '!'}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-6xl max-h-[90vh] overflow-hidden p-0">
              <EnhancedGuardrailsPanel showComplianceCheck={false} showCustomization={false} />
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-muted/50">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-sm font-semibold">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-medium leading-none mb-1">{userDisplayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email?.includes('demo@') ? 'Demo User' : 'Content Strategist'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden xl:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
