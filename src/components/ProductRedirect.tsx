import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProductRedirect = () => {
  const { id } = useParams();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductSlug = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('slug')
          .eq('id', id)
          .single();

        if (data && !error) {
          setSlug(data.slug);
        }
      } catch (error) {
        console.error('Error fetching product slug:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductSlug();
    }
  }, [id]);

  if (loading) {
    return <div>Redirecting...</div>;
  }

  if (slug) {
    return <Navigate to={`/products/${slug}`} replace />;
  }

  return <Navigate to="/products" replace />;
};

export default ProductRedirect;
