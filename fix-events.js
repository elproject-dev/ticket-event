const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace Prisma model references
      content = content.replace(/prisma\.acara/g, 'prisma.event');
      // Replace type references
      content = content.replace(/import \{ acara \}/g, 'import { event }');
      content = content.replace(/acara: acara/g, 'acara: event');
      content = content.replace(/acara \}/g, 'event }');
      // Replace URLs
      content = content.replace(/\/acara/g, '/event');
      // Let's keep variable names as 'acara' or change to 'event'? The user said they are different contexts.
      // If we rename Acara to Event and acara to event, it will make it distinct.
      content = content.replace(/acara/g, 'event');
      content = content.replace(/Acara/g, 'Event');
      content = content.replace(/ACARA/g, 'EVENT');

      fs.writeFileSync(fullPath, content);
      
      // Rename file if it contains Acara
      if (file.includes('Acara')) {
        const newName = file.replace('Acara', 'Event');
        fs.renameSync(fullPath, path.join(dir, newName));
      }
    }
  }
}

replaceInDir('./app/admin/event');
replaceInDir('./app/event');
console.log('Done');
