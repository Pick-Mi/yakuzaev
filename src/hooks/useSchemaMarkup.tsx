import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSchemaMarkup = (pageRoute: string) => {
  const [schemaMarkup, setSchemaMarkup] = useState<any>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      const { data } = await supabase
        .from('page_seo_settings')
        .select('schema_json')
        .eq('page_route', pageRoute)
        .eq('is_active', true)
        .maybeSingle();

      if (data?.schema_json) {
        setSchemaMarkup(data.schema_json);
      }
    };

    fetchSchema();
  }, [pageRoute]);

  return schemaMarkup;
};

// Component to render schema markup in HTML
export const SchemaMarkup = ({ schema }: { schema: any }) => {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
};
