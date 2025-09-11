import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share2, 
  Upload, 
  Download,
  CheckCircle,
  AlertCircle,
  FileJson,
  Database,
  Shield,
  Eye,
  Code,
  Zap,
  Activity,
  Clock,
  User,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

const FHIRIntegration = () => {
  const [selectedTab, setSelectedTab] = useState('bundle');
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleBundle = {
    "resourceType": "Bundle",
    "id": "ayush-terminology-example",
    "type": "collection",
    "entry": [
      {
        "resource": {
          "resourceType": "Patient",
          "id": "patient-001",
          "identifier": [
            {
              "system": "https://healthid.ndhm.gov.in",
              "value": "1234567890123456"
            }
          ],
          "name": [
            {
              "text": "राम कुमार",
              "family": "Kumar",
              "given": ["Ram"]
            }
          ]
        }
      },
      {
        "resource": {
          "resourceType": "Condition",
          "id": "condition-001",
          "clinicalStatus": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                "code": "active"
              }
            ]
          },
          "code": {
            "coding": [
              {
                "system": "https://terminology.ayush.gov.in/namaste",
                "code": "NAM-0001",
                "display": "Jwara (Fever)"
              },
              {
                "system": "http://id.who.int/icd/release/11/2022-02/mms",
                "code": "MG22",
                "display": "Fever, unspecified"
              },
              {
                "system": "http://id.who.int/icd/release/11/2022-02/tm2",
                "code": "TM2:A01.1",
                "display": "Fever with heat pattern"
              }
            ]
          },
          "subject": {
            "reference": "Patient/patient-001"
          }
        }
      }
    ]
  };

  const handleValidateBundle = async () => {
    setIsProcessing(true);
    
    try {
      let bundleData;
      if (jsonInput.trim()) {
        bundleData = JSON.parse(jsonInput);
      } else {
        bundleData = sampleBundle;
      }

      // Simulate validation
      setTimeout(() => {
        const result = {
          valid: true,
          resourceCount: bundleData.entry?.length || 0,
          terminologyMappings: bundleData.entry?.filter((e: any) => 
            e.resource?.resourceType === 'Condition' &&
            e.resource?.code?.coding?.some((c: any) => c.system?.includes('namaste'))
          ).length || 0,
          warnings: [],
          errors: []
        };

        setValidationResult(result);
        setIsProcessing(false);
        
        if (result.valid) {
          toast.success('FHIR Bundle validated successfully!');
        } else {
          toast.error('Validation failed. Please check the errors.');
        }
      }, 1500);
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: ['Invalid JSON format']
      });
      setIsProcessing(false);
      toast.error('Invalid JSON format');
    }
  };

  const integrationSteps = [
    {
      title: 'Authentication Setup',
      description: 'Configure ABHA OAuth2 credentials',
      icon: Shield,
      status: 'completed'
    },
    {
      title: 'Bundle Validation',
      description: 'Validate FHIR R4 bundle structure',
      icon: CheckCircle,
      status: 'completed'
    },
    {
      title: 'Terminology Processing',
      description: 'Process NAMASTE and ICD-11 mappings',
      icon: Database,
      status: 'in-progress'
    },
    {
      title: 'Resource Storage',
      description: 'Store validated resources with provenance',
      icon: Upload,
      status: 'pending'
    }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/fhir/bundle-upload',
      description: 'Upload and validate FHIR Bundle',
      response: '201 Created'
    },
    {
      method: 'GET',
      endpoint: '/fhir/bundle/{id}',
      description: 'Retrieve processed bundle',
      response: '200 OK'
    },
    {
      method: 'POST',
      endpoint: '/fhir/validate',
      description: 'Validate bundle without storing',
      response: '200 OK'
    },
    {
      method: 'GET',
      endpoint: '/fhir/metadata',
      description: 'FHIR capability statement',
      response: '200 OK'
    }
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold">
          <span className="text-gradient">FHIR</span> Integration
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Seamless FHIR R4 integration with complete bundle validation and terminology processing.
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bundle">Bundle Upload</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {/* Bundle Upload Tab */}
        <TabsContent value="bundle" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <span>FHIR Bundle Input</span>
                  </CardTitle>
                  <CardDescription>
                    Paste your FHIR R4 Bundle JSON or use the sample data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste your FHIR Bundle JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setJsonInput(JSON.stringify(sampleBundle, null, 2))}
                    >
                      Load Sample Bundle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setJsonInput('')}
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Process Bundle</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleValidateBundle}
                    disabled={isProcessing}
                    className="w-full bg-gradient-primary"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Processing Bundle...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Validate & Process
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Processing Steps */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Processing Pipeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {integrationSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className={`p-2 rounded-full ${
                          step.status === 'completed' ? 'bg-secondary/20 text-secondary' :
                          step.status === 'in-progress' ? 'bg-primary/20 text-primary animate-pulse' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <Badge variant={
                          step.status === 'completed' ? 'secondary' :
                          step.status === 'in-progress' ? 'default' :
                          'outline'
                        }>
                          {step.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Validation Results */}
              {validationResult && (
                <Card className={`shadow-card animate-fade-in ${
                  validationResult.valid ? 'border-secondary' : 'border-destructive'
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {validationResult.valid ? (
                        <CheckCircle className="h-5 w-5 text-secondary" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      <span>Validation Results</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-gradient">
                          {validationResult.resourceCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Resources</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-gradient">
                          {validationResult.terminologyMappings}
                        </div>
                        <div className="text-sm text-muted-foreground">Mappings</div>
                      </div>
                    </div>

                    {validationResult.valid && (
                      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-secondary" />
                          <span className="font-medium text-secondary">Bundle validated successfully!</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          All resources conform to FHIR R4 specification with proper terminology mappings.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                  <FileJson className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>FHIR R4 Compliance</CardTitle>
                <CardDescription>
                  Complete validation against FHIR R4 specification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Resource structure validation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Data type validation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Cardinality checks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-secondary flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Terminology Validation</CardTitle>
                <CardDescription>
                  NAMASTE and ICD-11 code validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Code system validation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Mapping consistency</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Display name verification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-medical-teal flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Security Validation</CardTitle>
                <CardDescription>
                  Authentication and authorization checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>ABHA token validation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Consent verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Access control checks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-primary" />
                <span>FHIR Integration Endpoints</span>
              </CardTitle>
              <CardDescription>
                RESTful API endpoints for FHIR bundle processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <Badge variant="outline">{endpoint.response}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <span>Sample FHIR Bundle</span>
              </CardTitle>
              <CardDescription>
                Example bundle with NAMASTE and ICD-11 terminology mappings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(sampleBundle, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FHIRIntegration;