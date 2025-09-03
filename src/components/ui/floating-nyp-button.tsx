import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FloatingNYPButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show on auth pages or policy page itself
  const hideOnRoutes = ['/auth', '/auth/callback', '/policy'];
  const shouldShow = !hideOnRoutes.includes(location.pathname);

  if (!shouldShow) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        onClick={() => navigate("/policy")}
        className="shadow-lg hover:shadow-xl transition-all duration-200"
        size="sm"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        NYP Policy
      </Button>
    </div>
  );
};

export default FloatingNYPButton;