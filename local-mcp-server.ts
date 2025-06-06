import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Security configuration
const WORKSPACE_ROOT = process.cwd();
const ALLOWED_COMMANDS = [
  'npm', 'yarn', 'git', 'node', 'npx', 'tsc', 'eslint', 'prettier'
];

// Path validation helper
function validatePath(filePath: string): string {
  const resolvedPath = path.resolve(WORKSPACE_ROOT, filePath);
  if (!resolvedPath.startsWith(WORKSPACE_ROOT)) {
    throw new Error('Path traversal detected - access denied');
  }
  return resolvedPath;
}

// Command validation helper
function validateCommand(command: string): void {
  const commandParts = command.trim().split(/\s+/);
  const baseCommand = commandParts[0];

  if (!ALLOWED_COMMANDS.includes(baseCommand)) {
    throw new Error(`Command '${baseCommand}' is not allowed`);
  }
}

// Create an MCP server
const server = new McpServer({
  name: "AI Development Pipeline Local MCP",
  version: "1.0.0"
});

// 1. Read project file (with security validation)
server.tool(
  'read_project_file',
  'Read a local file from the VS Code workspace (restricted to workspace directory)',
  { path: z.string() },
  async ({ path }) => {
    try {
      const safePath = validatePath(path);
      const content = fs.readFileSync(safePath, 'utf8');
      return { content: [{ type: 'text', text: content }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `File read error: ${err.message}` }] };
    }
  }
);

// 2. Write/update project file (with security validation)
server.tool(
  'write_project_file',
  'Write to a local file in the VS Code workspace (restricted to workspace directory)',
  { path: z.string(), content: z.string() },
  async ({ path, content }) => {
    try {
      const safePath = validatePath(path);
      fs.writeFileSync(safePath, content, 'utf8');
      return { content: [{ type: 'text', text: `File written: ${path}` }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `File write error: ${err.message}` }] };
    }
  }
);

// 3. Execute shell command (with security validation)
server.tool(
  'run_shell_command',
  'Run a whitelisted shell command in the workspace (npm, yarn, git, node, npx, tsc, eslint, prettier)',
  { command: z.string() },
  async ({ command }) => {
    return new Promise((resolve) => {
      try {
        validateCommand(command);
        exec(command, {
          cwd: WORKSPACE_ROOT,
          timeout: 30000, // 30 second timeout
          maxBuffer: 1024 * 1024 // 1MB max output
        }, (error, stdout, stderr) => {
          if (error) {
            resolve({
              content: [{ type: 'text', text: `Error: ${stderr || error.message}` }]
            });
          } else {
            // Sanitize output to prevent log injection
            const sanitizedOutput = stdout.replace(/[\x00-\x1f\x7f-\x9f]/g, '');
            resolve({
              content: [{ type: 'text', text: sanitizedOutput }]
            });
          }
        });
      } catch (err: any) {
        resolve({
          content: [{ type: 'text', text: `Security error: ${err.message}` }]
        });
      }
    });
  }
);

// 4. Check file existence (with security validation)
server.tool(
  'check_file_exists',
  'Check if a local file exists (restricted to workspace directory)',
  { path: z.string() },
  async ({ path }) => {
    try {
      const safePath = validatePath(path);
      const exists = fs.existsSync(safePath);
      return { content: [{ type: 'text', text: exists ? 'File exists' : 'File does not exist' }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `File check error: ${err.message}` }] };
    }
  }
);

// 5. List directory files (with security validation)
server.tool(
  'list_directory_files',
  'List files in a workspace directory (restricted to workspace directory)',
  { dir: z.string() },
  async ({ dir }) => {
    try {
      const safePath = validatePath(dir);
      const files = fs.readdirSync(safePath);
      // Filter out sensitive files
      const filteredFiles = files.filter(file =>
        !file.startsWith('.env') &&
        !file.includes('secret') &&
        !file.includes('key') &&
        !file.includes('password')
      );
      return { content: [{ type: 'text', text: JSON.stringify(filteredFiles, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Directory read error: ${err.message}` }] };
    }
  }
);

// 6. Augment-specific: Trigger augment command
server.tool(
  'run_augment_prompt',
  'Send a prompt to the local Augment coding agent',
  { prompt: z.string() },
  async ({ prompt }) => {
    // You need to provide a local API endpoint, CLI, or plugin to accept this
    // For demo: write to a file for augment to pick up, or invoke augment via CLI/API
    try {
      fs.writeFileSync('./augment-prompt.txt', prompt, 'utf8');
      return { content: [{ type: 'text', text: 'Prompt sent to Augment.' }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: 'Failed to send prompt to Augment.' }] };
    }
  }
);

// 7. Run project tests (npm test etc.)
server.tool(
  'run_project_tests',
  'Run project tests (npm test, yarn test, etc.)',
  {},
  async () => {
    return new Promise((resolve) => {
      exec('npm test', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          resolve({
            content: [{ type: 'text', text: `Test error: ${stderr || error.message}` }]
          });
        } else {
          resolve({
            content: [{ type: 'text', text: stdout }]
          });
        }
      });
    });
  }
);

// Start the MCP server with stdio transport
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Local MCP server started on stdio transport');
}

// Start the server
startServer().catch(console.error);
