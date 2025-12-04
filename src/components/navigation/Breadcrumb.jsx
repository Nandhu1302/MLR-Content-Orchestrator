import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    
    const items = [
      { label: "Dashboard", path: "/", icon: Home }
    ];

    if (path === "/hub") {
      items.push({ label: "Initiative Hub", path: "/hub" });
    } else if (path === "/strategy-insights") {
      items.push({ label: "Strategy & Insights", path: "/strategy-insights" });
    } else if (path === "/content-workflow" || path === "/content-studio") {
      items.push({ label: "Content Hub", path: "/content-workflow" });
    } else if (path === "/localization") {
      items.push({ label: "Localization Hub", path: "/localization" });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const Icon = item.icon;

        return (
          <div key={item.path} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {isLast ? (
              <span className="flex items-center gap-2 text-foreground font-medium">
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </span>
              </Button>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;