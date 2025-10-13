import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  useEffect(() => {
    console.log("useSiteSettings hook mounted");
    
    const fetchSiteSettings = async () => {
      try {
        console.log("Fetching site settings...");
        const { data, error } = await supabase
          .from("site_settings")
          .select("site_title, favicon_url")
          .limit(1);

        console.log("Site settings response - data:", data, "error:", error);

        if (!error && data && data.length > 0) {
          const settings = data[0];
          
          // Update document title
          if (settings.site_title) {
            console.log("Setting document title to:", settings.site_title);
            document.title = settings.site_title;
          }

          // Update favicon
          if (settings.favicon_url) {
            console.log("Setting favicon to:", settings.favicon_url);
            
            // Remove ALL existing favicon-related links
            const existingLinks = document.querySelectorAll(
              "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
            );
            existingLinks.forEach(link => {
              console.log("Removing existing link:", link);
              link.remove();
            });

            // Add cache-busting parameter to force reload
            const cacheBustUrl = `${settings.favicon_url}?v=${Date.now()}`;
            
            // Create new favicon link
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = cacheBustUrl;
            
            // Determine type based on URL extension
            if (settings.favicon_url.endsWith('.png')) {
              link.type = "image/png";
            } else if (settings.favicon_url.endsWith('.svg')) {
              link.type = "image/svg+xml";
            } else if (settings.favicon_url.endsWith('.ico')) {
              link.type = "image/x-icon";
            }
            
            document.head.appendChild(link);
            console.log("Favicon updated successfully with URL:", cacheBustUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);
};
