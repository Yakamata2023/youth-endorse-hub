import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import FloatingNYPButton from "@/components/ui/floating-nyp-button";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  
  // Don't show sidebar on auth pages
  const hideLayout = ["/auth", "/auth/callback", "/signup"].includes(location.pathname);
  
  if (hideLayout) {
    return (
      <>
        <FloatingNYPButton />
        {children}
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger */}
          <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Federal Ministry of Youth Development
              </span>
            </div>
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        
        <FloatingNYPButton />
      </div>
    </SidebarProvider>
  );
}