-- Seed data for site_page_management table
-- Run this in Supabase SQL Editor to populate page source codes

-- Home Page
INSERT INTO site_page_management (page_name, page_slug, source_code, github_url, is_active, metadata) VALUES 
('Home Page', '/', 
'import Header from "@/components/Header";
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

export default Index;', 
'https://github.com/yakuza-ev/website/blob/main/src/pages/Index.tsx', 
true, 
'{"description": "Main landing page with hero, products, and blog sections", "components": ["Header", "Hero", "ProductShowcase", "FearlessDesign", "PromoSection", "BlogSection", "Footer"], "route": "/"}'::jsonb);

-- Products Page
INSERT INTO site_page_management (page_name, page_slug, source_code, github_url, is_active, metadata) VALUES 
('Products Page', '/products', 
'import Header from "@/components/Header";
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

export default Products;', 
'https://github.com/yakuza-ev/website/blob/main/src/pages/Products.tsx', 
true, 
'{"description": "Product listing page with grid layout", "components": ["Header", "Hero", "ProductsGrid", "Footer"], "route": "/products"}'::jsonb);

-- Blogs Page
INSERT INTO site_page_management (page_name, page_slug, source_code, github_url, is_active, metadata) VALUES 
('Blogs Page', '/blogs', 
'import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogHero from "@/components/BlogHero";
import { supabase } from "@/integrations/supabase/client";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, featured_image, published_at, slug")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setBlogs(data || []);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BlogHero />
      <main className="w-full py-[60px] px-[70px]">
        <h1 className="font-medium text-[48px] mb-[50px]">All Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
          {blogs.map((blog) => (
            <Link key={blog.id} to={`/blogs/${blog.slug}`}>
              <img src={blog.featured_image} alt={blog.title}/>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;', 
'https://github.com/yakuza-ev/website/blob/main/src/pages/Blogs.tsx', 
true, 
'{"description": "Blog listing page with Supabase integration", "components": ["Header", "BlogHero", "Footer"], "database_tables": ["blog_posts"], "route": "/blogs"}'::jsonb);

-- About Us Page
INSERT INTO site_page_management (page_name, page_slug, source_code, github_url, is_active, metadata) VALUES 
('About Us Page', '/about-us', 
'import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";
import { Zap, Target, Eye, Heart, Users, Award } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative w-full min-h-screen bg-black">
          <h1>About YakuzaEV</h1>
          <p>Driving India towards a sustainable, electric future</p>
        </section>
        {/* Additional sections */}
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;', 
'https://github.com/yakuza-ev/website/blob/main/src/pages/AboutUs.tsx', 
true, 
'{"description": "Company about page with mission, vision and team information", "components": ["Header", "Footer", "BlogSection"], "route": "/about-us"}'::jsonb);
