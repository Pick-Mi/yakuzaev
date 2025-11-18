import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Home, FileCode } from "lucide-react";
import logo from "@/assets/logo.svg";
import SourceCodeViewer from "@/components/SourceCodeViewer";

interface PageData {
  id: string;
  page_name: string;
  page_slug: string;
  source_code: string;
  github_url: string | null;
  type: string;
  file_path: string;
  description: string;
}

// Static list of all website pages
const WEBSITE_PAGES: PageData[] = [
  { id: '1', page_name: 'Home / Landing', page_slug: '/', source_code: 'Main landing page with hero, product showcase, and blog sections', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Index.tsx', type: 'public', file_path: 'src/pages/Index.tsx', description: 'Main landing page' },
  { id: '2', page_name: 'Products Listing', page_slug: '/products', source_code: 'Product catalog page showing all available electric scooters', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Products.tsx', type: 'public', file_path: 'src/pages/Products.tsx', description: 'Product listing page' },
  { id: '3', page_name: 'Product Detail', page_slug: '/products/:slug', source_code: 'Individual product detail page with specifications and pricing', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Product.tsx', type: 'public', file_path: 'src/pages/Product.tsx', description: 'Product detail page' },
  { id: '4', page_name: 'Product Configuration', page_slug: '/product-config', source_code: 'Product customization and configuration page', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/ProductConfig.tsx', type: 'public', file_path: 'src/pages/ProductConfig.tsx', description: 'Product configuration' },
  { id: '5', page_name: 'Blogs Listing', page_slug: '/blogs', source_code: 'Blog posts listing page with all published articles', github_url: 'https://github.com/yakuza-ev/website/blob/main/src/pages/Blogs.tsx', type: 'public', file_path: 'src/pages/Blogs.tsx', description: 'Blogs listing' },
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

const SourceCodeManagement = () => {
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const pages = WEBSITE_PAGES;

  const handleViewSource = (page: PageData) => {
    setSelectedPage(page);
    setViewerOpen(true);
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-60 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <img src={logo} alt="Yakuza Logo" className="h-10" />
        </div>

        {/* Menu Label */}
        <div className="px-4 py-3 text-sm text-muted-foreground">
          Source Code
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
            <FileCode className="w-5 h-5" />
            <span className="font-medium">Page Management</span>
          </button>
        </nav>

        {/* Back to Home */}
        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

        {/* Main Content */}
        <div className="ml-60 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold">Page Management</h1>
              <span className="text-lg text-muted-foreground">
                {pages.length} Total Pages
              </span>
            </div>
            <p className="text-muted-foreground">
              View source code for all pages in the website
            </p>
          </div>

        {/* Pages List */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Website Pages
            </h2>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2fr,1.5fr,2fr,2fr,1fr,1fr] gap-4 px-6 py-4 border-b border-border bg-muted/50 text-sm font-medium text-muted-foreground">
            <div>Page Name</div>
            <div>Route</div>
            <div>File Path</div>
            <div>Description</div>
            <div>Type</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {pages.map((page) => (
              <div
                key={page.id}
                className="grid grid-cols-[2fr,1.5fr,2fr,2fr,1fr,1fr] gap-4 px-6 py-4 items-center hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium">{page.page_name}</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {page.page_slug}
                </div>
                <div className="text-sm text-muted-foreground font-mono truncate">
                  {page.file_path}
                </div>
                <div className="text-sm text-muted-foreground">
                  {page.description}
                </div>
                <div>
                  <Badge
                    variant={page.type === "auth" ? "secondary" : "outline"}
                    className="rounded-full"
                  >
                    {page.type}
                  </Badge>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleViewSource(page)}
                  >
                    <Code className="w-4 h-4" />
                    View Source
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Code Viewer Dialog */}
      {selectedPage && (
        <SourceCodeViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedPage(null);
          }}
          pageName={selectedPage.page_name}
          sourceCode={selectedPage.source_code}
          githubUrl={selectedPage.github_url}
        />
      )}
    </div>
  );
};

export default SourceCodeManagement;
