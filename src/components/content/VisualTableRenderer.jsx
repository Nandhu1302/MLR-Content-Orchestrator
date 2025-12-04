import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function VisualTableRenderer({ visualData, title, compact = false, className = '' }) {
  // Handle various data formats
  const tableData = visualData?.table_data || visualData;
  
  const headers = tableData?.headers || tableData?.columns || [];
  const rows = tableData?.rows || tableData?.data || [];
  const footnotes = tableData?.footnotes || [];
  const description = tableData?.description || '';

  // If no valid data, show placeholder
  if (!headers?.length && !rows?.length) {
    return (
      <div className={`flex items-center justify-center p-4 bg-muted/30 rounded-lg ${className}`}>
        <span className="text-sm text-muted-foreground">No table data available</span>
      </div>
    );
  }

  // Compact mode for card previews
  if (compact) {
    const displayRows = rows.slice(0, 3);
    const displayHeaders = headers.slice(0, 4);
    
    return (
      <div className={`text-xs overflow-hidden ${className}`}>
        <ScrollArea className="w-full">
          <table className="w-full border-collapse">
            {displayHeaders.length > 0 && (
              <thead>
                <tr className="bg-muted/50">
                  {displayHeaders.map((header, i) => (
                    <th 
                      key={i} 
                      className="px-2 py-1 text-left font-medium text-muted-foreground border-b border-border truncate max-w-[80px]"
                    >
                      {header}
                    </th>
                  ))}
                  {headers.length > 4 && (
                    <th className="px-2 py-1 text-muted-foreground border-b border-border">...</th>
                  )}
                </tr>
              </thead>
            )}
            <tbody>
              {displayRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border/50 last:border-0">
                  {row.slice(0, 4).map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="px-2 py-1 truncate max-w-[80px]"
                    >
                      {cell}
                    </td>
                  ))}
                  {row.length > 4 && (
                    <td className="px-2 py-1 text-muted-foreground">...</td>
                  )}
                </tr>
              ))}
              {rows.length > 3 && (
                <tr>
                  <td colSpan={Math.min(headers.length, 5)} className="px-2 py-1 text-center text-muted-foreground">
                    +{rows.length - 3} more rows
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  // Full table rendering
  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <h4 className="font-medium text-sm">{title}</h4>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <ScrollArea className="w-full rounded-md border">
        <Table>
          {headers.length > 0 && (
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="whitespace-nowrap">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {footnotes && footnotes.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          {footnotes.map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </div>
      )}
    </div>
  );
}