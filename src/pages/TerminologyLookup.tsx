import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Globe,
  Stethoscope,
  BookOpen,
  Target,
  Sparkles,
  ArrowRight,
  Database,
  Clock,
  Brain,
  Activity,
  TrendingUp
} from 'lucide-react';
import { namasteTerms, icd11Terms } from '@/data/dummyData';
import { TerminologyConcept } from '@/types/terminology';
import SearchAutocomplete from '@/components/SearchAutocomplete';

const TerminologyLookup = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<TerminologyConcept[]>([]);
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<TerminologyConcept | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const allTerms = [...namasteTerms, ...icd11Terms];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timeoutId = setTimeout(() => {
      const filtered = allTerms.filter(term => {
        const matchesQuery = 
          term.display.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.definition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.synonyms.some(synonym => synonym.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesSystem = selectedSystem === 'all' || 
          (selectedSystem === 'namaste' && term.system.includes('namaste')) ||
          (selectedSystem === 'icd11' && term.system.includes('icd'));

        return matchesQuery && matchesSystem;
      });

      // Add dummy confidence scores
      const resultsWithConfidence = filtered.map(term => ({
        ...term,
        confidence: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
      }));

      setFilteredResults(resultsWithConfidence);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSystem]);

  const getSystemBadge = (system: string) => {
    if (system.includes('namaste')) {
      return <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">NAMASTE</Badge>;
    }
    if (system.includes('tm2')) {
      return <Badge variant="outline" className="border-primary text-primary">ICD-11 TM2</Badge>;
    }
    if (system.includes('mms')) {
      return <Badge variant="outline" className="border-medical-blue text-medical-blue">ICD-11 MMS</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const handleConceptSelect = (concept: TerminologyConcept) => {
    setSelectedConcept(concept);
    setSearchQuery(concept.display);
    
    // Add to search history
    setSearchHistory(prev => {
      const updated = [concept.display, ...prev.filter(term => term !== concept.display)];
      return updated.slice(0, 10); // Keep last 10 searches
    });
  };

  const recentSearches = searchHistory.length > 0 ? searchHistory.slice(0, 4) : ['Fever', 'Diabetes', 'Cough', 'Heart Disease'];
  const popularTerms = ['Jwara', 'Prameha', 'Kasa', 'Shotha', 'Shirahshula', 'Udararoga'];

  const getSystemStats = () => {
    const namasteCount = filteredResults.filter(term => term.system.includes('namaste')).length;
    const icd11Count = filteredResults.filter(term => term.system.includes('icd')).length;
    return { namasteCount, icd11Count };
  };

  const stats = getSystemStats();

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold">
          <span className="text-gradient">Terminology</span> Lookup
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Search across NAMASTE and ICD-11 vocabularies with intelligent matching and synonym expansion.
        </p>
      </div>

      {/* Search Interface */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>Smart Search</span>
          </CardTitle>
          <CardDescription>
            Enter a condition, symptom, or traditional medicine term
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Advanced Search */}
          <SearchAutocomplete
            onSelect={handleConceptSelect}
            selectedSystems={selectedSystem === 'all' ? [] : [selectedSystem]}
            placeholder="Search for medical conditions, symptoms, or traditional terms..."
          />

          {/* System Filter */}
          <Tabs value={selectedSystem} onValueChange={setSelectedSystem}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>All Systems</span>
              </TabsTrigger>
              <TabsTrigger value="namaste" className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4" />
                <span>NAMASTE</span>
              </TabsTrigger>
              <TabsTrigger value="icd11" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>ICD-11</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Quick Actions */}
          {!searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Recent Searches</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(term)}
                      className="hover:bg-accent transition-colors"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Popular Terms</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTerms.map((term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(term)}
                      className="hover:bg-accent transition-colors"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {filteredResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                Search Results ({filteredResults.length})
              </h2>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-primary rounded-full"></div>
                  <span>NAMASTE: {stats.namasteCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>ICD-11: {stats.icd11Count}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredResults.map((term, index) => (
              <Card 
                key={`${term.system}-${term.code}`} 
                className="hover:shadow-card transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-gradient transition-colors">
                          {term.display}
                        </h3>
                        {getSystemBadge(term.system)}
                        <Badge variant="outline" className="text-xs">
                          {term.code}
                        </Badge>
                      </div>
                      
                      {term.definition && (
                        <p className="text-muted-foreground mb-3">
                          {term.definition}
                        </p>
                      )}

                      {term.synonyms.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-muted-foreground">Synonyms: </span>
                          <span className="text-sm">{term.synonyms.join(', ')}</span>
                        </div>
                      )}

                      {term.properties && term.properties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {term.properties.map((prop, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {prop.code}: {prop.valueString}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {term.confidence && (
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {Math.round(term.confidence * 100)}% match
                          </div>
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-primary transition-all duration-500"
                              style={{ width: `${term.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Database className="h-4 w-4" />
                        <span>{term.system.split('/').pop()}</span>
                      </span>
                      {term.category && (
                        <span className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>{term.category}</span>
                        </span>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" className="hover:bg-accent">
                      View Mappings
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchQuery && !isLoading && filteredResults.length === 0 && (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search terms or browse popular conditions above.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TerminologyLookup;