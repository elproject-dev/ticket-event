const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const headerRegex = /<header className="px-4 py-3 flex items-center justify-between border-b bg-background sticky top-0 z-50">[\s\S]*?<\/header>/;
      const match = content.match(headerRegex);
      
      if (match) {
        let title = "Tiketku.com";
        const titleMatch = match[0].match(/<span className="text-sm font-bold tracking-tight[^>]*>(.*?)<\/span>/);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }
        
        let newComponent = `<TopBar />`;
        if (title !== "Tiketku.com") {
          newComponent = `<TopBar title="${title}" />`;
        }

        // Avoid adding duplicate imports
        if (!content.includes('import { TopBar }')) {
          content = `import { TopBar } from "@/components/top-bar";\n` + content;
        }

        content = content.replace(headerRegex, newComponent);
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('./app');
