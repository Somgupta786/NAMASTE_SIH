import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Target,
  Activity,
  Brain,
  Zap
} from 'lucide-react';
import { TerminologyConcept } from '@/types/terminology';
import { namasteTerms, icd11Terms } from '@/data/dummyData';

interface SearchAutocompleteProps {
  onSelect: (concept: TerminologyConcept) => void;
  selectedSystems: string[];
  placeholder?: string;
}

interface SearchResult extends TerminologyConcept {
  confidence: number;
  matchType: 'exact' | 'fuzzy' | 'synonym' | 'semantic';
  highlightedDisplay: string;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSelect,
  selectedSystems,
  placeholder = "Search for medical conditions, symptoms, or traditional terms..."
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const allTerms = [...namasteTerms, ...icd11Terms];

  // Advanced search algorithm with fuzzy matching and semantic scoring
  const searchTerms = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const queryTerms = normalizedQuery.split(/\s+/);
    
    const scoredResults: SearchResult[] = [];

    allTerms.forEach(term => {
      // Filter by selected systems
      const isNamaste = term.system.includes('namaste');
      const isIcd11 = term.system.includes('icd');
      
      if (selectedSystems.length > 0) {
        if (!selectedSystems.some(sys => 
          (sys === 'namaste' && isNamaste) || 
          (sys === 'icd11' && isIcd11) ||
          sys === 'all'
        )) {
          return;
        }
      }

      let maxScore = 0;
      let matchType: SearchResult['matchType'] = 'semantic';
      let highlightedDisplay = term.display;

      // Exact match (highest priority)
      if (term.display.toLowerCase().includes(normalizedQuery)) {
        maxScore = Math.max(maxScore, 1.0);
        matchType = 'exact';
        highlightedDisplay = highlightMatch(term.display, normalizedQuery);
      }

      // Definition match
      if (term.definition?.toLowerCase().includes(normalizedQuery)) {
        maxScore = Math.max(maxScore, 0.85);
        if (matchType === 'semantic') matchType = 'fuzzy';
      }

      // Synonym match
      term.synonyms.forEach(synonym => {
        if (synonym.toLowerCase().includes(normalizedQuery)) {
          maxScore = Math.max(maxScore, 0.9);
          matchType = 'synonym';
        }
      });

      // Multi-term semantic matching
      queryTerms.forEach(queryTerm => {
        if (queryTerm.length < 2) return;
        
        // Fuzzy matching with edit distance
        const fuzzyScore = calculateFuzzyScore(queryTerm, term.display.toLowerCase());
        if (fuzzyScore > 0.6) {
          maxScore = Math.max(maxScore, fuzzyScore * 0.8);
          if (matchType === 'semantic') matchType = 'fuzzy';
        }

        // Check properties for semantic relevance
        term.properties?.forEach(prop => {
          if (prop.valueString?.toLowerCase().includes(queryTerm)) {
            maxScore = Math.max(maxScore, 0.7);
          }
        });
      });

      if (maxScore > 0.5) {
        scoredResults.push({
          ...term,
          confidence: Math.min(maxScore, 1.0),
          matchType,
          highlightedDisplay
        });
      }
    });

    // Sort by confidence score and relevance
    return scoredResults
      .sort((a, b) => {
        // Prioritize exact matches
        if (a.matchType === 'exact' && b.matchType !== 'exact') return -1;
        if (b.matchType === 'exact' && a.matchType !== 'exact') return 1;
        
        // Then by confidence
        if (Math.abs(a.confidence - b.confidence) > 0.05) {
          return b.confidence - a.confidence;
        }
        
        // Finally by system preference (NAMASTE first)
        const aIsNamaste = a.system.includes('namaste');
        const bIsNamaste = b.system.includes('namaste');
        if (aIsNamaste && !bIsNamaste) return -1;
        if (bIsNamaste && !aIsNamaste) return 1;
        
        return 0;
      })
      .slice(0, 8);
  };

  const highlightMatch = (text: string, query: string): string => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const calculateFuzzyScore = (query: string, target: string): number => {
    if (query === target) return 1.0;
    if (target.includes(query)) return 0.9;
    
    // Simple edit distance approximation
    const longer = query.length > target.length ? query : target;
    const shorter = query.length > target.length ? target : query;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const searchResults = searchTerms(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query, selectedSystems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (concept: SearchResult) => {
    onSelect(concept);
    setQuery(concept.display);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getMatchIcon = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact': return <Target className="h-3 w-3 text-green-500" />;
      case 'synonym': return <Sparkles className="h-3 w-3 text-yellow-500" />;
      case 'fuzzy': return <Brain className="h-3 w-3 text-blue-500" />;
      case 'semantic': return <Activity className="h-3 w-3 text-purple-500" />;
      default: return <Search className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getSystemBadge = (system: string) => {
    if (system.includes('namaste')) {
      return <Badge variant="secondary" className="text-xs bg-gradient-primary text-white border-0">NAMASTE</Badge>;
    }
    if (system.includes('tm2')) {
      return <Badge variant="outline" className="text-xs border-primary text-primary">TM2</Badge>;
    }
    if (system.includes('mms')) {
      return <Badge variant="outline" className="text-xs border-blue-500 text-blue-500">MMS</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Unknown</Badge>;
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(results.length > 0)}
          placeholder={placeholder}
          className="pl-10 h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Zap className="h-4 w-4 animate-pulse text-primary" />
          </div>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-elegant animate-fade-in max-h-96 overflow-hidden">
          <CardContent className="p-0">
            <div ref={resultsRef} className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={`${result.system}-${result.code}`}
                  className={`p-4 cursor-pointer transition-all duration-200 border-b last:border-b-0 ${
                    index === selectedIndex 
                      ? 'bg-accent/50 border-l-4 border-l-primary' 
                      : 'hover:bg-accent/30'
                  }`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getMatchIcon(result.matchType)}
                        <h4 
                          className="font-medium text-sm"
                          dangerouslySetInnerHTML={{ 
                            __html: result.highlightedDisplay 
                          }}
                        />
                        {getSystemBadge(result.system)}
                      </div>
                      
                      {result.definition && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {result.definition}
                        </p>
                      )}

                      {result.synonyms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {result.synonyms.slice(0, 3).map((synonym, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                              {synonym}
                            </Badge>
                          ))}
                          {result.synonyms.length > 3 && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              +{result.synonyms.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-right">
                        <div className="text-xs font-medium text-muted-foreground">
                          {Math.round(result.confidence * 100)}%
                        </div>
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-primary transition-all duration-500"
                            style={{ width: `${result.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{result.matchType} match</span>
                    <span>{result.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchAutocomplete;