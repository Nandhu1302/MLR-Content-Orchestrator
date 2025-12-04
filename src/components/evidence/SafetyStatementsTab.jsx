
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const SafetyStatementsTab = ({ safetyStatements }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statementTypeFilter, setStatementTypeFilter] = useState('all');

  const filteredStatements = safetyStatements.filter((statement) => {
    const matchesSearch = statement.statement_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || statement.severity === severityFilter;
    const matchesType = statementTypeFilter === 'all' || statement.statement_type === statementTypeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const severityLevels = [...new Set(safetyStatements.map((s) => s.severity))];
  const statementTypes = [...new Set(safetyStatements.map((s) => s.statement_type))];

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
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
      <div className="flex gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search safety statements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {severityLevels.map((severity) => (
              <SelectItem key={severity} value={severity}>
                {severity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statementTypeFilter} onValueChange={(value) => setStatementTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {statementTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredStatements.length} of {safetyStatements.length} safety statements
      </div>

      {/* Safety Statements List */}
      <div className="space-y-4">
        {filteredStatements.map((statement) => (
          <Card key={statement.id} className="border rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getSeverityIcon(statement.severity)}
                {statement.statement_type} - {statement.severity} severity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{statement.statement_text}</p>
              {statement.required_context && (
                <p>
                  <strong>Required Context:</strong> {statement.required_context}
                </p>
              )}
              {statement.source_section && (
                <p>
                  <strong>Source Section:</strong> {statement.source_section}
                </p>
              )}
              {statement.source_page && (
                <p>
                  <strong>Source Page:</strong> Page {statement.source_page}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredStatements.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No safety statements found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};
