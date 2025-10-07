import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronDown } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white relative w-full py-14 px-4 md:px-20">
      <div className="container mx-auto max-w-[1280px]">
        {/* Logo */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold">YAKUZA</h2>
        </div>

        {/* Navigation and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            {/* Ownership */}
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-semibold opacity-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Ownership
              </h3>
              <div className="flex flex-col gap-5">
                <Link to="/stores" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Yakuza Stores
                </Link>
                <Link to="/dealers" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Become a Dealers
                </Link>
              </div>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-semibold opacity-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Company
              </h3>
              <div className="flex flex-col gap-5">
                <Link to="/about" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  About Us
                </Link>
                <Link to="/careers" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Careers
                </Link>
                <Link to="/blogs" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Blogs
                </Link>
                <Link to="/contact" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Profile */}
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-semibold opacity-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Profile
              </h3>
              <div className="flex flex-col gap-5">
                <Link to="/auth" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Sign IN
                </Link>
                <Link to="/auth" className="text-[15px] opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-8 opacity-80">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Facebook className="w-[18px] h-[18px]" fill="white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Twitter className="w-[18px] h-[18px]" fill="white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Instagram className="w-[18px] h-[18px]" fill="white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Linkedin className="w-[18px] h-[18px]" fill="white" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <Youtube className="w-[18px] h-[18px]" fill="white" />
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
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/disclaimer" className="hover:underline">Site Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
