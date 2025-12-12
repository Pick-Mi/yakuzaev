import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.svg";
import { supabase } from "@/integrations/supabase/client";

interface CustomPage {
  id: string;
  page_name: string;
  page_slug: string;
}

interface SocialLink {
  id: string;
  platform_name: string;
  url: string;
  icon_url: string | null;
  display_order: number;
}

const Footer = () => {
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchCustomPages = async () => {
      const { data } = await supabase
        .from('page_management')
        .select('id, page_name, page_slug')
        .eq('is_active', true)
        .order('page_name');
      
      if (data) setCustomPages(data);
    };

    const fetchSocialLinks = async () => {
      const { data } = await supabase
        .from('social_media_links')
        .select('id, platform_name, url, icon_url, display_order')
        .eq('is_active', true)
        .order('display_order');
      
      if (data) setSocialLinks(data);
    };

    fetchCustomPages();
    fetchSocialLinks();
  }, []);

  return (
    <footer className="bg-black text-white relative w-full py-14">
      <div className="container mx-auto max-w-[1280px]">
        {/* Logo */}
        <div className="mb-16">
          <img src={logo} alt="Yakuza" className="h-8" />
        </div>

        {/* Navigation and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          {/* Navigation Links - 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-16 flex-1">
            {/* Column 1 */}
            <div className="flex flex-col gap-5">
              <Link to="/products" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Product
              </Link>
              <Link to="/about-us" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                About Us
              </Link>
              <Link to="/careers" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Careers
              </Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-5">
              <Link to="/become-dealer" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Become a Dealers
              </Link>
              <Link to="/blogs" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Blogs
              </Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-5">
              <Link to="/profile" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Account
              </Link>
              <Link to="/cart" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Cart
              </Link>
              <Link to="/contact-us" className="text-base opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Contact Us
              </Link>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-8 items-center">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                {link.icon_url ? (
                  <img
                    src={link.icon_url}
                    alt={link.platform_name}
                    className="w-7 h-7 object-contain"
                  />
                ) : (
                  <span className="w-7 h-7 bg-white/20 rounded-full" />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Copyright © 2025 yakuza. All Rights Reserved.
          </p>

          {/* Privacy Links - Dynamic Custom Pages */}
          <div className="flex gap-4 text-xs flex-wrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {customPages.map((page) => (
              <Link key={page.id} to={page.page_slug} className="hover:underline">
                {page.page_name}
              </Link>
            ))}
            <Link to="/sitemap" className="hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
