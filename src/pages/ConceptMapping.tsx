import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  Search, 
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Brain,
  Target,
  Zap,
  BarChart,
  Settings,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { namasteTerms, sampleMappings } from '@/data/dummyData';
import { TerminologyConcept, MappingCandidate } from '@/types/terminology';

const ConceptMapping = () => {
  const [selectedConcept, setSelectedConcept] = useState<TerminologyConcept | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mappingResults, setMappingResults] = useState<MappingCandidate[]>([]);
  const [isMapping, setIsMapping] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const found = namasteTerms.find(term => 
        term.display.toLowerCase().includes(query.toLowerCase())
      );
      if (found) {
        setSelectedConcept(found);
      }
    }
  };

  const generateMappings = async () => {
    if (!selectedConcept) return;
    
    setIsMapping(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate different mappings based on the selected concept
      let mappings: MappingCandidate[] = [];
      
      if (selectedConcept.code === 'NAM-0001') {
        mappings = [
          {
            targetCode: "MG22",
            targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
            targetDisplay: "Fever, unspecified",
            confidence: 0.92,
            equivalence: "equivalent",
            method: "lexical"
          },
          {
            targetCode: "TM2:A01.1",
            targetSystem: "http://id.who.int/icd/release/11/2022-02/tm2",
            targetDisplay: "Fever with heat pattern",
            confidence: 0.85,
            equivalence: "narrower",
            method: "semantic"
          }
        ];
      } else {
        // Generate random mappings for demo
        mappings = [
          {
            targetCode: `ICD-${Math.floor(Math.random() * 1000)}`,
            targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
            targetDisplay: `Mapped condition for ${selectedConcept.display}`,
            confidence: Math.random() * 0.3 + 0.7,
            equivalence: "equivalent",
            method: "lexical"
          }
        ];
      }
      
      setMappingResults(mappings);
      setIsMapping(false);
    }, 2000);
  };

  const getEquivalenceBadge = (equivalence: string) => {
    const variants = {
      equivalent: { variant: "default" as const, color: "bg-secondary" },
      wider: { variant: "outline" as const, color: "border-blue-500 text-blue-600" },
      narrower: { variant: "outline" as const, color: "border-orange-500 text-orange-600" },
      inexact: { variant: "outline" as const, color: "border-yellow-500 text-yellow-600" }
    };
    
    const config = variants[equivalence as keyof typeof variants] || variants.equivalent;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {equivalence}
      </Badge>
    );
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'lexical': return <Target className="h-4 w-4" />;
      case 'semantic': return <Brain className="h-4 w-4" />;
      case 'synonym': return <GitBranch className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold">
          <span className="text-gradient">Concept</span> Mapping
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI-powered mapping between NAMASTE traditional medicine terms and ICD-11 biomedical classifications.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Source Concept Selection */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span>Select Source Concept</span>
              </CardTitle>
              <CardDescription>
                Choose a NAMASTE term to find mappings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search NAMASTE terms..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Selection */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Popular Terms</h4>
                <div className="space-y-2">
                  {namasteTerms.slice(0, 4).map((term) => (
                    <Button
                      key={term.code}
                      variant={selectedConcept?.code === term.code ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setSelectedConcept(term);
                        setSearchQuery(term.display);
                        setMappingResults([]);
                      }}
                    >
                      <div className="text-left">
                        <div className="font-medium">{term.display}</div>
                        <div className="text-xs text-muted-foreground">{term.code}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Concept Details */}
          {selectedConcept && (
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Selected Concept</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{selectedConcept.display}</h3>
                    <Badge variant="secondary">NAMASTE</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedConcept.code}</p>
                </div>

                {selectedConcept.definition && (
                  <div>
                    <h4 className="font-medium mb-1">Definition</h4>
                    <p className="text-sm text-muted-foreground">{selectedConcept.definition}</p>
                  </div>
                )}

                {selectedConcept.synonyms.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Synonyms</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedConcept.synonyms.map((synonym, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={generateMappings}
                  disabled={isMapping}
                  className="w-full bg-gradient-primary"
                >
                  {isMapping ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Generating Mappings...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Mappings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mapping Results */}
        <div className="lg:col-span-2 space-y-6">
          {mappingResults.length > 0 && (
            <>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <GitBranch className="h-5 w-5 text-primary" />
                      <span>Suggested Mappings</span>
                    </span>
                    <Badge variant="outline">{mappingResults.length} found</Badge>
                  </CardTitle>
                  <CardDescription>
                    AI-generated mappings with confidence scores and equivalence relationships
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mappingResults.map((mapping, index) => (
                    <Card 
                      key={index} 
                      className="border-2 hover:border-primary/50 transition-all duration-300 group animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold group-hover:text-gradient transition-colors">
                                {mapping.targetDisplay}
                              </h3>
                              {getEquivalenceBadge(mapping.equivalence)}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center space-x-1">
                                {getMethodIcon(mapping.method)}
                                <span className="capitalize">{mapping.method} matching</span>
                              </span>
                              <span>Code: {mapping.targetCode}</span>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Confidence Score</span>
                                <span className="text-sm font-bold text-gradient">
                                  {Math.round(mapping.confidence * 100)}%
                                </span>
                              </div>
                              <Progress 
                                value={mapping.confidence * 100} 
                                className="h-2"
                              />
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {mapping.targetSystem.includes('mms') ? 'ICD-11 Biomedical' : 'ICD-11 Traditional Medicine'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button variant="default" size="sm">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Mapping Statistics */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    <span>Mapping Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient mb-1">
                        {Math.round((mappingResults.reduce((acc, m) => acc + m.confidence, 0) / mappingResults.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Average Confidence</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient mb-1">
                        {mappingResults.filter(m => m.equivalence === 'equivalent').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Exact Matches</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient mb-1">
                        {mappingResults.filter(m => m.method === 'semantic').length}
                      </div>
                      <div className="text-sm text-muted-foreground">AI Semantic</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {!selectedConcept && (
            <Card className="text-center p-12 shadow-card">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center">
                  <GitBranch className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Select a Concept to Map</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose a NAMASTE traditional medicine term from the left panel to generate intelligent mappings to ICD-11 classifications.
                </p>
              </div>
            </Card>
          )}

          {selectedConcept && mappingResults.length === 0 && !isMapping && (
            <Card className="text-center p-12 shadow-card">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-secondary/10 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Ready to Generate Mappings</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Click "Generate Mappings" to use our AI-powered system to find corresponding ICD-11 terms.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptMapping;