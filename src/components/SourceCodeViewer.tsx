import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface SourceCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pageName: string;
  sourceCode: string;
  githubUrl: string | null;
}

const SourceCodeViewer = ({ isOpen, onClose, pageName, sourceCode, githubUrl }: SourceCodeViewerProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{pageName} - Source Code</span>
            <div className="flex gap-2">
              {githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(githubUrl, "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">{sourceCode}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SourceCodeViewer;
