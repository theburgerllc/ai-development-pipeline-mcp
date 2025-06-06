import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { exec } from 'child_process';
import * as fs from 'fs';

// Create an MCP server
const server = new McpServer({
  name: "AI Development Pipeline Local MCP",
  version: "1.0.0"
});

// 1. Read project file
server.tool(
  'read_project_file',
  'Read a local file from the VS Code workspace',
  { path: z.string() },
  async ({ path }) => {
    try {
      const content = fs.readFileSync(path, 'utf8');
      return { content: [{ type: 'text', text: content }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `File read error: ${err.message}` }] };
    }
  }
);

// 2. Write/update project file
server.tool(
  'write_project_file',
  'Write to a local file in the VS Code workspace',
  { path: z.string(), content: z.string() },
  async ({ path, content }) => {
    try {
      fs.writeFileSync(path, content, 'utf8');
      return { content: [{ type: 'text', text: `File written: ${path}` }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `File write error: ${err.message}` }] };
    }
  }
);

// 3. Execute shell command (npm, yarn, git, test, etc.)
server.tool(
  'run_shell_command',
  'Run a shell command in the workspace (e.g., npm install, git pull, yarn test)',
  { command: z.string() },
  async ({ command }) => {
    return new Promise((resolve) => {
      exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          resolve({
            content: [{ type: 'text', text: `Error: ${stderr || error.message}` }]
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

// 4. Check file existence
server.tool(
  'check_file_exists',
  'Check if a local file exists',
  { path: z.string() },
  async ({ path }) => {
    try {
      const exists = fs.existsSync(path);
      return { content: [{ type: 'text', text: exists ? 'File exists' : 'File does not exist' }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: 'File check error' }] };
    }
  }
);

// 5. List directory files
server.tool(
  'list_directory_files',
  'List files in a workspace directory',
  { dir: z.string() },
  async ({ dir }) => {
    try {
      const files = fs.readdirSync(dir);
      return { content: [{ type: 'text', text: JSON.stringify(files, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: 'Directory read error' }] };
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
