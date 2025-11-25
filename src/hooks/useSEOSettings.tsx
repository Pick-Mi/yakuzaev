import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOSettings {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  schema_json?: any;
}

export const useSEOSettings = (pageRoute: string) => {
  const [seoSettings, setSEOSettings] = useState<SEOSettings | null>(null);

  useEffect(() => {
    const fetchSEO = async () => {
      const { data } = await supabase
        .from('page_seo_settings')
        .select('*')
        .eq('page_route', pageRoute)
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        setSEOSettings(data);
      }
    };

    fetchSEO();
  }, [pageRoute]);

  return seoSettings;
};
