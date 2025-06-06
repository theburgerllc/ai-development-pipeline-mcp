import { NextRequest, NextResponse } from 'next/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createHash, timingSafeEqual } from 'crypto';

// Authentication configuration
const API_KEY_HEADER = 'x-mcp-api-key';
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Authentication helper
function authenticateRequest(request: NextRequest): boolean {
  const apiKey = request.headers.get(API_KEY_HEADER);
  const expectedKey = process.env.MCP_API_KEY;

  if (!expectedKey) {
    // If no API key is configured, allow requests (development mode)
    return process.env.NODE_ENV === 'development';
  }

  if (!apiKey) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  const apiKeyBuffer = Buffer.from(apiKey);
  const expectedKeyBuffer = Buffer.from(expectedKey);

  if (apiKeyBuffer.length !== expectedKeyBuffer.length) {
    return false;
  }

  return timingSafeEqual(apiKeyBuffer, expectedKeyBuffer);
}

// Rate limiting helper
function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  clientData.count++;
  return true;
}

// Get client identifier for rate limiting
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

// Create MCP server instance
const server = new McpServer({
  name: "AI Development Pipeline Cloud MCP",
  version: "1.0.0"
});

// Environment variable validation
const envSchema = z.object({
  AIRTABLE_API_KEY: z.string().optional(),
  AIRTABLE_BASE_ID: z.string().optional(),
  AIRTABLE_TABLE_NAME: z.string().optional(),
  SQUARE_ACCESS_TOKEN: z.string().optional(),
  SQUARE_APPLICATION_ID: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
});

// Basic health check tool
server.tool(
  'health_check',
  'Check the health status of the cloud MCP server',
  {},
  async () => {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          server: 'AI Development Pipeline Cloud MCP',
          version: '1.0.0'
        }, null, 2)
      }]
    };
  }
);

// Environment info tool (sanitized)
server.tool(
  'get_environment_info',
  'Get sanitized environment information',
  {},
  async () => {
    const env = envSchema.safeParse(process.env);
    const sanitizedInfo = {
      hasAirtableConfig: !!(env.data?.AIRTABLE_API_KEY && env.data?.AIRTABLE_BASE_ID),
      hasSquareConfig: !!(env.data?.SQUARE_ACCESS_TOKEN && env.data?.SQUARE_APPLICATION_ID),
      hasAuthConfig: !!env.data?.NEXTAUTH_SECRET,
      nodeEnv: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(sanitizedInfo, null, 2)
      }]
    };
  }
);

// Secure MCP handler for Vercel
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    if (!authenticateRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Rate limiting check
    const clientId = getClientId(request);
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Basic request validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate JSON-RPC structure
    if (body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
      return NextResponse.json(
        { error: 'Invalid JSON-RPC request' },
        { status: 400 }
      );
    }

    // Log request for security monitoring (sanitized)
    console.log(`MCP Request: ${body.method} from ${clientId} at ${new Date().toISOString()}`);

    // For now, return a simple response indicating the server is running
    // In a full implementation, you would process MCP protocol messages here
    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id || null,
      result: {
        message: 'Cloud MCP server is running',
        tools: ['health_check', 'get_environment_info'],
        timestamp: new Date().toISOString(),
        authenticated: true
      }
    });

  } catch (error: any) {
    // Log error for security monitoring (without sensitive data)
    console.error('MCP endpoint error:', {
      message: error.message,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.substring(0, 100)
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-mcp-api-key',
    },
  });
}

// Handle GET for basic info
export async function GET(_request: NextRequest) {
  return NextResponse.json({
    name: 'AI Development Pipeline Cloud MCP',
    version: '1.0.0',
    status: 'running',
    endpoint: '/api/mcp',
    methods: ['POST'],
    authentication: 'API key required (x-mcp-api-key header)',
    timestamp: new Date().toISOString()
  });
}
