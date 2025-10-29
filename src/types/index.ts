export interface PhishingData {
  id: string;
  url: string;
  urlLength: number;
  hasHttps: boolean;
  hasSuspiciousChars: number;
  domainAge: number;
  subdomainCount: number;
  cluster?: number;
  isPhishing?: boolean;
  riskScore?: number;
}

export interface ClusterResult {
  clusterId: number;
  count: number;
  avgRiskScore: number;
  characteristics: string[];
  color: string;
}

export interface KMeansConfig {
  k: number;
  maxIterations: number;
  features: string[];
}
