import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Code, Eye, Copy, Check, ExternalLink, Edit, Save } from "lucide-react";
import logo from "@/assets/logo.svg";
import { toast } from "sonner";

const PageSourceViewer = () => {
  const { pageId } = useParams();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState<any>(null);
  const [editedSchema, setEditedSchema] = useState("");
  const [isEditingSchema, setIsEditingSchema] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data, error } = await supabase
          .from('page_management')
          .select('*')
          .eq('id', pageId)
          .single();

        if (error) {
          console.error('Error fetching page:', error);
          toast.error('Failed to load page data');
        } else {
          setPage(data);
          setEditedCode(data.source_code || '');
          
          // Fetch SEO settings for this page
          const { data: seoData } = await supabase
            .from('page_seo_settings')
            .select('*')
            .eq('page_route', data.page_slug)
            .maybeSingle();
          
          if (seoData) {
            setSeoSettings(seoData);
            setEditedSchema(JSON.stringify(seoData.schema_json || {}, null, 2));
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('page_management')
        .update({ source_code: editedCode })
        .eq('id', pageId);

      if (error) {
        toast.error('Failed to save changes');
        console.error('Error saving:', error);
      } else {
        toast.success('Code saved successfully!');
        setIsEditing(false);
        setPage({ ...page, source_code: editedCode });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleSaveSchema = async () => {
    try {
      // Validate JSON
      const parsedSchema = JSON.parse(editedSchema);
      
      if (seoSettings) {
        // Update existing
        const { error } = await supabase
          .from('page_seo_settings')
          .update({ schema_json: parsedSchema })
          .eq('id', seoSettings.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('page_seo_settings')
          .insert({
            page_name: page.page_name,
            page_route: page.page_slug,
            schema_json: parsedSchema,
            is_active: true
          });

        if (error) throw error;
      }

      toast.success('Schema markup saved successfully!');
      setIsEditingSchema(false);
      setSeoSettings({ ...seoSettings, schema_json: parsedSchema });
    } catch (error: any) {
      console.error('Error saving schema:', error);
      if (error.message?.includes('JSON')) {
        toast.error('Invalid JSON format');
      } else {
        toast.error('Failed to save schema markup');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCopy = () => {
    const codeToCopy = isEditing ? editedCode : (page?.source_code || '');
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/sitemap">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sitemap
            </Button>
          </Link>
          <p className="mt-4">Page not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo" className="h-8" />
              <div className="h-8 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {page.page_name}
                </h1>
                <p className="text-sm text-muted-foreground">{page.page_slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="capitalize">
                {page.type}
              </Badge>
              {page.github_url && (
                <a href={page.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                </a>
              )}
              <Link to="/sitemap">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="schema">Schema Markup</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Eye className="w-5 h-5" />
                <p>Live preview will be available soon</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Source Code</h3>
              {!isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedCode(page.source_code || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[600px]">
                <pre className="text-sm">
                  <code>{page.source_code}</code>
                </pre>
              </div>
            ) : (
              <Textarea
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                className="font-mono text-sm min-h-[600px]"
              />
            )}
          </TabsContent>

          <TabsContent value="schema" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Schema Markup (JSON-LD)</h3>
              {!isEditingSchema ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingSchema(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(editedSchema);
                      toast.success('Schema copied to clipboard!');
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingSchema(false);
                      setEditedSchema(JSON.stringify(seoSettings?.schema_json || {}, null, 2));
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveSchema}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            {!isEditingSchema ? (
              <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[600px]">
                <pre className="text-sm">
                  <code>{editedSchema || '// No schema markup defined'}</code>
                </pre>
              </div>
            ) : (
              <Textarea
                value={editedSchema}
                onChange={(e) => setEditedSchema(e.target.value)}
                className="font-mono text-sm min-h-[600px]"
                placeholder="Enter valid JSON-LD schema markup..."
              />
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Add structured data to help search engines understand your page content.</p>
              <p>Common schema types: Organization, Product, Article, BreadcrumbList, FAQ</p>
              <a 
                href="https://schema.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Learn more about Schema.org
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PageSourceViewer;
