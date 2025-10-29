import { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import ClusteringConfig from './components/ClusteringConfig';
import ClusterVisualization from './components/ClusterVisualization';
import ClusterResults from './components/ClusterResults';
import SecurityRecommendations from './components/SecurityRecommendations';
import { PhishingData, ClusterResult, KMeansConfig } from './types';
import { generateMockPhishingData } from './utils/mockData';
import { KMeans, extractFeatures, calculateRiskScore } from './utils/kmeans';

function App() {
  const [phishingData, setPhishingData] = useState<PhishingData[]>([]);
  const [clusters, setClusters] = useState<ClusterResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [config, setConfig] = useState<KMeansConfig>({
    k: 3,
    maxIterations: 100,
    features: ['urlLength', 'hasHttps', 'hasSuspiciousChars', 'domainAge', 'subdomainCount']
  });

  useEffect(() => {
    const mockData = generateMockPhishingData(100);
    setPhishingData(mockData);
    runClustering(mockData, config);
  }, []);

  const runClustering = (data: PhishingData[], currentConfig: KMeansConfig) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const features = extractFeatures(data);
      const kmeans = new KMeans(currentConfig.k, currentConfig.maxIterations);
      const assignments = kmeans.fit(features);
      
      const updatedData = data.map((item, i) => {
        const riskScore = calculateRiskScore(item);
        return {
          ...item,
          cluster: assignments[i],
          riskScore
        };
      });
      
      const clusterColors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
        '#EC4899', '#14B8A6', '#F97316'
      ];
      
      const clusterResults: ClusterResult[] = [];
      for (let i = 0; i < currentConfig.k; i++) {
        const clusterData = updatedData.filter(d => d.cluster === i);
        const avgRiskScore = clusterData.reduce((sum, d) => sum + (d.riskScore || 0), 0) / clusterData.length;
        
        const characteristics: string[] = [];
        const avgLength = clusterData.reduce((sum, d) => sum + d.urlLength, 0) / clusterData.length;
        const httpsPercent = (clusterData.filter(d => d.hasHttps).length / clusterData.length) * 100;
        const avgSubdomains = clusterData.reduce((sum, d) => sum + d.subdomainCount, 0) / clusterData.length;
        
        if (avgLength > 70) characteristics.push('Long URLs');
        if (httpsPercent < 50) characteristics.push('Non-HTTPS');
        if (avgSubdomains > 2) characteristics.push('Multiple Subdomains');
        if (avgRiskScore > 70) characteristics.push('High Risk');
        else if (avgRiskScore > 40) characteristics.push('Medium Risk');
        else characteristics.push('Low Risk');
        
        clusterResults.push({
          clusterId: i,
          count: clusterData.length,
          avgRiskScore,
          characteristics,
          color: clusterColors[i]
        });
      }
      
      setPhishingData(updatedData);
      setClusters(clusterResults);
      setIsProcessing(false);
    }, 1000);
  };

  const handleRunClustering = () => {
    runClustering(phishingData, config);
  };

  const totalUrls = phishingData.length;
  const highRiskUrls = phishingData.filter(d => (d.riskScore || 0) >= 70).length;
  const avgRiskScore = phishingData.reduce((sum, d) => sum + (d.riskScore || 0), 0) / totalUrls;
  const httpsPercentage = ((phishingData.filter(d => d.hasHttps).length / totalUrls) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total URLs Analyzed"
            value={totalUrls}
            icon={Database}
            color="bg-blue-500"
            trend="Dataset loaded"
          />
          <StatsCard
            title="High Risk URLs"
            value={highRiskUrls}
            icon={AlertTriangle}
            color="bg-red-500"
            trend={`${((highRiskUrls / totalUrls) * 100).toFixed(1)}% of total`}
          />
          <StatsCard
            title="Avg Risk Score"
            value={avgRiskScore.toFixed(1)}
            icon={TrendingUp}
            color="bg-orange-500"
            trend="Out of 100"
          />
          <StatsCard
            title="HTTPS Coverage"
            value={`${httpsPercentage}%`}
            icon={CheckCircle}
            color="bg-green-500"
            trend="Secure connections"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ClusteringConfig
              config={config}
              onConfigChange={setConfig}
              onRunClustering={handleRunClustering}
              isProcessing={isProcessing}
            />
          </div>
          
          <div className="lg:col-span-2">
            {clusters.length > 0 && (
              <ClusterResults clusters={clusters} />
            )}
          </div>
        </div>

        {clusters.length > 0 && (
          <>
            <div className="mb-8">
              <ClusterVisualization data={phishingData} clusters={clusters} />
            </div>
            
            <SecurityRecommendations
              highRiskCount={highRiskUrls}
              totalUrls={totalUrls}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
