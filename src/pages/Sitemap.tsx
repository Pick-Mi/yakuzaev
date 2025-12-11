import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface CustomPage {
  id: string;
  page_name: string;
  page_slug: string;
  is_active: boolean;
}

const Sitemap = () => {
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);

  useEffect(() => {
    const fetchCustomPages = async () => {
      const { data } = await supabase
        .from('page_management')
        .select('id, page_name, page_slug, is_active')
        .eq('is_active', true)
        .order('page_name');
      
      if (data) setCustomPages(data);
    };
    fetchCustomPages();
  }, []);

  const sitePages = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "About Us", path: "/about-us" },
        { name: "Become a Dealer", path: "/become-dealer" },
        { name: "Blogs", path: "/blogs" },
      ]
    },
    {
      title: "Account",
      links: [
        { name: "Login / Sign Up", path: "/auth" },
        { name: "Profile", path: "/profile" },
        { name: "Cart", path: "/cart" },
        { name: "Orders", path: "/orders" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Site Disclaimer", path: "/disclaimer" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-24 max-w-[1200px]">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">Sitemap</h1>
          <p className="text-lg text-muted-foreground">
            Navigate through all pages on our website
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sitePages.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-2xl font-semibold border-b pb-3">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      to={link.path}
                      className="text-lg hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Dynamic Custom Pages Section */}
          {customPages.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold border-b pb-3">
                Other Pages
              </h2>
              <ul className="space-y-3">
                {customPages.map((page) => (
                  <li key={page.id}>
                    <Link 
                      to={page.page_slug}
                      className="text-lg hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {page.page_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
