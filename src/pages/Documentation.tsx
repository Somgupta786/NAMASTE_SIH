import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Code,
  Book,
  Zap,
  Shield,
  Database,
  Globe,
  Download,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const Documentation = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const quickStartCode = `// Authentication
const response = await fetch('/auth/validate-token', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ABHA_TOKEN',
    'Content-Type': 'application/json'
  }
});

// Terminology Lookup
const searchResults = await fetch('/v1/lookup?query=fever&systems=all', {
  headers: {
    'Authorization': 'Bearer YOUR_ABHA_TOKEN'
  }
});

// Concept Translation
const translation = await fetch('/v1/translate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ABHA_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    system: 'NAMASTE',
    code: 'NAM-0001',
    target: 'ICD11'
  })
});`;

  const apiSections = [
    {
      title: 'Authentication',
      icon: Shield,
      description: 'ABHA OAuth2 integration and token management',
      endpoints: [
        { method: 'POST', path: '/auth/validate-token', description: 'Validate ABHA bearer token' },
        { method: 'GET', path: '/auth/me', description: 'Get current user information' }
      ]
    },
    {
      title: 'Terminology Lookup',
      icon: Database,
      description: 'Search and browse NAMASTE and ICD-11 terminologies',
      endpoints: [
        { method: 'GET', path: '/v1/lookup', description: 'Search across terminology systems' },
        { method: 'GET', path: '/codesystem/namaste', description: 'Get NAMASTE CodeSystem' },
        { method: 'GET', path: '/codesystem/icd11', description: 'Get ICD-11 CodeSystem' }
      ]
    },
    {
      title: 'Concept Mapping',
      icon: Globe,
      description: 'Translate between terminology systems',
      endpoints: [
        { method: 'POST', path: '/v1/translate', description: 'Translate concepts between systems' },
        { method: 'GET', path: '/conceptmap/namaste-to-icd11', description: 'Get ConceptMap resource' },
        { method: 'GET', path: '/mapping/conflicts', description: 'Get unresolved mapping conflicts' }
      ]
    },
    {
      title: 'FHIR Integration',
      icon: Code,
      description: 'FHIR R4 bundle processing and validation',
      endpoints: [
        { method: 'POST', path: '/fhir/bundle-upload', description: 'Upload and validate FHIR Bundle' },
        { method: 'GET', path: '/fhir/bundle/{id}', description: 'Retrieve processed bundle' },
        { method: 'POST', path: '/fhir/validate', description: 'Validate bundle without storing' }
      ]
    }
  ];

  const sdkExamples = [
    {
      language: 'JavaScript/Node.js',
      code: `const AyushTerminology = require('@ayush/terminology-client');

const client = new AyushTerminology({
  baseUrl: 'https://api.ayush-terminology.gov.in',
  apiKey: 'your-api-key'
});

// Search for conditions
const results = await client.search('fever', {
  systems: ['namaste', 'icd11'],
  limit: 10
});

// Translate concept
const mappings = await client.translate({
  system: 'NAMASTE',
  code: 'NAM-0001',
  target: 'ICD11'
});`
    },
    {
      language: 'Python',
      code: `from ayush_terminology import Client

client = Client(
    base_url='https://api.ayush-terminology.gov.in',
    api_key='your-api-key'
)

# Search for conditions
results = client.search('fever', systems=['namaste', 'icd11'])

# Translate concept
mappings = client.translate(
    system='NAMASTE',
    code='NAM-0001',
    target='ICD11'
)`
    },
    {
      language: 'cURL',
      code: `# Search terminology
curl -X GET "https://api.ayush-terminology.gov.in/v1/lookup?query=fever" \\
  -H "Authorization: Bearer YOUR_TOKEN"

# Translate concept
curl -X POST "https://api.ayush-terminology.gov.in/v1/translate" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "system": "NAMASTE",
    "code": "NAM-0001",
    "target": "ICD11"
  }'`
    }
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold">
          <span className="text-gradient">API</span> Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete guide to integrating the AYUSH Terminology Service into your healthcare applications.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="sdk">SDKs</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="group-hover:text-gradient transition-colors duration-300">
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.endpoints.slice(0, 2).map((endpoint, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <Badge 
                            variant={endpoint.method === 'GET' ? 'secondary' : 'default'} 
                            className="text-xs"
                          >
                            {endpoint.method}
                          </Badge>
                          <span className="font-mono text-xs">{endpoint.path}</span>
                        </div>
                      ))}
                      {section.endpoints.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{section.endpoints.length - 2} more endpoints
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Key Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Core Functionality</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>FHIR R4 compliant API</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>Real-time terminology lookup</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>AI-powered concept mapping</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>Bundle validation & processing</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Security & Compliance</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>ABHA OAuth2 authentication</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>ISO 22600 consent management</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>Comprehensive audit logging</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>Data encryption & privacy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Start Tab */}
        <TabsContent value="quickstart" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Quick Start Guide</span>
              </CardTitle>
              <CardDescription>
                Get up and running with the AYUSH Terminology API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Get Your API Credentials</h3>
                    <p className="text-muted-foreground mb-3">
                      Register your application and obtain ABHA OAuth2 credentials.
                    </p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Credentials
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Make Your First Request</h3>
                    <p className="text-muted-foreground mb-3">
                      Try the API with a simple terminology lookup request.
                    </p>
                    <div className="bg-muted p-4 rounded-lg relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(quickStartCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="text-sm overflow-x-auto">
                        <code>{quickStartCode}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Integrate with Your EMR</h3>
                    <p className="text-muted-foreground mb-3">
                      Use our SDKs or REST API to integrate terminology services into your healthcare application.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download SDK
                      </Button>
                      <Button variant="outline" size="sm">
                        <Book className="h-4 w-4 mr-2" />
                        Integration Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="space-y-6">
          {apiSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{section.title}</span>
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.endpoints.map((endpoint, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className="flex items-center space-x-3">
                          <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* SDKs Tab */}
        <TabsContent value="sdk" className="space-y-6">
          <div className="grid gap-6">
            {sdkExamples.map((example, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{example.language}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(example.code)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Healthcare EMR Integration</CardTitle>
                <CardDescription>
                  Complete example of integrating terminology lookup in an EMR system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Use Case</h4>
                    <p className="text-sm text-muted-foreground">
                      Doctor selects a traditional condition, system suggests ICD-11 mappings for insurance claims.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Complete Example
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Research Data Pipeline</CardTitle>
                <CardDescription>
                  Batch processing of clinical data with terminology standardization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Use Case</h4>
                    <p className="text-sm text-muted-foreground">
                      Researchers process large datasets to standardize traditional medicine terms for analysis.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Pipeline Example
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;