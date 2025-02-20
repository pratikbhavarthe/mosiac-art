import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

interface MosaicArtProps {
  mosaic: { emoji: string }[];
  gridSize?: number;
  backgroundColor?: string;
}

export default function MosaicArt({ mosaic, gridSize = 128, backgroundColor = "black" }: MosaicArtProps) {
  const mosaicRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState(backgroundColor);

  const handleDownload = async () => {
    if (!mosaicRef.current) return;
    const canvas = await html2canvas(mosaicRef.current, {
      scale: 2,
      useCORS: true,
      width: mosaicRef.current.scrollWidth,
      height: mosaicRef.current.scrollHeight,
      backgroundColor: bgColor,
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "mosaic.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center m-4">
      <div className="flex items-center">
        <label htmlFor="color" className="text-2xl">Change background color</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="rounded-md m-4 w-16 cursor-pointer"
        />
      </div>
      <button 
        className="bg-black px-4 py-3 rounded-md hover:text-gray-400 border border-gray-400 m-4"
        onClick={handleDownload}
      >
        Download Mosaic
      </button>
      <div
        ref={mosaicRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: "1px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: bgColor,
        }}
        className="h-auto w-fit"
      >
        {mosaic.map((cell, index) => (
          <div key={index} style={{ fontSize: "4px" }}>{cell.emoji}</div>
        ))}
      </div>
    </div>
  );
}
