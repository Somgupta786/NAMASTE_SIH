// Dummy data for the FHIR AYUSH Terminology Service

import { TerminologyConcept, MappingCandidate, AuditLogEntry, ConsentMetadata } from '../types/terminology';

export const namasteTerms: TerminologyConcept[] = [
  {
    code: "NAM-0001",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Jwara (Fever)",
    definition: "Elevated body temperature with systemic symptoms in Ayurvedic context. Characterized by disturbed agni and ama formation.",
    synonyms: ["Santapa", "Taapa", "Ushmata", "Ushnata", "Daha"],
    category: "Vyadhi",
    properties: [
      { code: "dosha-involvement", valueString: "Vata-Pitta" },
      { code: "sanskrit-term", valueString: "ज्वर" },
      { code: "hindi-term", valueString: "ज्वर" },
      { code: "severity", valueString: "mild-severe" },
      { code: "duration", valueString: "acute-chronic" }
    ]
  },
  {
    code: "NAM-0002",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Kasa (Cough)",
    definition: "Respiratory disorder with expulsive reflex. Vata dosha vitiation in pranavahasrotas.",
    synonyms: ["Kshavaku", "Pratikasa", "Kasathu", "Kshudrakasa"],
    category: "Pranavahasrotas",
    properties: [
      { code: "dosha-involvement", valueString: "Vata-Kapha" },
      { code: "sanskrit-term", valueString: "कास" },
      { code: "hindi-term", valueString: "कास" },
      { code: "severity", valueString: "mild-moderate" },
      { code: "type", valueString: "vataja-kaphaja-pittaja-sannipataja-kshayaja" }
    ]
  },
  {
    code: "NAM-0003",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Atisara (Diarrhea)",
    definition: "Frequent loose bowel movements. Grahani dosha with disturbed pachakagni.",
    synonyms: ["Pravahana", "Bahudrava", "Drava-mala", "Pravahika"],
    category: "Annavaha Srotas",
    properties: [
      { code: "dosha-involvement", valueString: "Vata-Pitta" },
      { code: "sanskrit-term", valueString: "अतिसार" },
      { code: "hindi-term", valueString: "अतिसार" },
      { code: "severity", valueString: "mild-severe" },
      { code: "type", valueString: "vataja-pittaja-kaphaja-sannipataja-bhayaja-shokaja" }
    ]
  },
  {
    code: "NAM-0004",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Prameha (Diabetes)",
    definition: "Metabolic disorder with excessive urination. Ojas vitiation and kapha-medas dysfunction.",
    synonyms: ["Madhumeha", "Kshaudrameha", "Mehaga", "Mutratipravritti"],
    category: "Meda Dhatu",
    properties: [
      { code: "dosha-involvement", valueString: "Kapha-Vata" },
      { code: "sanskrit-term", valueString: "प्रमेह" },
      { code: "hindi-term", valueString: "प्रमेह" },
      { code: "severity", valueString: "moderate-severe" },
      { code: "type", valueString: "kaphaja-pittaja-vataja-20types" }
    ]
  },
  {
    code: "NAM-0005",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Hridroga (Heart Disease)",
    definition: "Cardiac disorders and cardiovascular ailments. Rasavahasrotas and vyanavayu dysfunction.",
    synonyms: ["Hridgada", "Hridshula", "Hridkampa", "Hridrava"],
    category: "Rasavahasrotas",
    properties: [
      { code: "dosha-involvement", valueString: "Vata-Kapha" },
      { code: "sanskrit-term", valueString: "हृद्रोग" },
      { code: "hindi-term", valueString: "हृद्रोग" },
      { code: "severity", valueString: "moderate-severe" },
      { code: "type", valueString: "vataja-pittaja-kaphaja-sannipataja-krimija" }
    ]
  },
  {
    code: "NAM-0006",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Shotha (Swelling)",
    definition: "Inflammatory swelling and edema. Rasadhatvagni mandya and kleda accumulation.",
    synonyms: ["Svayathu", "Shopha", "Ucchrita", "Sphita"],
    category: "Rasa Dhatu",
    properties: [
      { code: "dosha-involvement", valueString: "Kapha" },
      { code: "sanskrit-term", valueString: "शोथ" },
      { code: "hindi-term", valueString: "शोथ" },
      { code: "severity", valueString: "mild-moderate" },
      { code: "type", valueString: "vataja-pittaja-kaphaja-sannipataja" }
    ]
  },
  {
    code: "NAM-0007",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Shirahshula (Headache)",
    definition: "Cranial pain disorder. Vata dosha vitiation in shirogata srotas.",
    synonyms: ["Shirashula", "Shirovedana", "Mastakashula", "Kapalavedana"],
    category: "Majjavaha Srotas",
    properties: [
      { code: "dosha-involvement", valueString: "Vata-Pitta" },
      { code: "sanskrit-term", valueString: "शिरःशूल" },
      { code: "hindi-term", valueString: "शिरःशूल" },
      { code: "severity", valueString: "mild-severe" },
      { code: "type", valueString: "vataja-pittaja-kaphaja-sannipataja-krimija" }
    ]
  },
  {
    code: "NAM-0008",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Udararoga (Abdominal Disorders)",
    definition: "Various abdominal pathologies including gastric and intestinal disorders.",
    synonyms: ["Kukshiroga", "Jatharagai", "Udarashoola", "Koshtharoga"],
    category: "Annavaha Srotas",
    properties: [
      { code: "dosha-involvement", valueString: "Vata-Pitta-Kapha" },
      { code: "sanskrit-term", valueString: "उदररोग" },
      { code: "hindi-term", valueString: "उदररोग" },
      { code: "severity", valueString: "mild-severe" },
      { code: "type", valueString: "vatodara-pittodara-kaphodara-sannipatodara-baddhagudodara-chidrodara-jalodara-pleehodara" }
    ]
  },
  {
    code: "NAM-0009",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Kamala (Jaundice)",
    definition: "Hepatic disorder with yellowish discoloration. Pitta dosha vitiation and rakta dushti.",
    synonyms: ["Haridra", "Panduroga", "Pittavikara", "Yakritpleeha"],
    category: "Raktavaha Srotas",
    properties: [
      { code: "dosha-involvement", valueString: "Pitta-Kapha" },
      { code: "sanskrit-term", valueString: "कामला" },
      { code: "hindi-term", valueString: "कामला" },
      { code: "severity", valueString: "moderate-severe" },
      { code: "type", valueString: "shakhasrita-koshagata-bahu dosha" }
    ]
  },
  {
    code: "NAM-0010",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Sandhivata (Arthritis)",
    definition: "Joint disorders with pain and stiffness. Vata vitiation in sandhis with ama accumulation.",
    synonyms: ["Sandhishula", "Sandhigatavata", "Jirna Sandhivata", "Asthi-majjagata vata"],
    category: "Asthivaha Srotas",
    properties: [
      { code: "dosha-involvement", valueString: "Vata-Ama" },
      { code: "sanskrit-term", valueString: "सन्धिवात" },
      { code: "hindi-term", valueString: "सन्धिवात" },
      { code: "severity", valueString: "moderate-severe" },
      { code: "type", valueString: "amavata-sandhigatavata-kroshtukashirsha" }
    ]
  },
  {
    code: "NAM-0011",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Netraroga (Eye Disorders)",
    definition: "Ocular pathologies affecting vision and eye structures. Alochaka pitta vitiation.",
    synonyms: ["Drishtiheenata", "Nayanaroga", "Chakshurvikara", "Netravedana"],
    category: "Chakshurvahasrotas",
    properties: [
      { code: "dosha-involvement", valueString: "Pitta-Vata" },
      { code: "sanskrit-term", valueString: "नेत्ररोग" },
      { code: "hindi-term", valueString: "नेत्ररोग" },
      { code: "severity", valueString: "mild-severe" },
      { code: "type", valueString: "tarpanagata-patalagata-vartmagata-krishna-shvetapatalagata" }
    ]
  },
  {
    code: "NAM-0012",
    system: "https://terminology.ayush.gov.in/namaste",
    display: "Vranashotha (Wound Inflammation)",
    definition: "Infected wound with inflammatory response. Rakta-pitta dushti with kledaka kapha involvement.",
    synonyms: ["Dushta Vrana", "Puyavrana", "Vranashipra", "Kledavrana"],
    category: "Raktavaha Srotas",
    properties: [
      { code: "dosha-involvement", valueString: "Pitta-Kapha" },
      { code: "sanskrit-term", valueString: "व्रणशोथ" },
      { code: "hindi-term", valueString: "व्रणशोथ" },
      { code: "severity", valueString: "moderate-severe" },
      { code: "type", valueString: "shuddha-dushta-ruhyamana-aruha" }
    ]
  }
];

export const icd11Terms: TerminologyConcept[] = [
  {
    code: "MG22",
    system: "http://id.who.int/icd/release/11/2022-02/mms",
    display: "Fever, unspecified",
    definition: "Elevated body temperature without specific cause identified",
    synonyms: ["Pyrexia", "Hyperthermia", "Febrile state"],
    category: "Biomedical",
    properties: [
      { code: "severity", valueString: "mild-severe" },
      { code: "onset", valueString: "acute-chronic" }
    ]
  },
  {
    code: "TM2:A01.1",
    system: "http://id.who.int/icd/release/11/2022-02/tm2",
    display: "Heat pattern fever",
    definition: "Traditional medicine fever pattern characterized by heat signs and symptoms",
    synonyms: ["Heat fever", "Yang excess fever", "Fire pattern fever"],
    category: "Traditional Medicine",
    properties: [
      { code: "pattern", valueString: "heat-excess" },
      { code: "organ-system", valueString: "heart-liver-lung" }
    ]
  },
  {
    code: "CA80.0Z",
    system: "http://id.who.int/icd/release/11/2022-02/mms",
    display: "Cough, unspecified",
    definition: "Sudden expulsion of air from the lungs through the vocal cords",
    synonyms: ["Tussis", "Coughing", "Tussive reflex"],
    category: "Biomedical",
    properties: [
      { code: "type", valueString: "productive-nonproductive" },
      { code: "duration", valueString: "acute-chronic" }
    ]
  },
  {
    code: "TM2:B12.3",
    system: "http://id.who.int/icd/release/11/2022-02/tm2",
    display: "Cough with wind-cold pattern",
    definition: "Traditional medicine cough pattern with wind-cold invasion characteristics",
    synonyms: ["Wind-cold cough", "External cold cough", "Surface cold pattern cough"],
    category: "Traditional Medicine",
    properties: [
      { code: "pattern", valueString: "wind-cold-exterior" },
      { code: "organ-system", valueString: "lung" }
    ]
  },
  {
    code: "5A11",
    system: "http://id.who.int/icd/release/11/2022-02/mms",
    display: "Type 2 diabetes mellitus",
    definition: "Metabolic disorder characterized by insulin resistance and relative insulin deficiency",
    synonyms: ["NIDDM", "Adult-onset diabetes", "Non-insulin dependent diabetes"],
    category: "Biomedical",
    properties: [
      { code: "severity", valueString: "mild-severe" },
      { code: "complications", valueString: "micro-macrovascular" }
    ]
  },
  {
    code: "TM2:C15.2Z",
    system: "http://id.who.int/icd/release/11/2022-02/tm2",
    display: "Wasting-thirst pattern",
    definition: "Traditional medicine diabetes pattern with excessive thirst and urination",
    synonyms: ["Consumptive thirst", "Kidney yin deficiency with heat", "Three burner heat pattern"],
    category: "Traditional Medicine",
    properties: [
      { code: "pattern", valueString: "yin-deficiency-heat" },
      { code: "organ-system", valueString: "kidney-stomach-lung" }
    ]
  },
  {
    code: "BA00-BA0Z",
    system: "http://id.who.int/icd/release/11/2022-02/mms",
    display: "Diseases of the circulatory system",
    definition: "Disorders affecting heart, blood vessels, and circulation",
    synonyms: ["Cardiovascular diseases", "Heart diseases", "Circulatory disorders"],
    category: "Biomedical",
    properties: [
      { code: "type", valueString: "congenital-acquired" },
      { code: "severity", valueString: "mild-life-threatening" }
    ]
  },
  {
    code: "TM2:D08.1",
    system: "http://id.who.int/icd/release/11/2022-02/tm2",
    display: "Heart qi deficiency pattern",
    definition: "Traditional medicine cardiac pattern with deficient heart qi and blood stasis",
    synonyms: ["Heart qi vacuity", "Cardiac qi deficiency", "Heart yang deficiency"],
    category: "Traditional Medicine",
    properties: [
      { code: "pattern", valueString: "qi-deficiency" },
      { code: "organ-system", valueString: "heart" }
    ]
  },
  {
    code: "MB02.0Z",
    system: "http://id.who.int/icd/release/11/2022-02/mms",
    display: "Localized swelling, mass or lump",
    definition: "Circumscribed enlargement or protrusion of body tissue",
    synonyms: ["Edema", "Tumefaction", "Localized inflammation"],
    category: "Biomedical",
    properties: [
      { code: "location", valueString: "superficial-deep" },
      { code: "cause", valueString: "inflammatory-non-inflammatory" }
    ]
  },
  {
    code: "TM2:F09.3",
    system: "http://id.who.int/icd/release/11/2022-02/tm2",
    display: "Phlegm-dampness swelling pattern",
    definition: "Traditional medicine swelling due to phlegm-dampness accumulation",
    synonyms: ["Dampness swelling", "Phlegm retention swelling", "Water-dampness pattern"],
    category: "Traditional Medicine",
    properties: [
      { code: "pattern", valueString: "phlegm-dampness" },
      { code: "organ-system", valueString: "spleen-kidney" }
    ]
  },
  {
    code: "8A80.Z",
    system: "http://id.who.int/icd/release/11/2022-02/mms",
    display: "Headache, unspecified",
    definition: "Pain in the head or upper neck without specific underlying cause",
    synonyms: ["Cephalalgia", "Head pain", "Cranial pain"],
    category: "Biomedical",
    properties: [
      { code: "type", valueString: "primary-secondary" },
      { code: "intensity", valueString: "mild-severe" }
    ]
  },
  {
    code: "TM2:G03.1",
    system: "http://id.who.int/icd/release/11/2022-02/tm2",
    display: "Wind-phlegm headache pattern",
    definition: "Traditional medicine headache due to wind-phlegm obstruction",
    synonyms: ["Wind-phlegm head pain", "Phlegm turbidity headache"],
    category: "Traditional Medicine",
    properties: [
      { code: "pattern", valueString: "wind-phlegm" },
      { code: "organ-system", valueString: "liver-gallbladder" }
    ]
  }
];

// Enhanced mapping data with more realistic confidence scores and methods
export const mappingDatabase: Record<string, MappingCandidate[]> = {
  "NAM-0001": [
    {
      targetCode: "MG22",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
      targetDisplay: "Fever, unspecified",
      confidence: 0.94,
      equivalence: "equivalent",
      method: "lexical-semantic"
    },
    {
      targetCode: "TM2:A01.1",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/tm2",
      targetDisplay: "Heat pattern fever",
      confidence: 0.89,
      equivalence: "related",
      method: "semantic-traditional"
    }
  ],
  "NAM-0002": [
    {
      targetCode: "CA80.0Z",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
      targetDisplay: "Cough, unspecified",
      confidence: 0.96,
      equivalence: "equivalent",
      method: "lexical-semantic"
    },
    {
      targetCode: "TM2:B12.3",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/tm2",
      targetDisplay: "Cough with wind-cold pattern",
      confidence: 0.78,
      equivalence: "narrower",
      method: "pattern-matching"
    }
  ],
  "NAM-0004": [
    {
      targetCode: "5A11",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
      targetDisplay: "Type 2 diabetes mellitus",
      confidence: 0.87,
      equivalence: "broader",
      method: "clinical-correlation"
    },
    {
      targetCode: "TM2:C15.2Z",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/tm2",
      targetDisplay: "Wasting-thirst pattern",
      confidence: 0.92,
      equivalence: "equivalent",
      method: "traditional-pattern"
    }
  ],
  "NAM-0005": [
    {
      targetCode: "BA00-BA0Z",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
      targetDisplay: "Diseases of the circulatory system",
      confidence: 0.82,
      equivalence: "broader",
      method: "anatomical-system"
    },
    {
      targetCode: "TM2:D08.1",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/tm2",
      targetDisplay: "Heart qi deficiency pattern",
      confidence: 0.85,
      equivalence: "related",
      method: "organ-pattern"
    }
  ],
  "NAM-0006": [
    {
      targetCode: "MB02.0Z",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
      targetDisplay: "Localized swelling, mass or lump",
      confidence: 0.91,
      equivalence: "equivalent",
      method: "symptom-matching"
    },
    {
      targetCode: "TM2:F09.3",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/tm2",
      targetDisplay: "Phlegm-dampness swelling pattern",
      confidence: 0.88,
      equivalence: "related",
      method: "pathogenesis-pattern"
    }
  ],
  "NAM-0007": [
    {
      targetCode: "8A80.Z",
      targetSystem: "http://id.who.int/icd/release/11/2022-02/mms",
      targetDisplay: "Headache, unspecified",
      confidence: 0.95,
      equivalence: "equivalent",
      method: "symptom-direct"
    },
    {
      targetCode: "TM2:G03.1",  
      targetSystem: "http://id.who.int/icd/release/11/2022-02/tm2",
      targetDisplay: "Wind-phlegm headache pattern",
      confidence: 0.76,
      equivalence: "narrower",
      method: "pattern-specific"
    }
  ]
};

export const sampleMappings: MappingCandidate[] = mappingDatabase["NAM-0001"] || [];

export const auditLogs: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: "2024-01-15T10:30:00Z",
    userId: "practitioner-001",
    action: "terminology_lookup",
    resourceType: "CodeSystem",
    resourceId: "namaste-terminology",
    changes: { query: "fever", results: 3 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  {
    id: "audit-002",
    timestamp: "2024-01-15T10:35:00Z",
    userId: "practitioner-001",
    action: "concept_mapping",
    resourceType: "ConceptMap",
    resourceId: "namaste-to-icd11",
    changes: { sourceCode: "NAM-0001", targetMappings: 2 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  {
    id: "audit-003",
    timestamp: "2024-01-15T10:40:00Z",
    userId: "practitioner-001",
    action: "bundle_upload",
    resourceType: "Bundle",
    resourceId: "bundle-001",
    changes: { resources: 4, status: "success" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  }
];

export const sampleConsent: ConsentMetadata = {
  id: "consent-001",
  patientId: "patient-001",
  status: "active",
  purpose: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActReason",
        code: "TREAT",
        display: "Treatment"
      }
    ]
  },
  dataCategories: ["terminology", "clinical-data"],
  authorizedUsers: [
    {
      userId: "practitioner-001",
      role: "attending-physician",
      organization: "AIIMS Delhi"
    }
  ],
  restrictions: {
    allowSharing: true,
    allowResearch: false,
    retentionPeriod: "7-years"
  },
  signature: {
    signedBy: "patient-001",
    timestamp: "2024-01-15T09:00:00Z",
    method: "electronic"
  },
  expiryDate: "2025-01-15T09:00:00Z"
};

export const featuresData = [
  {
    title: "Terminology Lookup",
    description: "Search across NAMASTE and ICD-11 vocabularies with intelligent autocomplete",
    icon: "Search",
    features: ["Fuzzy matching", "Synonym expansion", "Multi-language support", "Confidence scoring"]
  },
  {
    title: "Concept Mapping",
    description: "Automated mapping between traditional and biomedical terminologies",
    icon: "GitBranch",
    features: ["AI-powered matching", "Manual curation", "Equivalence classification", "Version tracking"]
  },
  {
    title: "FHIR Integration",
    description: "Complete FHIR R4 compliance with seamless EMR integration",
    icon: "Share2",
    features: ["Bundle processing", "Resource validation", "Provenance tracking", "Audit trails"]
  },
  {
    title: "Security & Compliance",
    description: "Enterprise-grade security with ABHA integration and ISO 22600 consent",
    icon: "Shield",
    features: ["OAuth2 authentication", "Consent management", "Data encryption", "Audit logging"]
  }
];

export const statsData = [
  { label: "NAMASTE Terms", value: "4,500+", description: "Standardized Ayurvedic terminologies", icon: "Database" },
  { label: "ICD-11 Mappings", value: "2,800+", description: "Bi-directional concept mappings", icon: "GitBranch" },
  { label: "API Calls/Day", value: "50K+", description: "Average daily terminology lookups", icon: "TrendingUp" },
  { label: "EMR Integrations", value: "25+", description: "Certified healthcare systems", icon: "Share2" }
];