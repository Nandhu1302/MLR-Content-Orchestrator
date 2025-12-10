import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { SafetyStatementDetailsModal } from './SafetyStatementDetailsModal';

export const SafetyStatementsTab = ({ safetyStatements }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statementTypeFilter, setStatementTypeFilter] = useState('all');
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStatements = safetyStatements.filter(statement => {
    const matchesSearch = statement.statement_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || statement.severity === severityFilter;
    const matchesType = statementTypeFilter === 'all' || statement.statement_type === statementTypeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const severityLevels = [...new Set(safetyStatements.map(s => s.severity))];
  const statementTypes = [...new Set(safetyStatements.map(s => s.statement_type))];

  const getSeverityIcon = (severity) => {
    switch (String(severity).toLowerCase()) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (String(severity).toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search safety statements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {severityLevels.map(severity => (
              <SelectItem key={severity} value={severity}>{severity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statementTypeFilter} onValueChange={setStatementTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Statement Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {statementTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredStatements.length} of {safetyStatements.length} safety statements
      </div>

      {/* Safety Statements List */}
      <div className="grid gap-4">
        {filteredStatements.map((statement) => (
          <Card 
            key={statement.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedStatement(statement);
              setIsModalOpen(true);
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityIcon(statement.severity)}
                    <Badge variant="outline">{statement.statement_type}</Badge>
                    <Badge className={getSeverityColor(statement.severity)} variant="outline">
                      {statement.severity} severity
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-relaxed">
                    {statement.statement_text}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statement.required_context && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Required Context:</p>
                    <p className="text-sm">{statement.required_context}</p>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                {statement.source_section && (
                  <div>
                    <span className="text-muted-foreground">Source Section:</span>
                    <p className="font-medium">{statement.source_section}</p>
                  </div>
                )}
                {statement.source_page && (
                  <div>
                    <span className="text-muted-foreground">Source Page:</span>
                    <p className="font-medium">Page {statement.source_page}</p>
                  </div>
                )}
              </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStatements.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No safety statements found matching your filters</p>
        </div>
      )}

      {/* Safety Statement Details Modal */}
      <SafetyStatementDetailsModal
        statement={selectedStatement}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStatement(null);
        }}
      />
    </div>
  );
};
