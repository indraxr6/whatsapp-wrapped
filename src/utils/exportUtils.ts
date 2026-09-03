import * as htmlToImage from 'html-to-image';

function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export async function exportDashboardToPng(node: HTMLElement, filename = 'whatsapp-wrapped.png') {
  try {
    const dataUrl = await htmlToImage.toPng(node, {
      pixelRatio: 2, // HD output
      skipFonts: false,
      filter: (node) => {
        if (node instanceof HTMLElement && node.dataset.exportExclude === 'true') {
          return false;
        }
        return true;
      },
    });

    const blob = dataURItoBlob(dataUrl);

    // Try Web Share API first (highly reliable on iOS Safari)
    if (navigator.canShare) {
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
