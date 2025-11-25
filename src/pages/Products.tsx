import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";
import { useSEOSettings } from "@/hooks/useSEOSettings";

const Products = () => {
  const seoSettings = useSEOSettings('/products');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        {seoSettings?.meta_title && <title>{seoSettings.meta_title}</title>}
        {seoSettings?.meta_description && (
          <meta name="description" content={seoSettings.meta_description} />
        )}
        {seoSettings?.meta_keywords && (
          <meta name="keywords" content={seoSettings.meta_keywords} />
        )}
        {seoSettings?.og_title && (
          <meta property="og:title" content={seoSettings.og_title} />
        )}
        {seoSettings?.og_description && (
          <meta property="og:description" content={seoSettings.og_description} />
        )}
        {seoSettings?.og_image && (
          <meta property="og:image" content={seoSettings.og_image} />
        )}
        {seoSettings?.canonical_url && (
          <link rel="canonical" href={seoSettings.canonical_url} />
        )}
        {seoSettings?.schema_json && (
          <script type="application/ld+json">
            {JSON.stringify(seoSettings.schema_json, null, 2)}
          </script>
        )}
      </Helmet>
      <Header />
      <Hero />
      <ProductsGrid />
      <Footer />
    </div>
  );
};


export default Products;