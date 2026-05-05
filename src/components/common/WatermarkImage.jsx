import { useEffect, useState, useRef } from "react";

const WatermarkImage = ({
  src,
  alt,
  className = "w-full h-full object-cover", // ✅ sensible default
  watermarkText = "NEXTURN COMPONENTCRAFT",
  objectFit = "cover",
}) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const draw = (withWatermark = false) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    if (withWatermark) {
      const fontSize = Math.max(canvas.width * 0.04, 25);
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const stepX = canvas.width / 3;
      const stepY = canvas.height / 3;
      for (let x = stepX / 2; x < canvas.width; x += stepX) {
        for (let y = stepY / 2; y < canvas.height; y += stepY) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 4);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
    }
  };

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      setIsLoaded(true);
      draw(false);
    };
  }, [src]);

  const forceLogoDownload = () => {
    const link = document.createElement("a");
    link.href = "/nexturn.png";
    link.download = "nexturn.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    draw(true);
    forceLogoDownload();
    setTimeout(() => draw(false), 2000);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onDragStart={(event) => event.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          objectFit,
          display: isLoaded ? "block" : "none",
        }}
        title={alt}
      />

      {/* Loading placeholder matches same sizing as canvas */}
      {!isLoaded && (
        <div className={`bg-slate-100 animate-pulse ${className}`} />
      )}
    </div>
  );
};

export default WatermarkImage;
