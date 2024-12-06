import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Create test directory if it doesn't exist
const testDir = path.join(process.cwd(), 'test-data');
fs.mkdirSync(testDir, { recursive: true });

// Function to create a sample floor plan image
function createFloorPlanImage(level: string, width: number, height: number): string {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw some sample floor plan elements
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  
  // Draw outer walls
  ctx.strokeRect(50, 50, width - 100, height - 100);
  
  // Draw some rooms
  ctx.strokeRect(100, 100, 200, 150);
  ctx.strokeRect(350, 100, 200, 150);
  ctx.strokeRect(100, 300, 450, 200);
  
  // Add text for level
  ctx.font = '48px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(`Level ${level}`, width/2 - 80, height/2);

  // Save the image
  const fileName = `floorplan-${level}.png`;
  const filePath = path.join(testDir, fileName);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);

  return filePath;
}

// Generate test images for different levels
const levels = ['1F', '2F', '3F'];
const imagePaths = levels.map(level => createFloorPlanImage(level, 800, 600));

console.log('Generated test images:');
imagePaths.forEach(path => console.log(path));
