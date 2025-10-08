/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();

  startMeasure(name: string): void {
    this.marks.set(name, performance.now());
  }

  endMeasure(name: string): number | null {
    const start = this.marks.get(name);
    if (!start) return null;

    const duration = performance.now() - start;
    this.marks.delete(name);

    this.metrics.push({
      name,
      duration,
      timestamp: new Date()
    });

    if (import.meta.env.DEV) {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
    this.marks.clear();
  }

  getAverageDuration(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;
    
    const total = filtered.reduce((sum, m) => sum + m.duration, 0);
    return total / filtered.length;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Helper for measuring async operations
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  performanceMonitor.startMeasure(name);
  try {
    const result = await operation();
    performanceMonitor.endMeasure(name);
    return result;
  } catch (error) {
    performanceMonitor.endMeasure(name);
    throw error;
  }
}
