export async function processImage(imageUrl: string, gridSize = 128): Promise<{ r: number; g: number; b: number }[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Unable to get 2D context"));
  
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const cellWidth = Math.floor(img.width / gridSize);
        const cellHeight = Math.floor(img.height / gridSize);
        const grid = Array.from({ length: gridSize * gridSize }, (_, index) => {
          const x = (index % gridSize) * cellWidth;
          const y = Math.floor(index / gridSize) * cellHeight;
          const { data, width, height } = ctx.getImageData(x, y, cellWidth, cellHeight);
  
          const { r, g, b, count } = data.reduce(
            (acc, _, i) => (i % 4 === 0 ? { 
              r: acc.r + data[i], 
              g: acc.g + data[i + 1], 
              b: acc.b + data[i + 2], 
              count: acc.count + 1 
            } : acc),
            { r: 0, g: 0, b: 0, count: 0 }
          );
  
          return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
        });
  
        resolve(grid);
      };
  
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  }
  