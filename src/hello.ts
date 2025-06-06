/**
 * Hello World module for the AI Development Pipeline
 * This serves as a basic example and test file
 */

export function sayHello(name: string = 'World'): string {
  return `Hello, ${name}! Welcome to the AI Development Pipeline.`;
}

export function getProjectInfo(): object {
  return {
    name: 'AI Development Pipeline',
    version: '1.0.0',
    description: 'Claude/VSCode/Augment AI pipeline with unified MCP, Vercel, Airtable, Square integration',
    author: 'Tim Burger',
    features: [
      'Local MCP Server',
      'Vercel Cloud Integration',
      'Airtable Database',
      'Square Payment Processing',
      'Analytics Tracking'
    ]
  };
}

// Example usage
if (require.main === module) {
  console.log(sayHello());
  console.log('Project Info:', getProjectInfo());
}
