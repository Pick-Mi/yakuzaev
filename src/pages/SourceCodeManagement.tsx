import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, LogOut, FileCode } from "lucide-react";
import logo from "@/assets/logo.svg";

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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || !data || (data.role !== "admin" && data.role !== "manager")) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchPages();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("site_page_management")
        .select("*")
        .order("page_slug", { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getPageType = (metadata: any) => {
    if (!metadata) return "public";
    if (metadata.route?.includes("/admin")) return "admin";
    if (metadata.route?.includes("/auth")) return "auth";
    return "public";
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-60 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <img src={logo} alt="Yakuza Logo" className="h-10" />
        </div>

        {/* Admin Panel Label */}
        <div className="px-4 py-3 text-sm text-muted-foreground">
          Admin Panel
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
            <FileCode className="w-5 h-5" />
            <span className="font-medium">Page Management</span>
          </button>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
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
            {pages.map((page) => {
              const pageType = getPageType(page.metadata);
              const description = page.metadata?.description || "No description";
              const filePath = page.source_code.match(/\/\/ File: (.+)/)?.[1] || 
                              `src/pages/${page.page_name.replace(/\s+/g, '')}.tsx`;

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
                      onClick={() => {
                        // View source code logic
                        console.log(page.source_code);
                      }}
                    >
                      <Code className="w-4 h-4" />
                      View Source
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceCodeManagement;
