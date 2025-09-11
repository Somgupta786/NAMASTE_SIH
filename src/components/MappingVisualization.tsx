import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  GitBranch, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Zap,
  Brain,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { TerminologyConcept, MappingCandidate } from '@/types/terminology';
import { mappingDatabase } from '@/data/dummyData';

interface MappingVisualizationProps {
  sourceCode: TerminologyConcept;
  onAcceptMapping: (mapping: MappingCandidate) => void;
  onRejectMapping: (mapping: MappingCandidate) => void;
}

const MappingVisualization: React.FC<MappingVisualizationProps> = ({
  sourceCode,
  onAcceptMapping,
  onRejectMapping
}) => {
  const [mappings, setMappings] = useState<MappingCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<MappingCandidate | null>(null);

  useEffect(() => {
    if (sourceCode) {
      setIsLoading(true);
      // Simulate API call for advanced mapping
      setTimeout(() => {
        const existingMappings = mappingDatabase[sourceCode.code] || [];
        
        // Generate additional AI-powered mappings
        const enhancedMappings = [
          ...existingMappings,
          ...generateAIMappings(sourceCode)
        ];

        setMappings(enhancedMappings);
        setIsLoading(false);
      }, 1000);
    }
  }, [sourceCode]);

  const generateAIMappings = (concept: TerminologyConcept): MappingCandidate[] => {
    // Simulate AI-generated mappings based on semantic analysis
    const aiMappings: MappingCandidate[] = [];
    
    // Add semantic variations
    if (concept.synonyms.length > 0) {
      concept.synonyms.forEach((synonym, index) => {
        if (index < 2) { // Limit to 2 AI suggestions
          aiMappings.push({
            targetCode: `AI-GEN-${Math.random().toString(36).substr(2, 6)}`,
            targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
            targetDisplay: `${synonym} - AI Enhanced`,
            confidence: 0.65 + Math.random() * 0.2,
            equivalence: "related",
            method: "ai-semantic"
          });
        }
      });
    }

    return aiMappings;
  };

  const getEquivalenceColor = (equivalence: string) => {
    switch (equivalence) {
      case 'equivalent': return 'text-green-600 bg-green-50 border-green-200';
      case 'broader': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'narrower': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'related': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEquivalenceIcon = (equivalence: string) => {
    switch (equivalence) {
      case 'equivalent': return <CheckCircle2 className="h-4 w-4" />;
      case 'broader': return <ArrowRight className="h-4 w-4 rotate-45" />;
      case 'narrower': return <ArrowRight className="h-4 w-4 -rotate-45" />;
      case 'related': return <GitBranch className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    if (method.includes('ai')) return <Brain className="h-4 w-4 text-purple-500" />;
    if (method.includes('semantic')) return <Sparkles className="h-4 w-4 text-yellow-500" />;
    if (method.includes('lexical')) return <Target className="h-4 w-4 text-green-500" />;
    return <Zap className="h-4 w-4 text-blue-500" />;
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.9) return { label: 'Very High', color: 'text-green-600' };
    if (confidence >= 0.8) return { label: 'High', color: 'text-blue-600' };
    if (confidence >= 0.7) return { label: 'Medium', color: 'text-yellow-600' };
    if (confidence >= 0.6) return { label: 'Low', color: 'text-orange-600' };
    return { label: 'Very Low', color: 'text-red-600' };
  };

  if (!sourceCode) {
    return (
      <Card className="h-96 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <GitBranch className="h-12 w-12 mx-auto opacity-50" />
          <p>Select a terminology concept to view mappings</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Source Concept Display */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Source Concept</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gradient">{sourceCode.display}</h3>
              <Badge variant="secondary" className="bg-gradient-primary text-white border-0">
                {sourceCode.code}
              </Badge>
            </div>
            
            {sourceCode.definition && (
              <p className="text-muted-foreground">{sourceCode.definition}</p>
            )}

            {sourceCode.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground">Synonyms:</span>
                {sourceCode.synonyms.map((synonym, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {synonym}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mapping Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <span>Mapping Candidates</span>
              {mappings.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {mappings.length} found
                </Badge>
              )}
            </CardTitle>
            {!isLoading && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-8 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : mappings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No mappings found for this concept</p>
              <p className="text-sm">Try selecting a different terminology concept</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mappings.map((mapping, index) => {
                const confidenceLevel = getConfidenceLevel(mapping.confidence);
                const isSelected = selectedMapping?.targetCode === mapping.targetCode;
                
                return (
                  <Card 
                    key={`${mapping.targetSystem}-${mapping.targetCode}`}
                    className={`transition-all duration-300 cursor-pointer hover:shadow-card animate-fade-in-up ${
                      isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedMapping(isSelected ? null : mapping)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getMethodIcon(mapping.method)}
                            <h4 className="font-semibold">{mapping.targetDisplay}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs border ${getEquivalenceColor(mapping.equivalence)}`}
                            >
                              <div className="flex items-center space-x-1">
                                {getEquivalenceIcon(mapping.equivalence)}
                                <span className="capitalize">{mapping.equivalence}</span>
                              </div>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <span>{mapping.targetCode}</span>
                            <span>•</span>
                            <span className="capitalize">{mapping.method.replace('-', ' ')}</span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">Confidence:</span>
                              <span className={`text-sm font-semibold ${confidenceLevel.color}`}>
                                {confidenceLevel.label}
                              </span>
                            </div>
                            <div className="flex-1 max-w-32">
                              <Progress 
                                value={mapping.confidence * 100} 
                                className="h-2"
                              />
                            </div>
                            <span className="text-sm font-mono">
                              {Math.round(mapping.confidence * 100)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRejectMapping(mapping);
                            }}
                            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcceptMapping(mapping);
                            }}
                            className="bg-gradient-primary hover:bg-primary/90"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 pt-4 border-t bg-accent/30 -mx-4 px-4 -mb-4 pb-4 animate-fade-in">
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium mb-1">System URI</h5>
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                {mapping.targetSystem}
                              </code>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-1">Mapping Details</h5>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Method:</span>
                                  <span className="ml-2 capitalize">{mapping.method.replace('-', ' ')}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Equivalence:</span>
                                  <span className="ml-2 capitalize">{mapping.equivalence}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MappingVisualization;