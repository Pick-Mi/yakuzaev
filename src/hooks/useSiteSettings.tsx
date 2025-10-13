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
          .maybeSingle();

        console.log("Site settings data:", data, "Error:", error);

        if (!error && data) {
          // Update document title
          if (data.site_title) {
            console.log("Setting document title to:", data.site_title);
            document.title = data.site_title;
          }

          // Update favicon
          if (data.favicon_url) {
            console.log("Setting favicon to:", data.favicon_url);
            // Remove existing favicon links
            const existingFavicons = document.querySelectorAll("link[rel*='icon']");
            existingFavicons.forEach(favicon => favicon.remove());

            // Create new favicon link
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = data.favicon_url;
            
            // Determine type based on URL extension
            if (data.favicon_url.endsWith('.png')) {
              link.type = "image/png";
            } else if (data.favicon_url.endsWith('.svg')) {
              link.type = "image/svg+xml";
            } else if (data.favicon_url.endsWith('.ico')) {
              link.type = "image/x-icon";
            }
            
            document.head.appendChild(link);
          }
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);
};
