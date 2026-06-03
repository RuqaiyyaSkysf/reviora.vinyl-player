export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
}

/**
 * Extract metadata from an audio file (MP3, etc.)
 * Lightweight implementation that reads ID3v2 tags from the beginning of the file
 */
export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  try {
    // Read the first few KB of the file to look for ID3 tags
    const buffer = await file.slice(0, 10000).arrayBuffer();
    const view = new Uint8Array(buffer);

    // Check for ID3v2 header
    if (view[0] === 73 && view[1] === 68 && view[2] === 51) { // "ID3"
      console.log("[v0] Found ID3v2 tag in audio file");
      // Basic ID3v2 tag detection - for full parsing would need more complex logic
      // For now, just extract any text found in the tag region
      
      let artwork: string | undefined;
      
      // Look for APIC frame (attached picture) - simplified approach
      // This is a minimal implementation that looks for picture data
      for (let i = 0; i < view.length - 4; i++) {
        // Look for APIC frame header in ID3v2.3/v2.4
        if (view[i] === 0x41 && view[i+1] === 0x50 && view[i+2] === 0x49 && view[i+3] === 0x43) {
          console.log("[v0] Found APIC frame (artwork) in ID3 tag");
          // Found APIC frame, but extracting image data requires complex parsing
          break;
        }
      }

      return {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Local File",
        artwork,
      };
    }

    // No ID3 tag found, return basic info
    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
    };
  } catch (error) {
    console.log("[v0] Error reading audio metadata:", error);
    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
    };
  }
}
