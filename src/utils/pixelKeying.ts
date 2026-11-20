export interface ExtractedSpriteResult {
  dataUrl: string;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Removes the solid outer background via border BFS flood-fill so interior
 * matching colors (like sky/ocean inside the island logo or emblem) remain intact.
 */
export async function extractTransparentSprite(
  imageUrl: string,
  tolerance = 42,
): Promise<ExtractedSpriteResult> {
  const img = await loadImage(imageUrl);
  const w = img.naturalWidth;
  const h = img.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Contexto 2D indisponível');
  }

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sample average corner color from top-left, top-right, bottom-left, bottom-right
  const corners = [
    0,
    (w - 1) * 4,
    ((h - 1) * w) * 4,
    ((h - 1) * w + (w - 1)) * 4,
  ];
  let refR = 0;
  let refG = 0;
  let refB = 0;
  for (const idx of corners) {
    refR += data[idx];
    refG += data[idx + 1];
    refB += data[idx + 2];
  }
  refR = Math.round(refR / corners.length);
  refG = Math.round(refG / corners.length);
  refB = Math.round(refB / corners.length);

  const tolSq = tolerance * tolerance * 3;
  const totalPixels = w * h;
  const visited = new Uint8Array(totalPixels);
  const removed = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const isBg = (pixelIdx: number): boolean => {
    const o = pixelIdx * 4;
    const dr = data[o] - refR;
    const dg = data[o + 1] - refG;
    const db = data[o + 2] - refB;
    return dr * dr + dg * dg + db * db <= tolSq;
  };

  const enqueue = (pixelIdx: number) => {
    if (visited[pixelIdx]) return;
    visited[pixelIdx] = 1;
    if (isBg(pixelIdx)) {
      removed[pixelIdx] = 1;
      queue[tail++] = pixelIdx;
    }
  };

  // Seed flood fill from all 4 outer edges
  for (let x = 0; x < w; x++) {
    enqueue(x);
    enqueue((h - 1) * w + x);
  }
  for (let y = 1; y < h - 1; y++) {
    enqueue(y * w);
    enqueue(y * w + (w - 1));
  }

  while (head < tail) {
    const curr = queue[head++];
    const x = curr % w;
    const y = (curr - x) / w;

    if (x > 0) enqueue(curr - 1);
    if (x < w - 1) enqueue(curr + 1);
    if (y > 0) enqueue(curr - w);
    if (y < h - 1) enqueue(curr + w);
  }

  // Softly fade 1-px JPEG anti-aliased fringe pixels touching removed background
  const fringeTolSq = (tolerance + 26) * (tolerance + 26) * 3;
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const o = idx * 4;
      if (removed[idx]) {
        data[o + 3] = 0;
        continue;
      }

      const touchesRemoved =
        (x > 0 && removed[idx - 1]) ||
        (x < w - 1 && removed[idx + 1]) ||
        (y > 0 && removed[idx - w]) ||
        (y < h - 1 && removed[idx + w]);

      if (touchesRemoved) {
        const dr = data[o] - refR;
        const dg = data[o + 1] - refG;
        const db = data[o + 2] - refB;
        const distSq = dr * dr + dg * dg + db * db;
        if (distSq <= fringeTolSq) {
          data[o + 3] = 0;
          continue;
        }
      }

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (maxX <= minX || maxY <= minY) {
    return { dataUrl: canvas.toDataURL('image/png'), width: w, height: h };
  }

  const pad = 12;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(w - cropX, maxX - minX + 1 + pad * 2);
  const cropH = Math.min(h - cropY, maxY - minY + 1 + pad * 2);

  const outCanvas = document.createElement('canvas');
  outCanvas.width = cropW;
  outCanvas.height = cropH;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) {
    return { dataUrl: canvas.toDataURL('image/png'), width: w, height: h };
  }

  outCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  return {
    dataUrl: outCanvas.toDataURL('image/png'),
    width: cropW,
    height: cropH,
  };
}

export async function exportImageAsPng(
  imageUrl: string,
  targetWidth?: number,
  targetHeight?: number,
): Promise<string> {
  const img = await loadImage(imageUrl);
  const w = targetWidth ?? img.naturalWidth;
  const h = targetHeight ?? img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Contexto 2D indisponível');
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/png');
}

export function triggerDataDownload(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
