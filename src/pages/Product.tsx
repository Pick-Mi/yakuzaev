import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import ComponentCards from "@/components/ComponentCards";
import DesignSection from "@/components/DesignSection";
import FeaturesAndBenefitsSection from "@/components/FeaturesAndBenefitsSection";
import ThrillsSection from "@/components/ThrillsSection";
import RideInMotion from "@/components/RideInMotion";
import ColorVarietySection from "@/components/ColorVarietySection";
import VariantsPricingSection from "@/components/VariantsPricingSection";
import AccessoriesSection from "@/components/AccessoriesSection";
import ProductShowcase from "@/components/ProductShowcase";
import { FAQSection } from "@/components/FAQSection";
import { ProductBottomNav } from "@/components/ProductBottomNav";
import Footer from "@/components/Footer";





import { ArrowLeft, Star, Heart, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [variantFromSection, setVariantFromSection] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Using any type to bypass the current type limitations
        const response = await (supabase as any)
          .from('products')
          .select('id, name, slug, price, image_url, thumbnail, images, description, is_active, preview_section, features, visual_features, design_features, benefits, promo_card, videos, accessories, qa_section, variants, specification_titles, color_variety')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (response.error) throw response.error;

        if (response.data) {
          // Parse images if it's a JSON string
          let parsedImages = [];
          try {
            parsedImages = typeof response.data.images === 'string' 
              ? JSON.parse(response.data.images) 
              : response.data.images || [];
          } catch (e) {
            parsedImages = [];
          }

          // Parse variants if it's a JSON string
          let parsedVariants = [];
          try {
            parsedVariants = typeof response.data.variants === 'string' 
              ? JSON.parse(response.data.variants) 
              : response.data.variants || [];
          } catch (e) {
            parsedVariants = [];
          }

          // Parse specification_titles if it's a JSON string
          let parsedSpecificationTitles = [];
          try {
            parsedSpecificationTitles = typeof response.data.specification_titles === 'string' 
              ? JSON.parse(response.data.specification_titles) 
              : response.data.specification_titles || [];
          } catch (e) {
            parsedSpecificationTitles = [];
          }

          // Parse preview_section if it's a JSON string
          let parsedPreviewSection = {};
          try {
            parsedPreviewSection = typeof response.data.preview_section === 'string' 
              ? JSON.parse(response.data.preview_section) 
              : response.data.preview_section || {};
          } catch (e) {
            parsedPreviewSection = {};
          }

          // Parse features if it's a JSON string
          let parsedFeatures = [];
          try {
            parsedFeatures = typeof response.data.features === 'string' 
              ? JSON.parse(response.data.features) 
              : response.data.features || [];
          } catch (e) {
            parsedFeatures = [];
          }

          // Parse visual_features if it's a JSON string
          let parsedVisualFeatures = [];
          try {
            parsedVisualFeatures = typeof response.data.visual_features === 'string' 
              ? JSON.parse(response.data.visual_features) 
              : response.data.visual_features || [];
          } catch (e) {
            parsedVisualFeatures = [];
          }

          // Parse design_features if it's a JSON string
          let parsedDesignFeatures = [];
          try {
            parsedDesignFeatures = typeof response.data.design_features === 'string' 
              ? JSON.parse(response.data.design_features) 
              : response.data.design_features || [];
          } catch (e) {
            parsedDesignFeatures = [];
          }

          // Parse benefits if it's a JSON string
          let parsedBenefits = [];
          try {
            parsedBenefits = typeof response.data.benefits === 'string' 
              ? JSON.parse(response.data.benefits) 
              : response.data.benefits || [];
          } catch (e) {
            parsedBenefits = [];
          }

          // Parse promo_card if it's a JSON string
          let parsedPromoCard = {};
          try {
            parsedPromoCard = typeof response.data.promo_card === 'string' 
              ? JSON.parse(response.data.promo_card) 
              : response.data.promo_card || {};
          } catch (e) {
            parsedPromoCard = {};
          }

          // Parse videos if it's a JSON string
          let parsedVideos = [];
          try {
            parsedVideos = typeof response.data.videos === 'string' 
              ? JSON.parse(response.data.videos) 
              : response.data.videos || [];
          } catch (e) {
            parsedVideos = [];
          }

          // Parse accessories if it's a JSON string
          let parsedAccessories = [];
          try {
            parsedAccessories = typeof response.data.accessories === 'string' 
              ? JSON.parse(response.data.accessories) 
              : response.data.accessories || [];
          } catch (e) {
            parsedAccessories = [];
          }

          // Parse qa_section if it's a JSON string
          let parsedQASection = [];
          try {
            parsedQASection = typeof response.data.qa_section === 'string' 
              ? JSON.parse(response.data.qa_section) 
              : response.data.qa_section || [];
            console.log('Q&A Section from DB:', response.data.qa_section);
            console.log('Parsed Q&A Section:', parsedQASection);
          } catch (e) {
            console.error('Error parsing Q&A section:', e);
            parsedQASection = [];
          }

          // Parse color_variety if it's a JSON string
          let parsedColorVariety = null;
          try {
            parsedColorVariety = typeof response.data.color_variety === 'string' 
              ? JSON.parse(response.data.color_variety) 
              : response.data.color_variety || null;
            console.log('Color Variety from DB:', response.data.color_variety);
            console.log('Parsed Color Variety:', parsedColorVariety);
          } catch (e) {
            console.error('Error parsing color_variety:', e);
            parsedColorVariety = null;
          }

          // Parse custom_metadata if it's a JSON string
          let parsedCustomMetadata = {};
          try {
            parsedCustomMetadata = typeof response.data.custom_metadata === 'string' 
              ? JSON.parse(response.data.custom_metadata) 
              : response.data.custom_metadata || {};
          } catch (e) {
            parsedCustomMetadata = {};
          }

          const fetchedProduct = {
            id: response.data.id,
            name: response.data.name,
            slug: response.data.slug,
            price: response.data.price,
            sku: null,
            cost_price: null,
            thumbnail: response.data.thumbnail,
            image_url: response.data.image_url,
            images: parsedImages,
            image: response.data.thumbnail || (parsedImages.length > 0 ? parsedImages[0] : response.data.image_url),
            rating: 5,
            reviewCount: Math.floor(Math.random() * 200) + 10,
            recommended: true,
            description: response.data.description || "High-quality product for your needs.",
            variants: parsedVariants,
            specification_titles: parsedSpecificationTitles,
            preview_section: parsedPreviewSection,
            features: parsedFeatures,
            visual_features: parsedVisualFeatures,
            design_features: parsedDesignFeatures,
            benefits: parsedBenefits,
            promo_card: parsedPromoCard,
            videos: parsedVideos,
            accessories: parsedAccessories,
            qa_section: parsedQASection,
            color_variety: parsedColorVariety,
            // SEO Fields (defaults)
            meta_title: null,
            meta_description: null,
            meta_keywords: null,
            // Promotional Scheme Fields (defaults)
            scheme_name: null,
            scheme_description: null,
            scheme_discount_percentage: null,
            scheme_start_date: null,
            scheme_end_date: null,
            scheme_active: false,
            // Custom Metadata (defaults)
            custom_metadata: {}
          };
          setProduct(fetchedProduct);
          
          // Set first variant as default selected
          if (parsedVariants.length > 0) {
            setSelectedVariant(parsedVariants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, toast]);

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        ...product,
        quantity,
        selectedVariant: selectedVariant,
        price: selectedVariant ? selectedVariant.price : product.price
      };
      addToCart(productToAdd);
      toast({
        title: "Added to cart",
        description: `${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} has been added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate('/product-config', {
        state: {
          product,
          selectedVariant,
          quantity,
          from: 'Product Details'
        }
      });
    }
  };

  const getCurrentPrice = () => {
    // Prioritize variant from pricing section over bottom nav variant
    const activeVariant = variantFromSection || selectedVariant;
    if (activeVariant && activeVariant.price) {
      // Remove currency symbol and parse
      const priceStr = activeVariant.price.replace(/[₹,]/g, '');
      return parseFloat(priceStr) || product?.price || 0;
    }
    return product?.price || 0;
  };

  const handleVariantSelect = (variant: any) => {
    setVariantFromSection(variant);
    
    // Extract price from specifications array
    const priceSpec = variant.specifications?.find((s: any) => s.label === 'Price');
    const priceValue = priceSpec?.value ? parseFloat(priceSpec.value.replace(/[₹,]/g, '')) || 0 : 0;
    
    // Update selectedVariant to match the structure expected by ProductBottomNav
    const updatedVariant = {
      name: variant.name,
      price: priceValue,
      specifications: variant.specifications
    };
    setSelectedVariant(updatedVariant);
    
    // Scroll to bottom to show the updated bar
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Build Product Schema with custom metadata
  const buildProductSchema = () => {
    const schema: any = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description || product.meta_description,
      "image": product.image_url || product.thumbnail,
      "brand": {
        "@type": "Brand",
        "name": product.custom_metadata?.brand || "Your Brand"
      },
      "sku": product.sku,
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "INR",
        "price": getCurrentPrice(),
        "availability": "https://schema.org/InStock",
        "priceValidUntil": product.scheme_end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    };

    // Add aggregateRating if available
    if (product.rating && product.reviewCount) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      };
    }

    // Add custom metadata as additionalProperty
    if (product.custom_metadata && Object.keys(product.custom_metadata).length > 0) {
      schema.additionalProperty = Object.entries(product.custom_metadata).map(([key, value]) => ({
        "@type": "PropertyValue",
        "name": key.replace(/_/g, ' '),
        "value": typeof value === 'object' ? JSON.stringify(value) : String(value)
      }));
    }

    return schema;
  };

  return (
    <div className="min-h-screen bg-[#F8F9F9]">
      <Helmet>
        <title>{product.meta_title || `${product.name} - Product Details`}</title>
        <meta name="description" content={product.meta_description || product.description} />
        {product.meta_keywords && Array.isArray(product.meta_keywords) && (
          <meta name="keywords" content={product.meta_keywords.join(', ')} />
        )}
        <meta property="og:title" content={product.meta_title || product.name} />
        <meta property="og:description" content={product.meta_description || product.description} />
        <meta property="og:image" content={product.image_url || product.thumbnail} />
        <meta property="og:type" content="product" />
        <meta property="og:price:amount" content={String(getCurrentPrice())} />
        <meta property="og:price:currency" content="INR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.meta_title || product.name} />
        <meta name="twitter:description" content={product.meta_description || product.description} />
        <meta name="twitter:image" content={product.image_url || product.thumbnail} />
        
        {/* Product Schema with Custom Metadata */}
        <script type="application/ld+json">
          {JSON.stringify(buildProductSchema())}
        </script>
      </Helmet>
      <Header />
      
      {/* Hero Section */}
      <ProductHero
        productName={product.name}
        price={getCurrentPrice()}
        topSpeed="90 km/h"
        range="161 km"
        chargeTime="30 km"
        backgroundImage={product.preview_section?.backgroundImage}
        previewTitle={product.preview_section?.title}
        specs={product.preview_section?.specs}
        onBookNow={handleBuyNow}
        onAddToCart={handleAddToCart}
      />
      
      {/* Features Section */}
      <div className="bg-[#f5f5f5]">
        <ProductFeatures features={product.features} />
      </div>
      
      {/* Component Cards Section */}
      <ComponentCards visualFeatures={product.visual_features} />
      
      {/* Design Section */}
      <DesignSection designFeatures={product.design_features} />
      
      {/* Features and Benefits Section */}
      <FeaturesAndBenefitsSection benefits={product.benefits} />
      
      {/* Thrills Section */}
      <ThrillsSection promoCard={product.promo_card} />
      
      {/* Ride in Motion Section */}
      <RideInMotion videos={product.videos} />
      
      {/* Color Variety Section */}
      <ColorVarietySection colorVariety={product.color_variety} />
      
      {/* Variants Pricing Section */}
      <VariantsPricingSection 
        onVariantSelect={handleVariantSelect}
        variants={product.variants}
        specificationTitles={product.specification_titles}
      />
      
      {/* Accessories Section */}
      <AccessoriesSection accessories={product.accessories} />
      
      {/* Product Showcase Section */}
      <ProductShowcase />
      
      {/* FAQ Section */}
      <FAQSection faqs={product.qa_section} />

      {/* Footer */}
      <Footer />

      {/* Bottom Fixed Navigation */}
      {product && (
        <ProductBottomNav
          productName={product.name}
          variants={product.variants || []}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          price={getCurrentPrice()}
          onBookNow={handleBuyNow}
        />
      )}

    </div>
  );
};

export default Product;