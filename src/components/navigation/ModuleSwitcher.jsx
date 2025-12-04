import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Home, BarChart3, Palette, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const modules = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: Home,
    description: "Overview and quick actions"
  },
  {
    id: "workshop",
    label: "Content Workshop",
    path: "/content-workshop",
    icon: Palette,
    description: "Create intelligence-driven content"
  },
  {
    id: "intelligence",
    label: "Intelligence Hub",
    path: "/intelligence",
    icon: BarChart3,
    description: "Insights and strategy"
  },
  {
    id: "design-studio",
    label: "Design Studio",
    path: "/design-studio",
    icon: Palette,
    description: "Visual design and layout"
  },
  {
    id: "pre-mlr",
    label: "Pre-MLR Companion",
    path: "/pre-mlr",
    icon: Shield,
    description: "Medical, legal, regulatory review"
  },
  {
    id: "glocalization",
    label: "Glocalization Hub",
    path: "/glocalization",
    icon: Globe,
    description: "Global-to-local content adaptation"
  }
];

const ModuleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentModule = () => {
    return modules.find(module => {
      if (module.path === "/" && location.pathname === "/") return true;
      if (module.path !== "/" && location.pathname.startsWith(module.path)) return true;
      return false;
    }) || modules[0];
  };

  const currentModule = getCurrentModule();

  const handleModuleSelect = (modulePath) => {
    navigate(modulePath);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-sm font-medium hover:bg-accent"
        >
          <currentModule.icon className="h-4 w-4" />
          <span className="hidden md:inline">{currentModule.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {modules.map((module, index) => {
          const isActive = module.id === currentModule.id;
          const Icon = module.icon;
          
          return (
            <div key={module.id}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => handleModuleSelect(module.path)}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  isActive ? 'bg-accent' : ''
                }`}
              >
                <Icon className="h-5 w-5 mt-0.5 text-primary" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{module.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {module.description}
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModuleSwitcher;