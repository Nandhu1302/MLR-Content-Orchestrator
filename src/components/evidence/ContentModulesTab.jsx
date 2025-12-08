import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ContentModuleDetailsModal } from './ContentModuleDetailsModal';

export function ContentModulesTab({ modules }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [lengthFilter, setLengthFilter] = useState('all');
  const [toneFilter, setToneFilter] = useState('all');
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.module_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.module_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || module.module_type.includes(typeFilter);
    const matchesLength = lengthFilter === 'all' || module.length_variant === lengthFilter;
    const matchesTone = toneFilter === 'all' || module.tone_variant === toneFilter;

    return matchesSearch && matchesType && matchesLength && matchesTone;
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Module copied to clipboard');
  };

  const getModuleTypeColor = (type) => {
    if (type.includes('headline')) return 'bg-primary/10 text-primary';
    if (type.includes('efficacy')) return 'bg-green-500/10 text-green-700 dark:text-green-400';
    if (type.includes('safety')) return 'bg-red-500/10 text-red-700 dark:text-red-400';
    if (type.includes('mechanism')) return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    if (type.includes('dosing')) return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
    if (type.includes('indication')) return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
    return 'bg-muted text-muted-foreground';
  };

  const getLengthBadgeColor = (length) => {
    if (!length) return 'bg-muted';
    if (length === 'brief') return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    if (length === 'short') return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    if (length === 'medium') return 'bg-green-500/10 text-green-700 dark:text-green-400';
    if (length === 'long') return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
    return 'bg-muted';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Content Modules
          </CardTitle>
          <CardDescription>
            Filter by module type, length, and tone to find the perfect content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Module Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="headline">Headlines</SelectItem>
                <SelectItem value="efficacy">Efficacy</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="mechanism">Mechanism</SelectItem>
                <SelectItem value="dosing">Dosing</SelectItem>
                <SelectItem value="indication">Indication</SelectItem>
              </SelectContent>
            </Select>

            <Select value={lengthFilter} onValueChange={setLengthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lengths</SelectItem>
                <SelectItem value="brief">Brief (≤50 chars)</SelectItem>
                <SelectItem value="short">Short (≤100 chars)</SelectItem>
                <SelectItem value="medium">Medium (≤250 chars)</SelectItem>
                <SelectItem value="long">Long (500+ chars)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={toneFilter} onValueChange={setToneFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tones</SelectItem>
                <SelectItem value="clinical">Clinical</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="patient_friendly">Patient Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredModules.length} of {modules.length} modules
          </p>
        </div>

        {filteredModules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No modules found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
        {filteredModules.map((module) => (
          <Card 
            key={module.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedModule(module);
              setIsModalOpen(true);
            }}
          >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getModuleTypeColor(module.module_type)}>
                            {module.module_type.replace(/_/g, ' ')}
                          </Badge>
                          {module.length_variant && (
                            <Badge variant="outline" className={getLengthBadgeColor(module.length_variant)}>
                              {module.length_variant}
                            </Badge>
                          )}
                          {module.tone_variant && (
                            <Badge variant="outline">
                              {module.tone_variant}
                            </Badge>
                          )}
                          {module.mlr_approved && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              MLR Approved
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(module.module_text)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <p className="text-foreground leading-relaxed">
                        {module.module_text}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                        <span>{module.module_text.length} characters</span>
                        {module.character_limit_max && (
                          <span>Max: {module.character_limit_max} chars</span>
                        )}
                        {module.linked_claims.length > 0 && (
                          <span>{module.linked_claims.length} linked claim(s)</span>
                        )}
                        {module.linked_references.length > 0 && (
                          <span>{module.linked_references.length} reference(s)</span>
                        )}
                        {module.usage_score > 0 && (
                          <span className="text-green-600 dark:text-green-400">
                            Usage Score: {(module.usage_score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Module Details Modal */}
      <ContentModuleDetailsModal
        module={selectedModule}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModule(null);
        }}
      />
    </div>
  );
}