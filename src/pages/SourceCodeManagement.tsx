import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Home, FileCode } from "lucide-react";
import logo from "@/assets/logo.svg";
import SourceCodeViewer from "@/components/SourceCodeViewer";
import { toast } from "@/hooks/use-toast";

interface PageData {
  id: string;
  page_name: string;
  page_slug: string;
  source_code: string;
  github_url: string | null;
  is_active: boolean;
  metadata: any;
}

const SourceCodeManagement = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("site_page_management")
        .select("*")
        .order("page_slug", { ascending: true });

      if (error) throw error;
      setPages(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "No Pages Found",
          description: "The page management table is empty. Please run the seed SQL to populate it.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pages. Please check your permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSource = (page: PageData) => {
    setSelectedPage(page);
    setViewerOpen(true);
  };


  const getPageType = (metadata: any) => {
    if (!metadata) return "public";
    if (metadata.route?.includes("/admin")) return "admin";
    if (metadata.route?.includes("/auth")) return "auth";
    return "public";
  };

  const getFilePath = (page: PageData) => {
    if (page.metadata?.file_path) return page.metadata.file_path;
    return `src/pages/${page.page_name.replace(/\s+/g, '')}.tsx`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Code className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
            View and manage all pages in the website
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
            {pages.length === 0 ? (
              <div className="px-6 py-12 text-center text-muted-foreground">
                <FileCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Pages Found</p>
                <p className="text-sm">The page management table is empty. Please run the seed SQL to populate it.</p>
              </div>
            ) : (
              pages.map((page) => {
                const pageType = getPageType(page.metadata);
                const description = page.metadata?.description || "No description";
                const filePath = getFilePath(page);

                return (
                  <div
                    key={page.id}
                    className="grid grid-cols-[2fr,1.5fr,2fr,2fr,1fr,1fr] gap-4 px-6 py-4 items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">{page.page_name}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {page.page_slug}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono truncate">
                      {filePath}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {description}
                    </div>
                    <div>
                      <Badge
                        variant={
                          pageType === "admin"
                            ? "default"
                            : pageType === "auth"
                            ? "secondary"
                            : "outline"
                        }
                        className="rounded-full"
                      >
                        {pageType}
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
                );
              })
            )}
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
