# Contributing to AI Development Pipeline MCP Integration

Thank you for your interest in contributing to the AI Development Pipeline MCP Integration project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Operating system and version
   - Node.js version
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Error messages or logs

### Submitting Pull Requests

1. **Fork the repository** and create a new branch
2. **Follow the coding standards** outlined below
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

## 🛠️ Development Setup

1. **Clone your fork:**
```bash
git clone https://github.com/yourusername/ai-development-pipeline-mcp.git
cd ai-development-pipeline-mcp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run tests:**
```bash
npm test
npx tsc --noEmit
```

## 📝 Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Follow strict type checking
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer `const` over `let` when possible

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Keep lines under 100 characters when possible

### MCP Tool Development

When adding new MCP tools:

1. **Follow the existing pattern** in `local-mcp-server.ts`
2. **Include proper error handling**
3. **Add input validation** using Zod schemas
4. **Provide clear descriptions** for the tool
5. **Update documentation** in README.md

Example tool structure:
```typescript
server.tool(
  'tool_name',
  'Clear description of what the tool does',
  { 
    param1: z.string(),
    param2: z.number().optional()
  },
  async ({ param1, param2 }) => {
    try {
      // Tool implementation
      return { content: [{ type: 'text', text: 'Success message' }] };
    } catch (error: any) {
      return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  }
);
```

## 🧪 Testing

### Running Tests

```bash
# Type checking
npx tsc --noEmit

# Test MCP server startup
npx ts-node local-mcp-server.ts

# Test specific functionality
npm test
```

### Writing Tests

- Write unit tests for new functions
- Test error conditions and edge cases
- Ensure tests are deterministic
- Mock external dependencies

## 📚 Documentation

### README Updates

When adding features:
- Update the features list
- Add configuration instructions
- Include usage examples
- Update troubleshooting section

### Code Documentation

- Add JSDoc comments for public functions
- Include parameter descriptions
- Document return types and possible errors
- Provide usage examples

## 🔒 Security Guidelines

### API Keys and Secrets

- Never commit real API keys or secrets
- Use environment variables for all sensitive data
- Update `.env.example` when adding new variables
- Test with dummy/sandbox credentials

### Code Security

- Validate all user inputs
- Sanitize file paths and shell commands
- Use parameterized queries for databases
- Follow principle of least privilege

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Test all functionality
4. Create release notes
5. Tag the release
6. Deploy to production

## 📞 Getting Help

- **Discord/Slack**: Join our community channels
- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact maintainers for security issues

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make this project better! 🎉
