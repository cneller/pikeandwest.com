module.exports = async (page) => {
  // Disable all animations and transitions for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  // Wait for web fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Additional wait for lazy-loaded images
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img[loading="lazy"]'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return;
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  });
};
