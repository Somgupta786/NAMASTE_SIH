# FHIR R4 AYUSH Terminology Microservice - Complete Developer Implementation Brief

## Project Overview

You are tasked with building a production-grade FHIR R4 terminology microservice that harmonizes India's AYUSH vocabularies (NAMASTE + WHO International Terminologies for Ayurveda) with WHO ICD-11 (including Traditional Medicine Module 2). This system enables double-coding (traditional + biomedicine) within FHIR-compliant EMRs, ensuring compliance with India's 2016 EHR Standards.

## Architecture & Technical Stack

**Technology Stack:**
- Backend: Node.js + TypeScript + Express + FHIR.js
- Database: PostgreSQL + Redis (caching)
- Authentication: OAuth2 (ABHA integration)
- Frontend: React + TypeScript + Tailwind CSS + shadcn/ui
- Containerization: Docker + Kubernetes
- Observability: Prometheus metrics + structured JSON logging

**Architecture Components:**
1. Terminology API Service (FHIR R4 compliant)
2. ICD-11 Integration Service  
3. NAMASTE CSV Ingestion Pipeline
4. Mapping & Translation Engine
5. Authentication & Authorization Layer
6. Audit & Consent Management
7. Web UI Prototype

## 1. API Specification (OpenAPI v3)

### Core Endpoints

```yaml
openapi: 3.0.3
info:
  title: AYUSH Terminology Service
  version: 1.0.0
paths:
  /v1/lookup:
    get:
      summary: Auto-complete terminology lookup
      parameters:
        - name: query
          in: query
          required: true
          schema:
            type: string
            example: "fever"
        - name: systems
          in: query
          schema:
            type: string
            enum: [namaste, icd11, all]
            default: all
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  results:
                    type: array
                    items:
                      type: object
                      properties:
                        code: { type: string }
                        system: { type: string }
                        display: { type: string }
                        confidence: { type: number }
                        synonyms: { type: array, items: { type: string } }
      security:
        - BearerAuth: [terminology.read]
        
  /v1/translate:
    post:
      summary: Translate between terminology systems
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                system: { type: string, example: "NAMASTE" }
                code: { type: string, example: "NAM-0001" }
                target: { type: string, example: "ICD11" }
      responses:
        '200':
          description: Translation results
          content:
            application/json:
              schema:
                type: object
                properties:
                  mappings:
                    type: array
                    items:
                      type: object
                      properties:
                        targetSystem: { type: string }
                        targetCode: { type: string }
                        display: { type: string }
                        equivalence: { type: string, enum: [equivalent, wider, narrower, inexact] }
                        confidence: { type: number }
                        
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### Additional Endpoints

```typescript
// Core service endpoints
GET    /health                              // Health check
POST   /auth/validate-token                 // ABHA token validation
POST   /ingest/namaste-csv                  // CSV file ingestion
GET    /codesystem/namaste                  // FHIR CodeSystem resource
GET    /conceptmap/namaste-to-icd11         // FHIR ConceptMap resource
POST   /fhir/bundle-upload                  // FHIR Bundle processing
GET    /mapping/conflicts                   // Unresolved mapping conflicts
GET    /metadata/versions                   // Version information
GET    /icd11/fetch-updates                 // Manual ICD-11 sync trigger
GET    /audit/logs                          // Audit trail access
```

## 2. Data Models & Database Schema

### PostgreSQL Schema

```sql
-- Core terminology concepts
CREATE TABLE terminology_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  system VARCHAR(100) NOT NULL,
  display TEXT NOT NULL,
  definition TEXT,
  synonyms JSONB DEFAULT '[]',
  source_uri TEXT,
  version VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(code, system, version)
);

-- Concept mappings
CREATE TABLE concept_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_code VARCHAR(50) NOT NULL,
  source_system VARCHAR(100) NOT NULL,
  target_code VARCHAR(50) NOT NULL,
  target_system VARCHAR(100) NOT NULL,
  equivalence VARCHAR(20) NOT NULL, -- equivalent|wider|narrower|inexact
  confidence_score DECIMAL(3,2),
  mapping_type VARCHAR(20) DEFAULT 'automatic', -- automatic|manual|verified
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  provenance JSONB
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(100),
  abha_id VARCHAR(50),
  action VARCHAR(50),
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  changes JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  client_id VARCHAR(100),
  request_id VARCHAR(100)
);

-- Consent records (ISO 22600 compliant)
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(100),
  consent_status VARCHAR(20),
  purpose JSONB,
  data_categories JSONB,
  authorized_users JSONB,
  expiry_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. FHIR Resource Examples

### NAMASTE CodeSystem Resource

```json
{
  "resourceType": "CodeSystem",
  "id": "namaste-terminology",
  "url": "https://terminology.ayush.gov.in/namaste",
  "version": "1.0.0",
  "name": "NAMASTE",
  "title": "National AYUSH Morbidity & Standardized Terminologies Electronic",
  "status": "active",
  "experimental": false,
  "publisher": "Ministry of AYUSH, Government of India",
  "description": "Standardized Ayurveda, Siddha, and Unani disorder terminologies",
  "hierarchyMeaning": "is-a",
  "content": "complete",
  "count": 4500,
  "concept": [
    {
      "code": "NAM-0001",
      "display": "Jwara (Fever)",
      "definition": "Elevated body temperature with systemic symptoms in Ayurvedic context",
      "designation": [
        {
          "language": "hi",
          "value": "ज्वर"
        },
        {
          "language": "sa",
          "value": "ज्वर"
        }
      ],
      "property": [
        {
          "code": "synonyms",
          "valueString": "Santapa, Taapa"
        },
        {
          "code": "dosha-involvement",
          "valueString": "Vata-Pitta"
        }
      ]
    }
  ]
}
```

### ConceptMap Resource (NAMASTE to ICD-11)

```json
{
  "resourceType": "ConceptMap",
  "id": "namaste-to-icd11",
  "url": "https://terminology.ayush.gov.in/conceptmap/namaste-to-icd11",
  "version": "1.0.0",
  "name": "NAMASTE_to_ICD11_ConceptMap",
  "status": "active",
  "sourceUri": "https://terminology.ayush.gov.in/namaste",
  "targetUri": "http://id.who.int/icd/release/11/2022-02",
  "group": [
    {
      "source": "https://terminology.ayush.gov.in/namaste",
      "target": "http://id.who.int/icd/release/11/2022-02/mms",
      "element": [
        {
          "code": "NAM-0001",
          "display": "Jwara (Fever)",
          "target": [
            {
              "code": "MG22",
              "display": "Fever, unspecified",
              "equivalence": "equivalent",
              "comment": "Direct biomedical equivalent"
            }
          ]
        }
      ]
    },
    {
      "source": "https://terminology.ayush.gov.in/namaste",
      "target": "http://id.who.int/icd/release/11/2022-02/tm2",
      "element": [
        {
          "code": "NAM-0001",
          "display": "Jwara (Fever)",
          "target": [
            {
              "code": "TM2:A01.1",
              "display": "Fever with predominant heat pattern",
              "equivalence": "wider",
              "comment": "Traditional medicine pattern classification"
            }
          ]
        }
      ]
    }
  ]
}
```

### Sample FHIR Bundle with Double Coding

```json
{
  "resourceType": "Bundle",
  "id": "double-coded-problem",
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
        ]
      }
    },
    {
      "resource": {
        "resourceType": "Practitioner",
        "id": "practitioner-001",
        "name": [
          {
            "text": "Dr. Ayurveda Specialist"
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
              "display": "Fever with predominant heat pattern"
            }
          ]
        },
        "subject": {
          "reference": "Patient/patient-001"
        },
        "asserter": {
          "reference": "Practitioner/practitioner-001"
        }
      }
    },
    {
      "resource": {
        "resourceType": "Provenance",
        "id": "provenance-001",
        "target": [
          {
            "reference": "Condition/condition-001"
          }
        ],
        "recorded": "2024-01-15T10:30:00Z",
        "agent": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/provenance-participant-type",
                  "code": "author"
                }
              ]
            },
            "who": {
              "reference": "Practitioner/practitioner-001"
            }
          }
        ],
        "entity": [
          {
            "role": "source",
            "what": {
              "display": "AYUSH EMR System v2.1"
            }
          }
        ]
      }
    }
  ]
}
```

## 4. NAMASTE CSV Ingestion

### Sample NAMASTE CSV Structure

```csv
Code,Display_EN,Display_HI,Display_SA,Definition,Synonyms,Category,Dosha_Involvement,Source_Reference
NAM-0001,Jwara (Fever),ज्वर,ज्वर,Elevated body temperature with systemic symptoms,"Santapa,Taapa,Ushmata",Vyadhi,Vata-Pitta,"Charaka Samhita Ch.3"
NAM-0002,Kasa (Cough),कास,कास,Respiratory disorder with expulsive reflex,"Kshavaku,Pratikasa",Pranavahasrotas,Vata-Kapha,"Sushruta Samhita Su.17"
NAM-0003,Atisara (Diarrhea),अतिसार,अतिसार,Frequent loose bowel movements,"Pravahana,Bahudrava",Annavaha Srotas,Vata-Pitta,"Madhava Nidana Ma.2"
NAM-0004,Prameha (Diabetes),प्रमेह,प्रमेह,Metabolic disorder with excessive urination,"Madhumeha,Kshaudrameha",Meda Dhatu,Kapha-Vata,"Charaka Samhita Ch.6"
NAM-0005,Hridroga (Heart Disease),हृद्रोग,हृद्रोग,Cardiac disorders and cardiovascular ailments,"Hridgada,Hridshula",Rasavahasrotas,Vata-Kapha,"Sushruta Samhita Su.43"
```

### CSV Processing Algorithm

```typescript
interface NamesteCSVRow {
  Code: string;
  Display_EN: string;
  Display_HI?: string;
  Display_SA?: string;
  Definition?: string;
  Synonyms?: string;
  Category?: string;
  Dosha_Involvement?: string;
  Source_Reference?: string;
}

interface ConceptProperty {
  code: string;
  valueString: string;
}

interface ProcessedConcept {
  code: string;
  system: string;
  display: string;
  definition?: string;
  synonyms: string[];
  properties: ConceptProperty[];
}

function processNamesteCSV(csvData: NamesteCSVRow[]): ProcessedConcept[] {
  const concepts: ProcessedConcept[] = [];
  
  for (const row of csvData) {
    // Normalize and validate
    const code = row.Code.trim();
    if (!code || !code.match(/^NAM-\d{4}$/)) {
      throw new Error(`Invalid NAMASTE code format: ${code}`);
    }
    
    const display = row.Display_EN.trim();
    const definition = row.Definition?.trim();
    
    // Parse synonyms
    const synonyms = row.Synonyms 
      ? row.Synonyms.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    // Build properties
    const properties: ConceptProperty[] = [];
    
    if (row.Display_HI) {
      properties.push({
        code: 'hindi-term',
        valueString: row.Display_HI.trim()
      });
    }
    
    if (row.Display_SA) {
      properties.push({
        code: 'sanskrit-term',
        valueString: row.Display_SA.trim()
      });
    }
    
    if (row.Dosha_Involvement) {
      properties.push({
        code: 'dosha-involvement',
        valueString: row.Dosha_Involvement.trim()
      });
    }
    
    if (row.Category) {
      properties.push({
        code: 'category',
        valueString: row.Category.trim()
      });
    }
    
    if (row.Source_Reference) {
      properties.push({
        code: 'source-reference',
        valueString: row.Source_Reference.trim()
      });
    }
    
    concepts.push({
      code,
      system: 'https://terminology.ayush.gov.in/namaste',
      display,
      definition,
      synonyms,
      properties
    });
  }
  
  return concepts;
}

// Deduplication and normalization
function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
```

## 5. ICD-11 Integration

### WHO ICD-11 API Integration

```typescript
interface ICD11Config {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}

class ICD11Service {
  private accessToken?: string;
  private tokenExpiry?: Date;
  
  constructor(private config: ICD11Config) {}
  
  async authenticate(): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        scope: this.config.scope
      })
    });
    
    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    
    return this.accessToken;
  }
  
  private async ensureAuthenticated() {
    if (!this.accessToken || (this.tokenExpiry && this.tokenExpiry < new Date())) {
      await this.authenticate();
    }
  }
  
  async fetchTM2Concepts(): Promise<ICD11Concept[]> {
    await this.ensureAuthenticated();
    
    const response = await fetch(
      `${this.config.baseUrl}/icd/release/11/2022-02/tm2`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Accept-Language': 'en'
        }
      }
    );
    
    return response.json();
  }
  
  async fetchBiomedConcepts(parentId?: string): Promise<ICD11Concept[]> {
    await this.ensureAuthenticated();
    
    const url = parentId 
      ? `${this.config.baseUrl}/icd/release/11/2022-02/mms/${parentId}`
      : `${this.config.baseUrl}/icd/release/11/2022-02/mms`;
      
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    return response.json();
  }
}
```

### Mapping Algorithm

```typescript
interface MappingCandidate {
  targetCode: string;
  targetSystem: string;
  targetDisplay: string;
  confidence: number;
  equivalence: 'equivalent' | 'wider' | 'narrower' | 'inexact';
  method: 'lexical' | 'semantic' | 'synonym' | 'manual';
}

class TerminologyMapper {
  
  async generateMappings(namasteConcept: ProcessedConcept): Promise<MappingCandidate[]> {
    const candidates: MappingCandidate[] = [];
    
    // 1. Lexical matching
    const lexicalMatches = await this.lexicalMatch(namasteConcept);
    candidates.push(...lexicalMatches);
    
    // 2. Synonym matching
    const synonymMatches = await this.synonymMatch(namasteConcept);
    candidates.push(...synonymMatches);
    
    // 3. Semantic similarity (if enabled)
    const semanticMatches = await this.semanticMatch(namasteConcept);
    candidates.push(...semanticMatches);
    
    // 4. Sort by confidence and remove duplicates
    return this.rankAndDedup(candidates);
  }
  
  private async lexicalMatch(concept: ProcessedConcept): Promise<MappingCandidate[]> {
    const candidates: MappingCandidate[] = [];
    const searchTerms = [concept.display, ...concept.synonyms];
    
    for (const term of searchTerms) {
      const normalizedTerm = normalizeForSearch(term);
      
      // Search in ICD-11 TM2
      const tm2Results = await this.searchICD11(normalizedTerm, 'tm2');
      for (const result of tm2Results) {
        candidates.push({
          targetCode: result.code,
          targetSystem: 'http://id.who.int/icd/release/11/2022-02/tm2',
          targetDisplay: result.display,
          confidence: this.calculateLexicalSimilarity(normalizedTerm, result.display),
          equivalence: 'equivalent',
          method: 'lexical'
        });
      }
      
      // Search in ICD-11 Biomedicine
      const biomedResults = await this.searchICD11(normalizedTerm, 'mms');
      for (const result of biomedResults) {
        candidates.push({
          targetCode: result.code,
          targetSystem: 'http://id.who.int/icd/release/11/2022-02/mms',
          targetDisplay: result.display,
          confidence: this.calculateLexicalSimilarity(normalizedTerm, result.display),
          equivalence: 'equivalent',
          method: 'lexical'
        });
      }
    }
    
    return candidates;
  }
  
  private calculateLexicalSimilarity(term1: string, term2: string): number {
    // Implement Jaro-Winkler or Levenshtein distance
    // Return score between 0 and 1
    const distance = this.levenshteinDistance(term1, term2);
    const maxLength = Math.max(term1.length, term2.length);
    return 1 - (distance / maxLength);
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  private async searchICD11(term: string, system: 'tm2' | 'mms'): Promise<Array<{code: string, display: string}>> {
    // Placeholder for ICD-11 search API call
    return [];
  }

  private async synonymMatch(concept: ProcessedConcept): Promise<MappingCandidate[]> {
    // Implement synonym-based matching logic
    return [];
  }

  private async semanticMatch(concept: ProcessedConcept): Promise<MappingCandidate[]> {
    // Implement semantic similarity matching (optional embedding-based)
    return [];
  }

  private rankAndDedup(candidates: MappingCandidate[]): MappingCandidate[] {
    // Sort by confidence descending and remove duplicates by targetCode
    const seen = new Set<string>();
    const ranked = candidates
      .sort((a, b) => b.confidence - a.confidence)
      .filter(c => {
        if (seen.has(c.targetCode)) return false;
        seen.add(c.targetCode);
        return true;
      });
    return ranked;
  }
}
```

## 6. Authentication & Security

### ABHA OAuth2 Integration

```typescript
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

interface ABHATokenClaims {
  sub: string;        // User ID
  aud: string;        // Audience
  iss: string;        // Issuer (ABHA)
  exp: number;        // Expiry timestamp
  scope: string;      // Granted scopes
  abha_id: string;    // ABHA Health ID
  preferred_username?: string;
}

class ABHAAuthService {
  constructor(
    private jwksUrl: string,
    private expectedIssuer: string,
    private expectedAudience: string
  ) {}

  private jwksCache?: any;

  private async fetchJWKS() {
    if (this.jwksCache) return this.jwksCache;
    const response = await fetch(this.jwksUrl);
    this.jwksCache = await response.json();
    return this.jwksCache;
  }

  async validateToken(token: string): Promise<ABHATokenClaims> {
    try {
      // 1. Decode token header to get key ID
      const header = jwt.decode(token, { complete: true })?.header;
      if (!header?.kid) {
        throw new Error('Missing key ID in token header');
      }
      
      // 2. Fetch JWKS and find matching key
      const jwks = await this.fetchJWKS();
      const key = jwks.keys.find((k: any) => k.kid === header.kid);
      if (!key) {
        throw new Error('Key not found in JWKS');
      }
      
      // 3. Verify signature and claims
      const publicKey = jwkToPem(key);
      const claims = jwt.verify(token, publicKey, {
        issuer: this.expectedIssuer,
        audience: this.expectedAudience
      }) as ABHATokenClaims;
      
      // 4. Validate required scopes
      const requiredScopes = ['terminology.read'];
      const grantedScopes = claims.scope.split(' ');
      const hasRequiredScope = requiredScopes.some(scope => 
grantedScopes.includes(scope)
      );
      
      if (!hasRequiredScope) {
        throw new Error('Insufficient scope');
      }
      
      return claims;
      
    } catch (error: any) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }
}

// Middleware for Express
function requireAuth(requiredScopes: string[] = []) {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
      }
      
      const token = authHeader.substring(7);
      const claims = await authService.validateToken(token);
      
      // Check scopes
      const grantedScopes = claims.scope.split(' ');
      const hasRequiredScope = requiredScopes.every(scope => 
        grantedScopes.includes(scope)
      );
      
      if (!hasRequiredScope) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      req.user = claims;
      next();
      
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
```

### ISO 22600 Consent Model

```typescript
interface ConsentMetadata {
  id: string;
  patientId: string;
  status: 'active' | 'inactive' | 'revoked';
  purpose: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  dataCategories: string[];
  authorizedUsers: Array<{
    userId: string;
    role: string;
    organization?: string;
  }>;
  restrictions: {
    allowSharing: boolean;
    allowResearch: boolean;
    retentionPeriod?: string;
  };
  signature: {
    signedBy: string;
    timestamp: string;
    method: 'electronic' | 'digital' | 'physical';
  };
  expiryDate?: string;
}

// Consent validation middleware
function requireConsent(dataCategory: string) {
  return async (req: any, res: any, next: any) => {
    const patientId = req.params.patientId || req.body.patientId;
    const userId = req.user?.sub;
    
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID required' });
    }
    
    const consent = await ConsentService.getActiveConsent(patientId, dataCategory);
    if (!consent) {
      return res.status(403).json({ error: 'No valid consent found' });
    }
    
    const isAuthorized = consent.authorizedUsers.some(user => 
      user.userId === userId
    );
    
    if (!isAuthorized) {
      return res.status(403).json({ error: 'User not authorized for this data' });
    }
    
    req.consent = consent;
    next();
  };
}
```

## 7. UI Component Specifications

### Technology Stack
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components  
- Lucide React icons
- React Hook Form + Zod validation
- TanStack Query for data fetching

### Component Architecture

#### 1. Autocomplete Dual-List Widget

```typescript
interface AutocompleteProps {
  onSelect: (concept: TerminologyConcept) => void;
  systems?: ('namaste' | 'icd11')[];
  placeholder?: string;
  className?: string;
}

interface TerminologyConcept {
  code: string;
  system: string;
  display: string;
  confidence: number;
  synonyms: string[];
  category?: string;
}

// Component props structure
const AutocompleteWidget: React.FC<AutocompleteProps> = ({
  onSelect,
  systems = ['namaste', 'icd11'],
  placeholder = "Search for a condition...",
  className
}) => {
  // Implementation using shadcn/ui Command component
  // Features:
  // - Debounced search (300ms)
  // - Keyboard navigation
  // - System badges (NAMASTE/ICD-11)
  // - Confidence scoring
  // - Synonym highlighting
};

// Usage example
<AutocompleteWidget
  systems={['namaste', 'icd11']}
  onSelect={(concept) => setSelectedConcept(concept)}
  placeholder="Search conditions..."
/>
```

#### 2. Mapping Pane Component

```typescript
interface MappingPaneProps {
  sourceConcept: TerminologyConcept;
  suggestedMappings: MappingCandidate[];
  onAcceptMapping: (mapping: AcceptedMapping) => void;
  onRejectMapping: (mappingId: string) => void;
  onAddManualMapping: (mapping: ManualMapping) => void;
  isLoading?: boolean;
}

interface AcceptedMapping {
  sourceCode: string;
  targetCode: string;
  targetSystem: string;
  equivalence: string;
  confidence: number;
  userConfirmed: boolean;
}

// Component structure:
const MappingPane: React.FC<MappingPaneProps> = ({
  sourceConcept,
  suggestedMappings,
  onAcceptMapping,
  onRejectMapping,
  onAddManualMapping,
  isLoading = false
}) => {
  // Layout:
  // - Source concept display (card with badges)
  // - Suggested mappings list with confidence bars
  // - Accept/Reject buttons for each mapping
  // - Manual mapping input form
  // - Create Problem List Entry button
};
```

#### 3. Consent Modal Component

```typescript
interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (consent: ConsentFormData) => void;
  patientId: string;
  dataCategories: string[];
}

interface ConsentFormData {
  purpose: string;
  allowSharing: boolean;
  allowResearch: boolean;
  retentionPeriod: string;
  authorizedUsers: string[];
  signature: {
    method: 'electronic';
    timestamp: string;
  };
}

// Features:
// - ISO 22600 compliant form fields
// - Purpose selection (treatment/research/insurance)
// - Data sharing preferences
// - Authorized user management
// - Digital signature capture
// - Audit trail initiation
```

#### 4. Problem List Builder

```typescript
interface ProblemListBuilderProps {
  patient: Patient;
  practitioner: Practitioner;
  encounter?: Encounter;
  onSave: (bundle: Bundle) => void;
}

interface ProblemEntry {
  namasteCoding?: Coding;
  icd11TM2Coding?: Coding;  
  icd11BiomedCoding?: Coding;
  clinicalStatus: string;
  onsetDate?: string;
  notes?: string;
}

// Workflow:
// 1. Select NAMASTE condition (autocomplete)
// 2. Review suggested ICD-11 mappings
// 3. Accept/modify mappings
// 4. Add clinical details
// 5. Generate FHIR Bundle
// 6. Validate and submit
```

### UI Wireframe Descriptions

**Main Interface Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: AYUSH Terminology Service                       │
├─────────────────────────────────────────────────────────┤
│ Search Bar: [Type condition name...] [Search]          │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌───────────────────────────────┐│
│ │ Selected Condition  │ │ Suggested Mappings            ││
│ │                     │ │                               ││  
│ │ NAM-0001           │ │ ✓ ICD-11 TM2: TM2:A01.1      ││
│ │ Jwara (Fever)      │ │   Confidence: 85%             ││
│ │                     │ │                               ││
│ │ Synonyms:          │ │ ✓ ICD-11 Biomed: MG22        ││
│ │ • Santapa          │ │   Confidence: 92%             ││  
│ │ • Taapa            │ │                               ││
│ │                     │ │ [+ Add Manual Mapping]        ││
│ └─────────────────────┘ └───────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│ [Create Problem List Entry] [View Audit Trail]         │
└─────────────────────────────────────────────────────────┘
```

## 8. Implementation Steps & Sprint Breakdown

### Sprint 1 (2 weeks): Core Infrastructure
**Deliverables:**
- [ ] Project setup (Node.js + TypeScript + Express)
- [ ] Database schema implementation (PostgreSQL)
- [ ] Basic FHIR resource structure (CodeSystem, ConceptMap)
- [ ] NAMASTE CSV ingestion pipeline
- [ ] Health check endpoints
- [ ] Docker containerization
- [ ] Basic authentication middleware

**Acceptance Criteria:**
- Service starts successfully and responds to health checks
- NAMASTE CSV can be ingested and stored as FHIR CodeSystem
- Database migrations run successfully
- Docker image builds and runs

### Sprint 2 (2 weeks): Core Terminology APIs
**Deliverables:**
- [ ] Lookup endpoint with autocomplete functionality
- [ ] Translate endpoint with mapping algorithm
- [ ] ICD-11 API integration service
- [ ] Basic mapping algorithm (lexical matching)
- [ ] FHIR Bundle upload endpoint
- [ ] ABHA OAuth2 token validation

**Acceptance Criteria:**
- Autocomplete returns relevant results within 200ms
- Translation endpoint maps NAMASTE codes to ICD-11 with confidence scores
- ICD-11 concepts are synchronized and cached
- FHIR Bundles can be uploaded and validated
- ABHA tokens are properly validated

### Sprint 3 (2 weeks): UI & Advanced Features  
**Deliverables:**
- [ ] React UI with all specified components
- [ ] Consent management system (ISO 22600)
- [ ] Audit logging implementation
- [ ] Advanced mapping algorithms (semantic similarity)
- [ ] Conflict resolution interface
- [ ] Versioning and provenance tracking

**Acceptance Criteria:**
- UI allows end-to-end problem list creation workflow
- Consent is properly captured and enforced
- All user actions are audited
- Mapping conflicts can be resolved through UI
- System tracks versions and provenance

## 9. Testing Strategy

### Unit Tests (Jest + Supertest)

```typescript
describe('Terminology Lookup API', () => {
  test('should return NAMASTE results for fever query', async () => {
    const response = await request(app)
      .get('/v1/lookup?query=fever&systems=namaste')
      .set('Authorization', 'Bearer ' + validToken)
      .expect(200);
      
    expect(response.body.results).toHaveLength(1);
    expect(response.body.results[0]).toMatchObject({
      code: 'NAM-0001',
      system: 'https://terminology.ayush.gov.in/namaste',
      display: 'Jwara (Fever)',
      confidence: expect.any(Number)
    });
  });
  
  test('should require valid ABHA token', async () => {
    await request(app)
      .get('/v1/lookup?query=fever')
      .expect(401);
  });
});

describe('Mapping Algorithm', () => {
  test('should generate high confidence mappings for exact matches', () => {
    const concept = { code: 'NAM-0001', display: 'Jwara (Fever)' };
    const mappings = mapper.generateMappings(concept);
    
    expect(mappings).toContainEqual(
      expect.objectContaining({
        targetCode: 'MG22',
        confidence: expect.any(Number)
      })
    );
  });
});
```

### Integration Tests

```typescript
describe('End-to-end Workflow', () => {
  test('NAMASTE ingestion to problem list creation', async () => {
    // 1. Ingest NAMASTE CSV
    const csvData = 'Code,Display_EN\nNAM-0001,Jwara (Fever)';
    await request(app)
      .post('/ingest/namaste-csv')
      .attach('file', Buffer.from(csvData), 'namaste.csv')
      .expect(202);
    
    // 2. Search for concept
    const searchResponse = await request(app)
      .get('/v1/lookup?query=fever')
      .set('Authorization', 'Bearer ' + validToken)
      .expect(200);
    
    // 3. Translate to ICD-11
    const translateResponse = await request(app)
      .post('/v1/translate')
      .send({
        system: 'NAMASTE',
        code: 'NAM-0001',
        target: 'ICD11'
      })
      .set('Authorization', 'Bearer ' + validToken)
      .expect(200);
    
    // 4. Create FHIR Bundle
    const bundle = createProblemBundle(searchResponse.body.results[0]);
    const bundleResponse = await request(app)
      .post('/fhir/bundle-upload')
      .send(bundle)
      .set('Authorization', 'Bearer ' + validToken)
      .expect(201);
    
    expect(bundleResponse.body.status).toBe('success');
  });
});
```

### Performance Tests

```typescript
describe('Performance Requirements', () => {
  test('lookup endpoint should respond within 200ms', async () => {
    const start = Date.now();
    
    await request(app)
      .get('/v1/lookup?query=common&limit=10')
      .set('Authorization', 'Bearer ' + validToken)
      .expect(200);
      
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200);
  });
  
  test('should handle 500 concurrent requests', async () => {
    const requests = Array(500).fill(null).map(() =>
      request(app)
        .get('/v1/lookup?query=test')
        .set('Authorization', 'Bearer ' + validToken)
    );
    
    const responses = await Promise.all(requests);
    const successCount = responses.filter(r => r.status === 200).length;
    
    expect(successCount).toBeGreaterThanOrEqual(475); // 95% success rate
  });
});
```

## 10. Deployment & Operations

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

USER node
CMD ["npm", "start"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ayush-terminology-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ayush-terminology-service
  template:
    metadata:
      labels:
        app: ayush-terminology-service
    spec:
      containers:
      - name: api
        image: ayush-terminology:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ayush-secrets
              key: database-url
        - name: ABHA_JWKS_URL
          value: "https://auth.abdm.gov.in/.well-known/jwks.json"
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ayush-terminology-service
spec:
  selector:
    app: ayush-terminology-service
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

### Configuration Management

```typescript
// config/index.ts
interface AppConfig {
  port: number;
  database: {
    url: string;
    maxConnections: number;
  };
  auth: {
    abhaJwksUrl: string;
    expectedIssuer: string;
    expectedAudience: string;
  };
  icd11: {
    baseUrl: string;
    clientId: string;
    clientSecret: string;
  };
  monitoring: {
    enableMetrics: boolean;
    logLevel: string;
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000'),
  database: {
    url: process.env.DATABASE_URL!,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10')
  },
  auth: {
    abhaJwksUrl: process.env.ABHA_JWKS_URL!,
    expectedIssuer: process.env.ABHA_ISSUER!,
    expectedAudience: process.env.ABHA_AUDIENCE!
  },
  icd11: {
    baseUrl: 'https://id.who.int',
    clientId: process.env.ICD11_CLIENT_ID!,
    clientSecret: process.env.ICD11_CLIENT_SECRET!
  },
  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};
```

## 11. EMR Integration Guide

### Integration Checklist for EMR Vendors

```typescript
// 1. Authentication Setup
const authToken = await getABHAToken(); // Implement ABHA OAuth flow

// 2. Search for conditions
const searchResults = await fetch('/v1/lookup?query=fever', {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json'
  }
});

// 3. Get mappings for selected condition
const mappings = await fetch('/v1/translate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    system: 'NAMASTE',
    code: 'NAM-0001',
    target: 'ICD11'
  })
});

// 4. Create FHIR Condition with double coding
const condition = {
  resourceType: 'Condition',
  code: {
    coding: [
      {
        system: 'https://terminology.ayush.gov.in/namaste',
        code: selectedConcept.code,
        display: selectedConcept.display
      },
      ...mappings.data.mappings.map(m => ({
        system: m.targetSystem,
        code: m.targetCode,
        display: m.display
      }))
    ]
  },
  // ... other fields
};

// 5. Upload bundle with consent
const bundle = createBundle([patient, condition, provenance]);
await fetch('/fhir/bundle-upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/fhir+json'
  },
  body: JSON.stringify(bundle)
});
```

## 12. Monitoring & Observability

### Metrics Collection (Prometheus)

```typescript
import client from 'prom-client';

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code']
});

const terminologyLookups = new client.Counter({
  name: 'terminology_lookups_total',
  help: 'Total number of terminology lookups',
  labelNames: ['system', 'result_count']
});

const mappingOperations = new client.Counter({
  name: 'mapping_operations_total',
  help: 'Total number of mapping operations',
  labelNames: ['source_system', 'target_system', 'confidence_range']
});

// Middleware for request metrics
export function metricsMiddleware(req: any, res: any, next: any) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration);
  });
  
  next();
}
```

### Structured Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ayush-terminology' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Audit logging
export function auditLog(action: string, userId: string, resourceType: string, details: any) {
  logger.info('AUDIT', {
    action,
    userId,
    resourceType,
    details,
    timestamp: new Date().toISOString(),
    requestId: AsyncLocalStorage.getStore()?.requestId
  });
}
```

## 13. Security & Compliance

### Data Residency & Privacy

```typescript
// Encryption at rest configuration
const encryptionConfig = {
  algorithm: 'AES-256-GCM',
  keyRotationPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
  keyManagementService: process.env.KMS_ENDPOINT
};

// PII redaction for logs
function redactPII(data: any): any {
  const piiFields = ['abha_id', 'patient_id', 'mobile', 'email', 'name'];
  const redacted = { ...data };
  
  for (const field of piiFields) {
    if (redacted[field]) {
      redacted[field] = '[REDACTED]';
    }
  }
  
  return redacted;
}

// Data retention policy
const retentionPolicies = {
  auditLogs: 7 * 365 * 24 * 60 * 60 * 1000,      // 7 years
  temporaryData: 30 * 24 * 60 * 60 * 1000,        // 30 days
  consentRecords: 10 * 365 * 24 * 60 * 60 * 1000  // 10 years
};
```

## 14. Sample Data Package

### Complete Example Dataset

**NAMASTE CSV (extended sample):**
```csv
Code,Display_EN,Display_HI,Display_SA,Definition,Synonyms,Category,Dosha_Involvement,Source_Reference
NAM-0001,Jwara (Fever),ज्वर,ज्वर,Elevated body temperature with systemic symptoms,"Santapa,Taapa,Ushmata",Vyadhi,Vata-Pitta,"Charaka Samhita Ch.3"
NAM-0002,Kasa (Cough),कास,कास,Respiratory disorder with expulsive reflex,"Kshavaku,Pratikasa",Pranavahasrotas,Vata-Kapha,"Sushruta Samhita Su.17"
NAM-0003,Atisara (Diarrhea),अतिसार,अतिसार,Frequent loose bowel movements,"Pravahana,Bahudrava",Annavaha Srotas,Vata-Pitta,"Madhava Nidana Ma.2"
NAM-0004,Prameha (Diabetes),प्रमेह,प्रमेह,Metabolic disorder with excessive urination,"Madhumeha,Kshaudrameha",Meda Dhatu,Kapha-Vata,"Charaka Samhita Ch.6"
NAM-0005,Hridroga (Heart Disease),हृद्रोग,हृद्रोग,Cardiac disorders and cardiovascular ailments,"Hridgada,Hridshula",Rasavahasrotas,Vata-Kapha,"Sushruta Samhita Su.43"
NAM-0006,Shotha (Swelling),शोथ,शोथ,Inflammatory swelling and edema,"Svayathu,Pinas",Rasa Dhatu,Kapha,"Charaka Samhita Su.18"
NAM-0007,Arsha (Hemorrhoids),अर्श,अर्श,Anal cushion disorders with bleeding,"Bhagandar,Guda Rog",Purishavasrotas,Vata-Pitta,"Sushruta Samhita Su.34"
NAM-0008,Kamala (Jaundice),कामला,कामला,Yellowish discoloration of skin and eyes,"Halimaka,Haridra",Raktavahasrotas,Pitta-Kapha,"Madhava Nidana Ma.8"
```

**Expected Output CodeSystem Concepts:**
```json
{
  "concept": [
    {
      "code": "NAM-0001",
      "display": "Jwara (Fever)",
      "definition": "Elevated body temperature with systemic symptoms",
      "designation": [
        { "language": "hi", "value": "ज्वर" },
        { "language": "sa", "value": "ज्वर" }
      ],
      "property": [
        { "code": "synonyms", "valueString": "Santapa,Taapa,Ushmata" },
        { "code": "dosha-involvement", "valueString": "Vata-Pitta" },
        { "code": "category", "valueString": "Vyadhi" },
        { "code": "source-reference", "valueString": "Charaka Samhita Ch.3" }
      ]
    }
  ]
}
```

**Expected ConceptMap Entries:**
```json
{
  "element": [
    {
      "code": "NAM-0001",
      "display": "Jwara (Fever)", 
      "target": [
        {
          "code": "MG22",
          "display": "Fever, unspecified",
          "equivalence": "equivalent",
          "comment": "Biomedical fever classification"
        },
        {
          "code": "TM2:A01.1", 
          "display": "Fever with heat pattern",
          "equivalence": "narrower",
          "comment": "Traditional medicine pattern"
        }
      ]
    }
  ]
}
```

## 15. README Template

```markdown
# AYUSH Terminology Service

FHIR R4 compliant microservice for harmonizing NAMASTE and ICD-11 terminologies in Indian AYUSH EMR systems.

## Quick Start

### Local Development

```bash
# Clone and setup
git clone <repository-url>
cd ayush-terminology-service
npm install

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Database setup
docker-compose up -d postgres redis
npm run migrate

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build image
docker build -t ayush-terminology:latest .

# Run with docker-compose
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Apply secrets
kubectl apply -f k8s/secrets.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Configuration

| Environment Variable | Description | Required |
|---------------------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `ABHA_JWKS_URL` | ABHA JWKS endpoint | Yes |
| `ICD11_CLIENT_ID` | WHO ICD-11 API client ID | Yes |
| `ICD11_CLIENT_SECRET` | WHO ICD-11 API secret | Yes |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | No |

## API Usage

### Authentication
All API calls require ABHA bearer token:

```bash
curl -H "Authorization: Bearer <abha-token>" \
     "http://localhost:3000/v1/lookup?query=fever"
```

### EMR Integration Example

```typescript
// Search conditions
const results = await terminologyClient.search("fever");

// Get mappings  
const mappings = await terminologyClient.translate({
  system: "NAMASTE",
  code: "NAM-0001", 
  target: "ICD11"
});

// Create problem list
const bundle = createProblemBundle(patient, condition, mappings);
await terminologyClient.uploadBundle(bundle);
```

## Monitoring

- Health: `GET /health`
- Metrics: `GET /metrics` (Prometheus format)
- Logs: Structured JSON to stdout

## License

Licensed under [License] - see LICENSE file.
```

Take a deep breath and work on this problem step-by-step.
