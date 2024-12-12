import sharp from 'sharp';
import { Document, NodeIO, TextureInfo, Material } from '@gltf-transform/core';
import { join } from 'path';

interface FloorPlanToGLTFOptions {
  inputPath: string;      // Path to input floor plan image
  outputPath: string;     // Path to output glTF file
  scale?: number;         // Scale factor for the plane (default: 1)
  height?: number;        // Height of the floor (default: 0)
}

export async function floorPlanToGLTF({
  inputPath,
  outputPath,
  scale = 1,
  height = 0
}: FloorPlanToGLTFOptions): Promise<void> {
  try {
    // Load and process the image
    const image = await sharp(inputPath);
    const metadata = await image.metadata();
    const { width = 1, height: imageHeight = 1 } = metadata;

    // Create aspect ratio-correct plane vertices
    const aspectRatio = width / imageHeight;
    const planeWidth = scale;
    const planeHeight = scale / aspectRatio;

    // Create a new glTF document
    const document = new Document();
    const buffer = document.createBuffer();
    const scene = document.createScene();

    // Create texture from floor plan image
    const imageData = await image.raw().toBuffer();
    const texture = document.createTexture()
      .setImage(imageData)
      .setMimeType('image/png');

    // Create material with the texture
    const material = document.createMaterial()
      .setBaseColorTexture(texture)
      .setDoubleSided(true)
      .setName('floorPlanMaterial');

    // Create mesh primitive for a plane
    const positions = new Float32Array([
      -planeWidth/2, height, planeHeight/2,   // Top left
      planeWidth/2, height, planeHeight/2,    // Top right
      -planeWidth/2, height, -planeHeight/2,  // Bottom left
      planeWidth/2, height, -planeHeight/2    // Bottom right
    ]);

    const indices = new Uint16Array([
      0, 1, 2,  // First triangle
      2, 1, 3   // Second triangle
    ]);

    const uvs = new Float32Array([
      0, 0,  // Top left
      1, 0,  // Top right
      0, 1,  // Bottom left
      1, 1   // Bottom right
    ]);

    // Create accessors for vertex data
    const positionAccessor = document.createAccessor()
      .setType('VEC3')
      .setArray(positions)
      .setBuffer(buffer);

    const indexAccessor = document.createAccessor()
      .setType('SCALAR')
      .setArray(indices)
      .setBuffer(buffer);

    const uvAccessor = document.createAccessor()
      .setType('VEC2')
      .setArray(uvs)
      .setBuffer(buffer);

    // Create primitive and mesh
    const primitive = document.createPrimitive()
      .setIndices(indexAccessor)
      .setAttribute('POSITION', positionAccessor)
      .setAttribute('TEXCOORD_0', uvAccessor)
      .setMaterial(material);

    const mesh = document.createMesh()
      .addPrimitive(primitive)
      .setName('floorPlanMesh');

    // Create node and add to scene
    const node = document.createNode()
      .setMesh(mesh)
      .setName('floorPlanNode');

    scene.addChild(node);

    // Write glTF file
    const io = new NodeIO();
    await io.write(outputPath, document);

  } catch (error) {
    console.error('Error converting floor plan to glTF:', error);
    throw error;
  }
}

// Helper function to convert multiple floor plans
export async function convertFloorPlans(
  inputDir: string,
  outputDir: string,
  scale = 1
): Promise<void> {
  try {
    const files = await import('fs/promises').then(fs => fs.readdir(inputDir));
    const floorPlanFiles = files.filter(file => 
      file.toLowerCase().includes('floorplan') && 
      (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
    );

    for (const file of floorPlanFiles) {
      const inputPath = join(inputDir, file);
      const outputPath = join(outputDir, `${file.split('.')[0]}.gltf`);
      
      // Extract floor height from filename (e.g., "floorplan-2F.png" → height: 2)
      const floorMatch = file.match(/(\d+)F/i);
      const height = floorMatch ? parseInt(floorMatch[1]) : 0;
      
      await floorPlanToGLTF({
        inputPath,
        outputPath,
        scale,
        height: height * scale // Scale height with the same factor
      });
    }
  } catch (error) {
    console.error('Error converting floor plans:', error);
    throw error;
  }
}
