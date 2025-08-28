import { NextRequest, NextResponse } from 'next/server';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database?: 'healthy' | 'unhealthy';
    runninghub_api?: 'healthy' | 'unhealthy';
    storage?: 'healthy' | 'unhealthy';
    memory?: 'healthy' | 'unhealthy';
  };
  environment: string;
}

// Cache health check results for 30 seconds
let healthCheckCache: { data: HealthCheck; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

async function performHealthChecks(): Promise<HealthCheck> {
  const startTime = Date.now();
  const checks: HealthCheck['checks'] = {};

  // Check RunningHub API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${process.env.RUNNINGHUB_API_URL || 'https://api.runninghub.ai'}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    checks.runninghub_api = response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    console.warn('RunningHub API health check failed:', error);
    checks.runninghub_api = 'unhealthy';
  }

  // Check database (if configured)
  if (process.env.DATABASE_URL) {
    try {
      // Add database health check here if using a database
      checks.database = 'healthy';
    } catch (error) {
      console.warn('Database health check failed:', error);
      checks.database = 'unhealthy';
    }
  }

  // Check memory usage
  if (typeof process !== 'undefined' && process.memoryUsage) {
    try {
      const memUsage = process.memoryUsage();
      const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      checks.memory = memUsagePercent < 90 ? 'healthy' : 'unhealthy';
    } catch (error) {
      console.warn('Memory health check failed:', error);
      checks.memory = 'unhealthy';
    }
  }

  // Check storage (if configured)
  if (process.env.STORAGE_ENDPOINT) {
    try {
      // Add storage health check here if using external storage
      checks.storage = 'healthy';
    } catch (error) {
      console.warn('Storage health check failed:', error);
      checks.storage = 'unhealthy';
    }
  }

  // Determine overall status
  const allChecks = Object.values(checks);
  const hasUnhealthy = allChecks.includes('unhealthy');
  const status = hasUnhealthy ? 'unhealthy' : 'healthy';

  return {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime ? process.uptime() : 0,
    checks,
    environment: process.env.NODE_ENV || 'development',
  };
}

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (healthCheckCache && (now - healthCheckCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json(healthCheckCache.data, {
        status: healthCheckCache.data.status === 'healthy' ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      });
    }

    // Perform health checks
    const healthData = await performHealthChecks();
    
    // Update cache
    healthCheckCache = {
      data: healthData,
      timestamp: now,
    };

    return NextResponse.json(healthData, {
      status: healthData.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime ? process.uptime() : 0,
      checks: {},
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  }
}

// Simple health check for load balancers
export async function HEAD(request: NextRequest) {
  try {
    // Quick health check without detailed diagnostics
    const isHealthy = true; // Add basic checks here if needed
    
    return new NextResponse(null, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}