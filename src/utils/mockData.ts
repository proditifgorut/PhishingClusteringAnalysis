import { PhishingData } from '../types';

export function generateMockPhishingData(count: number): PhishingData[] {
  const domains = [
    'paypal-secure', 'amazon-login', 'facebook-verify', 'google-account',
    'microsoft-update', 'apple-support', 'netflix-billing', 'instagram-security',
    'linkedin-profile', 'twitter-verify', 'dropbox-storage', 'github-access'
  ];
  
  const tlds = ['.com', '.net', '.org', '.info', '.xyz', '.tk', '.ml', '.ga'];
  const suspiciousPatterns = ['-', '_', '1', '2', '3', 'login', 'secure', 'verify', 'update'];
  
  return Array.from({ length: count }, (_, i) => {
    const isHighRisk = Math.random() > 0.6;
    const isMediumRisk = !isHighRisk && Math.random() > 0.5;
    
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const tld = tlds[Math.floor(Math.random() * tlds.length)];
    const subdomains = isHighRisk ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 2);
    
    let url = 'http';
    if (!isHighRisk || Math.random() > 0.7) url += 's';
    url += '://';
    
    if (subdomains > 0) {
      for (let j = 0; j < subdomains; j++) {
        url += suspiciousPatterns[Math.floor(Math.random() * suspiciousPatterns.length)] + '.';
      }
    }
    
    url += domain + tld;
    
    if (isHighRisk) {
      const extraPath = suspiciousPatterns.slice(0, Math.floor(Math.random() * 3) + 1).join('/');
      url += '/' + extraPath;
    }
    
    const suspiciousChars = (url.match(/[-_0-9]/g) || []).length;
    
    return {
      id: `url-${i + 1}`,
      url,
      urlLength: url.length,
      hasHttps: url.startsWith('https'),
      hasSuspiciousChars: suspiciousChars,
      domainAge: isHighRisk 
        ? Math.floor(Math.random() * 180) 
        : isMediumRisk 
          ? Math.floor(Math.random() * 365) + 180 
          : Math.floor(Math.random() * 730) + 365,
      subdomainCount: subdomains
    };
  });
}
