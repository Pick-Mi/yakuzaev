import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomMetadataSectionProps {
  metadata: Record<string, any>;
}

const CustomMetadataSection = ({ metadata }: CustomMetadataSectionProps) => {
  // Don't render if metadata is empty
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }

  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2 pl-4">
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}: </span>
              <span className="text-muted-foreground">{String(val)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-muted-foreground">{String(value)}</span>;
  };

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Additional Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(metadata).map(([key, value]) => (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg capitalize">
                  {key.replace(/_/g, ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderValue(value)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomMetadataSection;
