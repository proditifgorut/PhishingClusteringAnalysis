import { PhishingData } from '../types';

export class KMeans {
  private k: number;
  private maxIterations: number;
  private centroids: number[][] = [];
  
  constructor(k: number, maxIterations: number = 100) {
    this.k = k;
    this.maxIterations = maxIterations;
  }

  private normalize(data: number[][]): { normalized: number[][], mins: number[], maxs: number[] } {
    const features = data[0].length;
    const mins = new Array(features).fill(Infinity);
    const maxs = new Array(features).fill(-Infinity);
    
    data.forEach(point => {
      point.forEach((value, i) => {
        mins[i] = Math.min(mins[i], value);
        maxs[i] = Math.max(maxs[i], value);
      });
    });
    
    const normalized = data.map(point =>
      point.map((value, i) => {
        const range = maxs[i] - mins[i];
        return range === 0 ? 0 : (value - mins[i]) / range;
      })
    );
    
    return { normalized, mins, maxs };
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
    );
  }

  private initializeCentroids(data: number[][]): void {
    const indices = new Set<number>();
    while (indices.size < this.k) {
      indices.add(Math.floor(Math.random() * data.length));
    }
    this.centroids = Array.from(indices).map(i => [...data[i]]);
  }

  private assignClusters(data: number[][]): number[] {
    return data.map(point => {
      let minDist = Infinity;
      let cluster = 0;
      
      this.centroids.forEach((centroid, i) => {
        const dist = this.euclideanDistance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          cluster = i;
        }
      });
      
      return cluster;
    });
  }

  private updateCentroids(data: number[][], assignments: number[]): void {
    const newCentroids = Array(this.k).fill(null).map(() => 
      new Array(data[0].length).fill(0)
    );
    const counts = new Array(this.k).fill(0);
    
    data.forEach((point, i) => {
      const cluster = assignments[i];
      counts[cluster]++;
      point.forEach((value, j) => {
        newCentroids[cluster][j] += value;
      });
    });
    
    this.centroids = newCentroids.map((centroid, i) =>
      counts[i] > 0 ? centroid.map(sum => sum / counts[i]) : centroid
    );
  }

  fit(data: number[][]): number[] {
    const { normalized } = this.normalize(data);
    this.initializeCentroids(normalized);
    
    let assignments = this.assignClusters(normalized);
    
    for (let iter = 0; iter < this.maxIterations; iter++) {
      const oldAssignments = [...assignments];
      this.updateCentroids(normalized, assignments);
      assignments = this.assignClusters(normalized);
      
      if (assignments.every((val, i) => val === oldAssignments[i])) {
        break;
      }
    }
    
    return assignments;
  }
}

export function extractFeatures(data: PhishingData[]): number[][] {
  return data.map(item => [
    item.urlLength,
    item.hasHttps ? 1 : 0,
    item.hasSuspiciousChars,
    item.domainAge,
    item.subdomainCount
  ]);
}

export function calculateRiskScore(data: PhishingData): number {
  let score = 0;
  
  if (data.urlLength > 75) score += 25;
  else if (data.urlLength > 50) score += 15;
  
  if (!data.hasHttps) score += 20;
  
  score += data.hasSuspiciousChars * 10;
  
  if (data.domainAge < 180) score += 20;
  else if (data.domainAge < 365) score += 10;
  
  if (data.subdomainCount > 3) score += 15;
  else if (data.subdomainCount > 2) score += 10;
  
  return Math.min(100, score);
}
