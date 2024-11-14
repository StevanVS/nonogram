export function getImageSrc(tiles: string[] | number[], width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  tiles.forEach((value, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    if (typeof value === 'number') {
      ctx.fillStyle = value === 1 ? '#000' : '#fff';
    } else {
      ctx.fillStyle = value;
    }
    ctx.fillRect(x, y, 1, 1);
  });

  const dataURL = canvas.toDataURL("image/png");

  return dataURL;
}
