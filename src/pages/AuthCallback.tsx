import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if user has a complete profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (!profile || !profile.full_name || !profile.phone_number) {
            // New user or incomplete profile - redirect to signup with prefilled data
            const userMetadata = session.user.user_metadata;
            const params = new URLSearchParams();
            
            if (session.user.email) {
              params.append('email', session.user.email);
            }
            
            if (userMetadata?.full_name || userMetadata?.name) {
              params.append('name', userMetadata.full_name || userMetadata.name);
            }
            
            navigate(`/signup?${params.toString()}`);
          } else {
            // Existing user with complete profile
            navigate('/dashboard');
          }
        } else {
          // No session, redirect to auth
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
