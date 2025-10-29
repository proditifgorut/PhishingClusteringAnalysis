import { Settings, Play } from 'lucide-react';
import { KMeansConfig } from '../types';

interface ClusteringConfigProps {
  config: KMeansConfig;
  onConfigChange: (config: KMeansConfig) => void;
  onRunClustering: () => void;
  isProcessing: boolean;
}

export default function ClusteringConfig({ 
  config, 
  onConfigChange, 
  onRunClustering,
  isProcessing 
}: ClusteringConfigProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">K-Means Configuration</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Clusters (K)
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={config.k}
            onChange={(e) => onConfigChange({ ...config, k: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Iterations
          </label>
          <input
            type="number"
            min="10"
            max="1000"
            value={config.maxIterations}
            onChange={(e) => onConfigChange({ ...config, maxIterations: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="space-y-2">
            {['URL Length', 'HTTPS', 'Suspicious Chars', 'Domain Age', 'Subdomain Count'].map((feature, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          onClick={onRunClustering}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>{isProcessing ? 'Processing...' : 'Run Clustering Analysis'}</span>
        </button>
      </div>
    </div>
  );
}
