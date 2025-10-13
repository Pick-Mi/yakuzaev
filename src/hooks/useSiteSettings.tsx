import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        console.log("Fetching site settings...");
        const { data, error } = await supabase
          .from("site_settings")
          .select("site_title, favicon_url")
          .limit(1);

        console.log("Site settings data:", data, "Error:", error);

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
            // Remove existing favicon links
            const existingFavicons = document.querySelectorAll("link[rel*='icon']");
            existingFavicons.forEach(favicon => favicon.remove());

            // Create new favicon link
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = settings.favicon_url;
            
            // Determine type based on URL extension
            if (settings.favicon_url.endsWith('.png')) {
              link.type = "image/png";
            } else if (settings.favicon_url.endsWith('.svg')) {
              link.type = "image/svg+xml";
            } else if (settings.favicon_url.endsWith('.ico')) {
              link.type = "image/x-icon";
            }
            
            document.head.appendChild(link);
            console.log("Favicon updated successfully");
          }
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);
};
