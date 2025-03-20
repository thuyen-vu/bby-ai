/**
 * Imports all images from the assets/image folder and its subfolders
 * @returns {Array} An object with image paths as keys and imports as values
 */
export function importAllImages() {
  // Use Vite's import.meta.glob to recursively import all images
  // This will search for common image formats in all nested folders
  const imageFiles = import.meta.glob(
    "/src/assets/**/*.{png,jpg,jpeg,svg,gif,webp}",
    {
      eager: true,
    }
  );

  // Process the imports into a more usable format
  const images = [];
  Object.entries(imageFiles).forEach(([path, module]) => {
    const pathPatterns = [
      { pattern: /\/23-b11\//, month: 11, year: 23 },
      { pattern: /\/23-b12\//, month: 12, year: 23 },
      { pattern: /\/24-1\//, month: 1, year: 24 },
      { pattern: /\/24-2\//, month: 2, year: 24 },
      { pattern: /\/24-3\//, month: 3, year: 24 },
      { pattern: /\/24-4\//, month: 4, year: 24 },
      { pattern: /\/24-5\//, month: 5, year: 24 },
      { pattern: /\/24-6\//, month: 6, year: 24 },
      { pattern: /\/24-7\//, month: 7, year: 24 },
      { pattern: /\/24-8\//, month: 8, year: 24 },
      { pattern: /\/24-9\//, month: 9, year: 24 },
      { pattern: /\/24-b10\//, month: 10, year: 24 },
      { pattern: /\/24-b11\//, month: 11, year: 24 },
      { pattern: /\/24-b12\//, month: 12, year: 24 },
    ];

    for (const { pattern, month, year } of pathPatterns) {
      if (pattern.test(path)) {
        images.push({
          src: module.default,
          month: month,
          year: year,
          monthYear: year * 100 + month,
        });
        break; // Stop once a match is found
      }
    }
  });
  const firstMonthIndices = new Map();
  images.sort((a, b) => a.monthYear - b.monthYear);
  images.forEach((image, index) => {
    let firstImageIdx = -1;
    if (!firstMonthIndices.has(image.monthYear)) {
      firstMonthIndices.set(image.monthYear, {
        key: image.monthYear,
        index: index,
        month: image.month,
        year: image.year,
      });
    }
  });
  const firstMonthIndicesArray = Array.from(firstMonthIndices.values());
  return { images: images, monthIndices: firstMonthIndicesArray };
}
