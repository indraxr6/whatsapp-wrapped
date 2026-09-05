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
    // Safari Workaround: Convert <canvas> to <img> right before export
    const canvases = node.querySelectorAll('canvas');
    const placeholders: { canvas: HTMLCanvasElement; img: HTMLImageElement }[] = [];
    
    canvases.forEach(canvas => {
      try {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.className = canvas.className;
        img.style.cssText = canvas.style.cssText;
        // Explicitly set width/height to prevent layout collapse
        img.width = canvas.width;
        img.height = canvas.height;
        canvas.parentNode?.insertBefore(img, canvas);
        canvas.style.display = 'none';
        placeholders.push({ canvas, img });
      } catch (e) {
        console.warn('Could not convert canvas to image', e);
      }
    });

    // Give Safari a split second to paint the new <img> tags before cloning the DOM
    await new Promise(resolve => setTimeout(resolve, 150));

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

    // Restore original canvases
    placeholders.forEach(({ canvas, img }) => {
      canvas.style.display = '';
      img.remove();
    });

    const blob = dataURItoBlob(dataUrl);

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
