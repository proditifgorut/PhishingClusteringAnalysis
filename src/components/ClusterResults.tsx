import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ClusterResult } from '../types';
import { motion } from 'framer-motion';

interface ClusterResultsProps {
  clusters: ClusterResult[];
}

export default function ClusterResults({ clusters }: ClusterResultsProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'High Risk', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' };
    if (score >= 40) return { label: 'Medium Risk', icon: Info, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Low Risk', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
  };

  const sortedClusters = [...clusters].sort((a, b) => b.avgRiskScore - a.avgRiskScore);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Cluster Analysis Results</h2>
      
      <div className="space-y-4">
        {sortedClusters.map((cluster, idx) => {
          const risk = getRiskLevel(cluster.avgRiskScore);
          const Icon = risk.icon;
          
          return (
            <motion.div
              key={cluster.clusterId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cluster.color }}
                  />
                  <h3 className="font-semibold text-gray-900">Cluster {cluster.clusterId + 1}</h3>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${risk.bg}`}>
                  <Icon className={`w-4 h-4 ${risk.color}`} />
                  <span className={`text-sm font-medium ${risk.color}`}>{risk.label}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">URLs</p>
                  <p className="text-lg font-semibold text-gray-900">{cluster.count}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Risk Score</p>
                  <p className="text-lg font-semibold text-gray-900">{cluster.avgRiskScore.toFixed(1)}</p>
                </div>
                <div className="col-span-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${cluster.avgRiskScore}%`,
                        backgroundColor: cluster.color
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-2">Characteristics:</p>
                <div className="flex flex-wrap gap-2">
                  {cluster.characteristics.map((char, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
