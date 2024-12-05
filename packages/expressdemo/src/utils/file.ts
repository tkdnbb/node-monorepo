import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Function to calculate MD5 hash of a file
export function calculateMD5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

// Function to check if image with same MD5 exists
export async function findDuplicateImage(uploadDir: string, md5Hash: string): Promise<string | null> {
  const files = fs.readdirSync(uploadDir);
  
  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    const fileHash = await calculateMD5(filePath);
    
    if (fileHash === md5Hash) {
      return file;
    }
  }
  
  return null;
}
