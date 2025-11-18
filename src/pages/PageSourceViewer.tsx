import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Code, Eye, Copy, Check, ExternalLink, Edit, Save } from "lucide-react";
import logo from "@/assets/logo.svg";
import { toast } from "sonner";

// Import the same page data
const WEBSITE_PAGES = [
  { id: '1', page_name: 'Home / Landing', page_slug: '/', source_code: `import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import FearlessDesign from "@/components/FearlessDesign";
import PromoSection from "@/components/PromoSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductShowcase />
      <FearlessDesign />
      <PromoSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;`, github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Index.tsx', type: 'public', file_path: 'src/pages/Index.tsx', description: 'Main landing page' },
  { id: '2', page_name: 'Products Listing', page_slug: '/products', source_code: `import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductsGrid />
      <Footer />
    </div>
  );
};

export default Products;`, github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Products.tsx', type: 'public', file_path: 'src/pages/Products.tsx', description: 'Product listing page' },
  { id: '3', page_name: 'Product Detail', page_slug: '/products/:slug', source_code: 'Individual product detail page with specifications and pricing', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Product.tsx', type: 'public', file_path: 'src/pages/Product.tsx', description: 'Product detail page' },
  { id: '4', page_name: 'Product Configuration', page_slug: '/product-config', source_code: 'Product customization and configuration page', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/ProductConfig.tsx', type: 'public', file_path: 'src/pages/ProductConfig.tsx', description: 'Product configuration' },
  { id: '5', page_name: 'Blogs Listing', page_slug: '/blogs', source_code: `import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogHero from "@/components/BlogHero";
import { supabase } from "@/integrations/supabase/client";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    featured_image: string;
    published_at: string;
    slug: string;
  }>>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, featured_image, published_at, slug")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (error) {
          console.error("Error fetching blogs:", error);
          return;
        }

        setBlogs(data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BlogHero />
      <main id="blogs-section" className="w-full py-[60px] px-[70px]">
        <div className="max-w-[1300px] mx-auto">
          <h1 className="font-['Inter',sans-serif] font-medium text-[48px] text-[#12141d] mb-[50px]">
            All Blogs
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
            {blogs.map((blog) => (
              <Link 
                key={blog.id} 
                to={\`/blogs/\${blog.slug}\`}
                className="bg-white w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
              >
                <div className="relative w-full h-[244px] bg-[#d9d9d9]">
                  <img 
                    src={blog.featured_image || "/placeholder.svg"} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-[20px] flex flex-col gap-[9.403px]">
                  <h3 className="font-['Inter',sans-serif] font-semibold text-[22px] text-black capitalize leading-[39px]">
                    {blog.title}
                  </h3>
                  <p className="font-['Inter',sans-serif] font-normal text-[15.386px] text-black opacity-80">
                    {blog.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {blogs.length === 0 && (
            <p className="text-center text-gray-500 py-20">No blogs published yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;`, github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Blogs.tsx', type: 'public', file_path: 'src/pages/Blogs.tsx', description: 'Blogs listing' },
  { id: '6', page_name: 'Blog Detail', page_slug: '/blogs/:slug', source_code: 'Individual blog post detail page', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/BlogDetail.tsx', type: 'public', file_path: 'src/pages/BlogDetail.tsx', description: 'Blog detail page' },
  { id: '7', page_name: 'About Us', page_slug: '/about-us', source_code: 'Company information, mission, vision, and team', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/AboutUs.tsx', type: 'public', file_path: 'src/pages/AboutUs.tsx', description: 'About company page' },
  { id: '8', page_name: 'Contact Us', page_slug: '/contact-us', source_code: 'Contact form and company contact information', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/ContactUs.tsx', type: 'public', file_path: 'src/pages/ContactUs.tsx', description: 'Contact page' },
  { id: '9', page_name: 'Careers', page_slug: '/careers', source_code: 'Job openings and career opportunities at YakuzaEV', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Careers.tsx', type: 'public', file_path: 'src/pages/Careers.tsx', description: 'Careers page' },
  { id: '10', page_name: 'Job Detail', page_slug: '/careers/:id', source_code: 'Individual job posting details and requirements', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/JobDetail.tsx', type: 'public', file_path: 'src/pages/JobDetail.tsx', description: 'Job detail page' },
  { id: '11', page_name: 'Job Application', page_slug: '/careers/:id/apply', source_code: 'Job application form with resume upload', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/JobApplication.tsx', type: 'public', file_path: 'src/pages/JobApplication.tsx', description: 'Job application form' },
  { id: '12', page_name: 'Become Dealer', page_slug: '/become-dealer', source_code: 'Dealer partnership inquiry and information page', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/BecomeDealer.tsx', type: 'public', file_path: 'src/pages/BecomeDealer.tsx', description: 'Dealer inquiry page' },
  { id: '13', page_name: 'Dealer Application Flow', page_slug: '/dealer-application-flow', source_code: 'Multi-step dealer application process', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/DealerApplicationFlow.tsx', type: 'public', file_path: 'src/pages/DealerApplicationFlow.tsx', description: 'Dealer application flow' },
  { id: '14', page_name: 'Dealer Application Form', page_slug: '/dealer-application-form', source_code: 'Detailed dealer application form', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/DealerApplicationForm.tsx', type: 'public', file_path: 'src/pages/DealerApplicationForm.tsx', description: 'Dealer form' },
  { id: '15', page_name: 'Authentication', page_slug: '/auth', source_code: 'User login and registration page', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Auth.tsx', type: 'auth', file_path: 'src/pages/Auth.tsx', description: 'Login/signup page' },
  { id: '16', page_name: 'User Profile', page_slug: '/profile', source_code: 'User profile and account management', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Profile.tsx', type: 'auth', file_path: 'src/pages/Profile.tsx', description: 'User profile page' },
  { id: '17', page_name: 'Profile Setup', page_slug: '/profile-setup', source_code: 'Initial profile setup for new users', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/ProfileSetup.tsx', type: 'auth', file_path: 'src/pages/ProfileSetup.tsx', description: 'Profile setup' },
  { id: '18', page_name: 'Shopping Cart', page_slug: '/cart', source_code: 'Shopping cart with selected items', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Cart.tsx', type: 'auth', file_path: 'src/pages/Cart.tsx', description: 'Shopping cart' },
  { id: '19', page_name: 'Checkout', page_slug: '/checkout', source_code: 'Order checkout and payment processing', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Checkout.tsx', type: 'auth', file_path: 'src/pages/Checkout.tsx', description: 'Checkout page' },
  { id: '20', page_name: 'Booking Confirmation', page_slug: '/booking-confirmation', source_code: 'Booking confirmation after payment', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/BookingConfirmation.tsx', type: 'auth', file_path: 'src/pages/BookingConfirmation.tsx', description: 'Booking confirmation' },
  { id: '21', page_name: 'Orders', page_slug: '/orders', source_code: 'Order history and tracking', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Orders.tsx', type: 'auth', file_path: 'src/pages/Orders.tsx', description: 'Order history' },
  { id: '22', page_name: 'Order Details', page_slug: '/orders/:id', source_code: 'Individual order details and status tracking', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/OrderDetails.tsx', type: 'auth', file_path: 'src/pages/OrderDetails.tsx', description: 'Order details' },
  { id: '23', page_name: 'Payment Success', page_slug: '/payment-success', source_code: 'Payment successful confirmation page', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/PaymentSuccess.tsx', type: 'auth', file_path: 'src/pages/PaymentSuccess.tsx', description: 'Payment success' },
  { id: '24', page_name: 'Payment Failure', page_slug: '/payment-failure', source_code: 'Payment failed page with retry options', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/PaymentFailure.tsx', type: 'auth', file_path: 'src/pages/PaymentFailure.tsx', description: 'Payment failure' },
  { id: '25', page_name: 'Sitemap', page_slug: '/sitemap', source_code: 'HTML sitemap for site navigation', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Sitemap.tsx', type: 'public', file_path: 'src/pages/Sitemap.tsx', description: 'Sitemap' },
];

const PageSourceViewer = () => {
  const { pageId } = useParams();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const page = WEBSITE_PAGES.find(p => p.id === pageId);

  // Initialize edited code when page loads
  if (page && !editedCode) {
    setEditedCode(page.source_code);
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Page not found</p>
          <Link to="/source-code">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(isEditing ? editedCode : page.source_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // In a real implementation, this would save to a backend
    toast.success("Code saved successfully!");
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedCode(page.source_code);
    setIsEditing(true);
  };

  const getPreviewUrl = () => {
    // For dynamic routes, use example URL
    if (page.page_slug.includes(':slug')) {
      return page.page_slug.replace(':slug', 'example');
    }
    if (page.page_slug.includes(':id')) {
      return page.page_slug.replace(':id', '1');
    }
    return page.page_slug;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo" className="h-8" />
              <div className="flex items-center gap-2">
                <Link to="/source-code">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div>
                  <h1 className="text-lg font-semibold">{page.page_name}</h1>
                  <p className="text-sm text-muted-foreground">{page.file_path}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={page.type === "auth" ? "secondary" : "outline"}>
                {page.type}
              </Badge>
              {page.github_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(page.github_url!, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="visual" className="gap-2">
              <Eye className="w-4 h-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="mt-6">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="border-b border-border px-4 py-3 bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <code className="text-sm text-muted-foreground ml-4">
                    {page.page_slug}
                  </code>
                </div>
              </div>
              <div className="relative" style={{ height: 'calc(100vh - 280px)' }}>
                <iframe
                  src={getPreviewUrl()}
                  className="w-full h-full border-0"
                  title={`Preview of ${page.page_name}`}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="border-b border-border px-4 py-3 bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{page.file_path}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div 
                className="overflow-auto" 
                style={{ height: 'calc(100vh - 280px)' }}
              >
                {isEditing ? (
                  <Textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    className="w-full h-full font-mono text-sm border-0 rounded-none resize-none focus-visible:ring-0"
                    style={{ minHeight: 'calc(100vh - 280px)' }}
                  />
                ) : (
                  <pre className="p-6 text-sm font-mono text-foreground bg-muted/30">
                    <code>{page.source_code}</code>
                  </pre>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PageSourceViewer;
