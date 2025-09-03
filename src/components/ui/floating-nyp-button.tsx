import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, X } from "lucide-react";

const FloatingNYPButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // Don't show on policy page itself
  if (location.pathname === "/policy" || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Button 
        onClick={() => navigate("/policy")}
        className="shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
        size="sm"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        NYP (National Youth Policy)
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="h-8 w-8 p-0 shadow-lg hover:shadow-xl bg-background/80 hover:bg-background"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default FloatingNYPButton;