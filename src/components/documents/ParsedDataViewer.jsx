import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckCircle2 } from "lucide-react";

export const ParsedDataViewer = ({ parsedData, documentTitle }) => {
  if (!parsedData || Object.keys(parsedData).length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Parsed Data</h3>
        <p className="text-sm text-muted-foreground">
          This document hasn't been parsed yet or contains no extractable content.
        </p>
      </div>
    );
  }

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic">Not available</span>;
    }

    if (typeof value === 'boolean') {
      return value ? (
        <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      );
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-muted-foreground italic">None</span>;
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, idx) => (
            <li key={idx} className="text-sm">
              {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-3 pl-4 border-l-2 border-muted">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <h5 className="font-medium text-sm capitalize mb-1">
                {subKey.replace(/_/g, ' ')}
              </h5>
              {renderValue(subValue)}
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-wrap">{String(value)}</p>;
  };

  const sections = Object.entries(parsedData).filter(([_, value]) => 
    value !== null && value !== undefined && value !== ''
  );

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{documentTitle}</h2>
        <p className="text-sm text-muted-foreground">
          Extracted {sections.length} section{sections.length !== 1 ? 's' : ''} from document
        </p>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {sections.map(([key, value], index) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-lg capitalize flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {key.replace(/_/g, ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderValue(value)}
              </CardContent>
              {index < sections.length - 1 && <Separator className="mt-4" />}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};