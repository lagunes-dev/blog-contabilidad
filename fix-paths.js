import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Replace absolute paths with relative ones
  content = content.replace(/href="\/src\//g, 'href="src/');
  content = content.replace(/src="\/src\//g, 'src="src/');
  content = content.replace(/href="\/vite\.svg"/g, 'href="vite.svg"');
  content = content.replace(/src="\/vite\.svg"/g, 'src="vite.svg"');
  fs.writeFileSync(f, content);
  console.log(`Updated ${f}`);
});
