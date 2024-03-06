import * as fs from 'fs';
import * as readline from 'readline';

export default function createReadlineInterface(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
}
