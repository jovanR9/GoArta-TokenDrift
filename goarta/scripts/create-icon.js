import fs from 'fs';
import path from 'path';

// Create the public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple SVG icon
const svgIcon = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#6D74FF"/>
  <circle cx="512" cy="512" r="300" fill="#FFFFFF"/>
  <circle cx="512" cy="512" r="200" fill="#6D74FF"/>
  <text x="512" y="800" font-family="Arial, sans-serif" font-size="120" fill="#FFFFFF" text-anchor="middle">GA</text>
</svg>`;

// Write the icon to the public directory
const iconPath = path.join(publicDir, 'app-icon.svg');
fs.writeFileSync(iconPath, svgIcon);

console.log('App icon created at:', iconPath);