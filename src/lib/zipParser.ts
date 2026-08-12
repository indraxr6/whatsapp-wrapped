import * as fflate from 'fflate';

/**
 * Heuristic to check if a text string looks like a WhatsApp chat export.
 * It checks if at least one of the first few lines matches a typical WhatsApp timestamp pattern.
 */
function isWhatsAppChatFile(text: string): boolean {
  const lines = text.split('\n').slice(0, 50); // Check first 50 lines max
  // Match common WhatsApp formats: [dd/mm/yy, hh:mm:ss] or dd.mm.yy, hh:mm - etc.
  const dateRegex = /^\[?\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}[, ]/;
  
  return lines.some(line => dateRegex.test(line));
}

export async function extractChatFromZip(file: File): Promise<{ text: string, filename: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const zipData = new Uint8Array(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    // We use a filter to ONLY decompress .txt files, completely ignoring huge media files
    // This saves massive amounts of memory and time for large ZIP exports.
    fflate.unzip(zipData, { filter: (fileInfo) => fileInfo.name.endsWith('.txt') }, (err, unzipped) => {
      if (err) return reject(err);
      
      let candidate: { text: string, filename: string } | null = null;
      let candidateCount = 0;

      for (const [filename, fileData] of Object.entries(unzipped)) {
        if (fileData.length === 0) continue;
        
        // Decode the Uint8Array to string using native TextDecoder
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(fileData);
        
        if (isWhatsAppChatFile(text)) {
          candidate = { text, filename };
          candidateCount++;
        }
      }

      if (candidateCount === 0) {
        reject(new Error('Could not find a valid WhatsApp chat log inside the ZIP file.'));
      } else {
        if (candidateCount > 1) {
          console.warn(`[zipParser] Found ${candidateCount} potential chat files. Using ${candidate?.filename}`);
        }
        resolve(candidate!);
      }
    });
  });
}
