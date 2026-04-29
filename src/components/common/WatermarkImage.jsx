import { useEffect, useState, useRef } from "react";

const WatermarkImage = ({
  src,
  alt,
  className,
  watermarkText = "NEXTURN COMPONENTCRAFT",
  objectFit = "cover",
}) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to draw the image to canvas
  const draw = (withWatermark = false) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw base image
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
      draw(false); // Draw clean version initially
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

  // Intercept right-click save and force logo download instead
  const handleContextMenu = (event) => {
    event.preventDefault();
    draw(true);
    forceLogoDownload();
    setTimeout(() => draw(false), 2000);
  };

  return (
    <div
      className={`overflow-hidden ${className}`}
      onContextMenu={handleContextMenu}
      onDragStart={(event) => event.preventDefault()}
    >
      {/* The Canvas hides the 'src' URL from Inspect Element */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          display: isLoaded ? "block" : "none",
        }}
        title={alt}
      />

      {/* Loading state to prevent white box */}
      {!isLoaded && (
        <div className="w-full h-full bg-slate-100 animate-pulse" />
      )}
    </div>
  );
};

export default WatermarkImage;
