import { Shield, Lock, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityRecommendationsProps {
  highRiskCount: number;
  totalUrls: number;
}

export default function SecurityRecommendations({ highRiskCount, totalUrls }: SecurityRecommendationsProps) {
  const riskPercentage = ((highRiskCount / totalUrls) * 100).toFixed(1);
  
  const recommendations = [
    {
      icon: Shield,
      title: 'Implement URL Filtering',
      description: 'Block high-risk URLs identified in clusters with risk scores above 70',
      priority: 'High'
    },
    {
      icon: Lock,
      title: 'Enable HTTPS-Only Mode',
      description: 'Force HTTPS connections and warn users about non-secure websites',
      priority: 'High'
    },
    {
      icon: AlertCircle,
      title: 'Monitor Suspicious Patterns',
      description: 'Set up alerts for URLs with multiple subdomains and suspicious characters',
      priority: 'Medium'
    },
    {
      icon: Eye,
      title: 'User Education',
      description: 'Train users to recognize phishing attempts and verify URL authenticity',
      priority: 'Medium'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Security Recommendations</h2>
      
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Risk Assessment</h3>
        </div>
        <p className="text-sm text-red-800">
          {riskPercentage}% of analyzed URLs ({highRiskCount} out of {totalUrls}) are classified as high-risk phishing attempts
        </p>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'High' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
