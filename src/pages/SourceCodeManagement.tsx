import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Home, FileCode } from "lucide-react";
import logo from "@/assets/logo.svg";
import { supabase } from "@/integrations/supabase/client";

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

const SourceCodeManagement = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pages from database
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data, error } = await supabase
          .from("page_management")
          .select("*")
          .order("page_name");

        if (error) throw error;
        
        setPages(data || []);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const filteredPages = selectedType === "all" 
    ? pages 
    : pages.filter(page => page.type === selectedType);

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
              {filteredPages.length} Total Pages
            </span>
          </div>
          <p className="text-muted-foreground">
            View and edit source code for all pages in the website
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
            {loading ? (
              <div className="text-center py-12">
                <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                <p className="text-muted-foreground">Loading pages...</p>
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <FileCode className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pages found</p>
              </div>
            ) : (
              filteredPages.map((page) => (
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
                      asChild
                    >
                      <Link to={`/source-code/${page.id}`}>
                        <Code className="w-4 h-4" />
                        View Source
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceCodeManagement;
