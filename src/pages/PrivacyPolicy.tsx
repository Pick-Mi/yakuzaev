import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      const {
        data,
        error
      } = await supabase.from("page_management").select("source_code, page_name").eq("page_slug", "/privacy-policy").eq("is_active", true).single();
      if (!error && data) {
        setContent(data.source_code);
      }
      setLoading(false);
    };
    fetchPrivacyPolicy();
  }, []);
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 py-0 px-0 mx-0">
        <div className="container mx-auto max-w-4xl py-12 px-0">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          {loading ? <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div> : <div className="prose prose-lg max-w-none
                [&_p]:text-foreground/80 [&_p]:leading-relaxed [&_p]:mb-4
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2
                [&_h4]:text-base [&_h4]:font-medium [&_h4]:text-foreground [&_h4]:mt-4 [&_h4]:mb-2
                [&_h5]:text-base [&_h5]:font-medium [&_h5]:text-foreground [&_h5]:mt-4 [&_h5]:mb-2
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                [&_li]:text-foreground/80 [&_li]:mb-2
                [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
                [&_.ql-align-justify]:text-justify
                [&_.ql-align-center]:text-center
                [&_.ql-align-right]:text-right
                [&_.ql-size-large]:text-xl [&_.ql-size-large]:font-semibold
                [&_.ql-size-huge]:text-2xl [&_.ql-size-huge]:font-bold
                [&_.ql-size-small]:text-sm
                [&_strong]:font-semibold [&_strong]:text-foreground" dangerouslySetInnerHTML={{
          __html: content
        }} />}
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default PrivacyPolicy;