import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.svg";
import { Helmet } from "react-helmet";

const Footer = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Yakuza EV",
    "url": "https://yakuzaev.vercel.app",
    "logo": "https://yakuzaev.vercel.app/assets/logo.svg",
    "description": "Leading electric scooter manufacturer providing innovative and sustainable mobility solutions",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    },
    "sameAs": [
      "https://linkedin.com",
      "https://twitter.com",
      "https://youtube.com",
      "https://facebook.com",
      "https://instagram.com"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  };

  return (
    <footer className="bg-black text-white relative w-full py-14 px-4 md:px-20">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema, null, 2)}
        </script>
      </Helmet>
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
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Linkedin className="w-[28px] h-[28px]" strokeWidth={0} fill="white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <svg className="w-[28px] h-[28px]" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Youtube className="w-[32px] h-[32px]" strokeWidth={0} fill="white" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Facebook className="w-[28px] h-[28px]" strokeWidth={0} fill="white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Instagram className="w-[28px] h-[28px]" strokeWidth={0} fill="white" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Country Selector */}
          <div className="relative">
            <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded cursor-pointer hover:bg-white/15 transition-colors">
              <div className="w-6 h-5">
                <svg viewBox="0 0 25 19" fill="none">
                  <rect width="25" height="6.333" fill="#FF9933"/>
                  <rect y="6.333" width="25" height="6.333" fill="white"/>
                  <rect y="12.667" width="25" height="6.333" fill="#138808"/>
                  <circle cx="12.5" cy="9.5" r="3" fill="#000080"/>
                </svg>
              </div>
              <span className="text-sm" style={{ fontFamily: 'PingFang HK, sans-serif' }}>India</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Copyright © 2025 yakuza. All Rights Reserved.
          </p>

          {/* Privacy Links */}
          <div className="flex gap-4 text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Link to="/sitemap" className="hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
