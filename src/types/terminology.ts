// Type definitions for the FHIR AYUSH Terminology Service

export interface TerminologyConcept {
  code: string;
  system: string;
  display: string;
  definition?: string;
  synonyms: string[];
  confidence?: number;
  category?: string;
  properties?: ConceptProperty[];
}

export interface ConceptProperty {
  code: string;
  valueString?: string;
  valueCode?: string;
  valueBoolean?: boolean;
}

export interface MappingCandidate {
  targetCode: string;
  targetSystem: string;
  targetDisplay: string;
  confidence: number;
  equivalence: 'equivalent' | 'wider' | 'narrower' | 'inexact' | 'broader' | 'related';
  method: 'lexical' | 'semantic' | 'synonym' | 'manual' | 'lexical-semantic' | 'semantic-traditional' | 'pattern-matching' | 'clinical-correlation' | 'traditional-pattern' | 'anatomical-system' | 'organ-pattern' | 'symptom-matching' | 'pathogenesis-pattern' | 'symptom-direct' | 'pattern-specific' | 'ai-semantic';
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: string;
  entry: BundleEntry[];
}

export interface BundleEntry {
  resource: FHIRResource;
}

export interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export interface SearchResult {
  results: TerminologyConcept[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface TranslationRequest {
  system: string;
  code: string;
  target: string;
}

export interface TranslationResponse {
  mappings: MappingCandidate[];
  confidence: number;
  status: 'success' | 'partial' | 'failed';
}

export interface ConsentMetadata {
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

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}