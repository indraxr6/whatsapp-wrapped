import * as htmlToImage from 'html-to-image';

export async function exportDashboardToPng(node: HTMLElement, filename = 'whatsapp-wrapped.png') {
  try {
    // Add a class temporarily if we need specific CSS to trigger for export
    // For example, making sure scrollbars are hidden or something.
    const dataUrl = await htmlToImage.toPng(node, {
      pixelRatio: 2, // HD output
      skipFonts: false,
      filter: (node) => {
        // Exclude elements with data-export-exclude
        if (node instanceof HTMLElement && node.dataset.exportExclude === 'true') {
          return false;
        }
        return true;
      },
    });

    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (err) {
    console.error('Error exporting image:', err);
    return false;
  }
}
