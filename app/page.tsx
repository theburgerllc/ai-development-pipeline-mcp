import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Development Pipeline MCP Integration',
  description: 'Model Context Protocol server for Claude AI integration',
}

export default function HomePage() {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🤖 AI Development Pipeline MCP Integration</h1>
        <p>Model Context Protocol server for Claude AI integration</p>
      </div>

      <div style={{
        background: '#e8f5e8',
        border: '1px solid #4caf50',
        borderRadius: '8px',
        padding: '1rem',
        margin: '1rem 0'
      }}>
        <h2>✅ MCP Server Status: Online</h2>
        <p>The cloud MCP endpoint is running and ready for Claude integration.</p>
      </div>

      <h2>🔗 Integration Endpoints</h2>
      <div style={{
        background: '#f5f5f5',
        borderRadius: '4px',
        padding: '0.5rem',
        fontFamily: 'monospace',
        margin: '0.5rem 0'
      }}>
        <strong>Cloud MCP Endpoint:</strong> /api/mcp
      </div>
      <div style={{
        background: '#f5f5f5',
        borderRadius: '4px',
        padding: '0.5rem',
        fontFamily: 'monospace',
        margin: '0.5rem 0'
      }}>
        <strong>Health Check:</strong> /api/health
      </div>

      <h2>🛠️ Available MCP Tools</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        margin: '2rem 0'
      }}>
        {[
          { name: 'read_project_file', desc: 'Read files from the workspace' },
          { name: 'write_project_file', desc: 'Write/update files in the workspace' },
          { name: 'run_shell_command', desc: 'Execute shell commands' },
          { name: 'check_file_exists', desc: 'Check if files exist' },
          { name: 'list_directory_files', desc: 'List directory contents' },
          { name: 'run_augment_prompt', desc: 'Send prompts to Augment agent' },
          { name: 'run_project_tests', desc: 'Execute project tests' },
        ].map((tool) => (
          <div key={tool.name} style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>{tool.name}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{tool.desc}</p>
          </div>
        ))}
      </div>

      <h2>📚 Documentation</h2>
      <p>
        For setup instructions and integration guides, visit the{' '}
        <a 
          href="https://github.com/theburgerllc/ai-development-pipeline-mcp" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#0066cc', textDecoration: 'none' }}
        >
          GitHub repository
        </a>.
      </p>

      <h2>🚀 Quick Start</h2>
      <ol>
        <li><strong>Local Development:</strong> <code>npm run dev:mcp</code></li>
        <li><strong>Claude Desktop:</strong> Add stdio transport configuration</li>
        <li><strong>Cloud Integration:</strong> Use this Vercel URL as HTTP MCP server</li>
      </ol>

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid #eee' 
      }}>
        <p>Built with ❤️ for the AI development community</p>
        <p>
          <a 
            href="https://modelcontextprotocol.io" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#0066cc', textDecoration: 'none' }}
          >
            Learn more about MCP
          </a>
        </p>
      </footer>
    </div>
  )
}
