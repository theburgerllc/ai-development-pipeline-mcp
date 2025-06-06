# AI Development Pipeline MCP Integration

A comprehensive Model Context Protocol (MCP) server implementation that enables seamless integration between Claude AI, VSCode, Augment, and various cloud services including Vercel, Airtable, and Square.

## 🚀 Features

- **Local MCP Server**: Direct stdio integration with Claude Desktop
- **Cloud MCP Server**: HTTP endpoint for web-based Claude integration
- **7 Powerful MCP Tools**: File operations, shell commands, and AI agent integration
- **Multi-Platform Support**: Windows (PowerShell) and Unix (Bash) startup scripts
- **Production Ready**: Vercel deployment configuration included

## 📋 Prerequisites

- Node.js 18+ and npm
- TypeScript and ts-node
- Claude Desktop (for local integration)
- Vercel account (for cloud deployment)

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/ai-development-pipeline-mcp.git
cd ai-development-pipeline-mcp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here

# Airtable Configuration  
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=your_table_name_here

# Square Configuration
SQUARE_APPLICATION_ID=your_square_app_id_here
SQUARE_ACCESS_TOKEN=your_square_access_token_here

# Analytics Configuration
ANALYTICS_SECRET=your_analytics_secret_here
NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
```

## 🖥️ Local MCP Server Setup

### For Windows (PowerShell):
```powershell
.\start-mcp.ps1
```

### For Unix/Linux/macOS (Bash):
```bash
chmod +x start-mcp.sh
./start-mcp.sh
```

### Manual Start:
```bash
npx ts-node local-mcp-server.ts
```

## 🔗 Claude Desktop Integration

1. **Start the local MCP server** using one of the methods above
2. **Configure Claude Desktop** by adding the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "ai-development-pipeline": {
      "command": "npx",
      "args": ["ts-node", "/path/to/your/project/local-mcp-server.ts"],
      "env": {}
    }
  }
}
```

3. **Restart Claude Desktop** to load the MCP server

## ☁️ Cloud Deployment (Vercel)

1. **Deploy to Vercel:**
```bash
npm install -g vercel
vercel deploy
```

2. **Configure environment variables** in the Vercel dashboard

3. **Add to Claude** as an HTTP MCP server:
   - URL: `https://your-app.vercel.app/api/mcp`
   - Method: POST

## 🛠️ Available MCP Tools

The server provides 7 powerful tools for AI-driven development:

1. **`read_project_file`** - Read files from the workspace
2. **`write_project_file`** - Write/update files in the workspace  
3. **`run_shell_command`** - Execute shell commands (npm, git, etc.)
4. **`check_file_exists`** - Check if files exist
5. **`list_directory_files`** - List directory contents
6. **`run_augment_prompt`** - Send prompts to Augment coding agent
7. **`run_project_tests`** - Execute project tests

## 📁 Project Structure

```
ai-development-pipeline-mcp/
├── app/
│   └── api/
│       └── mcp/
│           └── route.ts          # Cloud MCP endpoint
├── src/
│   └── hello.ts                  # Example TypeScript module
├── local-mcp-server.ts           # Local MCP server implementation
├── start-mcp.sh                  # Unix startup script
├── start-mcp.ps1                 # Windows startup script
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── .env.example                  # Environment template
└── README.md                     # This file
```

## 🧪 Testing

Run the TypeScript compiler to check for errors:
```bash
npx tsc --noEmit
```

Test the local MCP server:
```bash
npx ts-node local-mcp-server.ts
```

## 🔒 Security Considerations

- **Never commit `.env` files** - They contain sensitive API keys
- **Use environment variables** for all secrets in production
- **Review API permissions** before deploying to production
- **Enable proper authentication** for cloud deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues:

**"Module not found" errors:**
- Ensure all dependencies are installed: `npm install`
- Check TypeScript configuration in `tsconfig.json`

**MCP server won't start:**
- Verify Node.js version (18+ required)
- Check that ts-node is available: `npx ts-node --version`

**Claude Desktop integration issues:**
- Ensure the MCP server is running before starting Claude
- Check the file path in Claude Desktop configuration
- Restart Claude Desktop after configuration changes

### Getting Help:

- Check the [Issues](https://github.com/yourusername/ai-development-pipeline-mcp/issues) page
- Review the MCP documentation at [modelcontextprotocol.io](https://modelcontextprotocol.io)
- Join the Claude AI community discussions

## 🔗 Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol)
- [Claude Desktop](https://claude.ai/desktop)
- [Vercel](https://vercel.com)
- [Airtable API](https://airtable.com/developers)

## 📊 Project Status

✅ **Ready for Production**
- Local MCP server fully functional
- Cloud deployment configured
- All 7 MCP tools tested and validated
- Cross-platform startup scripts included
- Comprehensive documentation provided

---

**Built with ❤️ for the AI development community**
