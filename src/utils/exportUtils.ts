import * as htmlToImage from 'html-to-image';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

async function safeExport(node: HTMLElement, config: any, retries = 2, delay = 150): Promise<Blob | null> {
  const blob = await htmlToImage.toBlob(node, config);
  if (isSafari && retries > 0) {
    await new Promise(r => setTimeout(r, delay));
    return safeExport(node, config, retries - 1, delay);
  }
  return blob;
}

export async function exportDashboardToPng(node: HTMLElement, filename = 'whatsapp-wrapped.png') {
  try {
    const config = {
      pixelRatio: 1.4, // Reduced from 2.0 to shrink file size while staying decently sharp
      skipFonts: true,
      cacheBust: true, // Forces fresh CORS fetch for images like Spotify
      filter: (n: HTMLElement) => {
        if (n instanceof HTMLElement && n.dataset?.exportExclude === 'true') {
          return false;
        }
        return true;
      },
    };

    const blob = await safeExport(node, config);
    if (!blob) throw new Error("Export failed to generate Blob");

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Try Web Share API first (highly reliable on iOS/Android)
    if (isMobile && navigator.canShare) {
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'WhatsApp Wrapped Export',
          });
          return true;
        } catch (shareErr) {
          console.log('Share API cancelled or failed', shareErr);
          // Fall through to standard download just in case
        }
      }
    }

    // Standard fallback (Desktop / Android)
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = blobUrl;
    link.click();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    return true;
  } catch (err) {
    console.error('Error exporting image:', err);
    return false;
  }
}
