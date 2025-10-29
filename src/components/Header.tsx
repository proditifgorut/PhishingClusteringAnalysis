import { Shield, Database } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Phishing Clustering Analysis</h1>
              <p className="text-blue-100 text-sm md:text-base">K-Means Algorithm for Computer Security</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <Database className="w-5 h-5" />
            <span className="font-medium">Security Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  );
}
