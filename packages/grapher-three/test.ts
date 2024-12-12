import { floorPlanToGLTF, convertFloorPlans } from './index';
import path from 'path';
import { fileURLToPath } from 'url';

// Create equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Example 1: Convert a single floor plan
    await floorPlanToGLTF({
      inputPath: path.join(__dirname, 'input', 'floorplan-1F.png'),
      outputPath: path.join(__dirname, 'output', 'floor1.gltf'),
      scale: 10,  // 10 units wide
      height: 0   // Ground floor
    });

    // Example 2: Convert multiple floor plans in a directory
    await convertFloorPlans(
      path.join(__dirname, 'input'),  // Input directory with floor plans
      path.join(__dirname, 'output'), // Output directory for glTF files
      10 // scale
    );

    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

main(); 