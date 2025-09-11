"use client";

import * as React from "react";
import type { FrameType } from "@/lib/constants";
import FrameGallery from "@/components/frame-gallery";
import Editor from "@/components/editor";
import AppSidebar from "@/components/app-sidebar";
import AlbumEditor from "@/components/album-editor";

export type GeneratedFrame = {
  id: string;
  imageSrc: string;
  frameType: FrameType;
  caption: string;
};

const initialFrames: GeneratedFrame[] = [];


export default function Home() {
  const [frames, setFrames] = React.useState<GeneratedFrame[]>(initialFrames);
  const [activeFrameType, setActiveFrameType] = React.useState<FrameType>("instax");
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState<string>("");
  const [captionSize, setCaptionSize] = React.useState(24);
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = React.useState('generate');

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };
  
  const generateFrameDataUrl = async () => {
    if (!uploadedImage) return null;

    const {FRAME_CONFIG} = await import("@/lib/constants");
    const canvas = document.createElement("canvas");
    const frame = FRAME_CONFIG[activeFrameType];
    const originalImage = new Image();
    originalImage.src = uploadedImage;

    await new Promise(resolve => originalImage.onload = resolve);

    canvas.width = frame.print.width;
    canvas.height = frame.print.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    ctx.fillStyle = "#ffffff"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const imageArea = frame.imageAreaPrint;
    const imageAreaX = (frame.print.width - imageArea.width) / 2;
    const imageAreaY = (canvas.height * frame.borderTop);

    ctx.save();
    ctx.beginPath();
    ctx.rect(imageAreaX, imageAreaY, imageArea.width, imageArea.height);
    ctx.clip();

    const imgAR = originalImage.width / originalImage.height;
    const areaAR = imageArea.width / imageArea.height;
    
    let dWidth, dHeight;

    if (imgAR > areaAR) {
      dHeight = imageArea.height;
      dWidth = dHeight * imgAR;
    } else {
      dWidth = imageArea.width;
      dHeight = dWidth / imgAR;
    }

    dWidth *= zoom;
    dHeight *= zoom;
    
    const dx = imageAreaX + (imageArea.width - dWidth) / 2 + position.x;
    const dy = imageAreaY + (imageArea.height - dHeight) / 2 + position.y;

    ctx.drawImage(originalImage, dx, dy, dWidth, dHeight);
    ctx.restore();

    if (caption) {
      ctx.fillStyle = "#202020";
      const fontSize = (captionSize / 24) * 40;
      ctx.font = `bold ${fontSize}px 'Caveat', cursive`;
      ctx.textAlign = "center";
      const captionY = imageAreaY + imageArea.height + (frame.print.height - (imageAreaY + imageArea.height)) / 2 + (fontSize/3);
      ctx.fillText(caption, canvas.width / 2, captionY);
    }
    
    return canvas.toDataURL("image/png");
  }


  const handleAddFrame = async () => {
    const imageSrc = await generateFrameDataUrl();
    if (!imageSrc) return;

    const newFrame: GeneratedFrame = {
      id: new Date().toISOString(),
      imageSrc: imageSrc,
      frameType: activeFrameType,
      caption: caption,
    };

    setFrames(prev => [newFrame, ...prev]);
  };

  const handleDownloadCurrentFrame = async () => {
    const imageSrc = await generateFrameDataUrl();
    if (!imageSrc) return;
    
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = "instant-frame.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const handleRemoveSelectedFrames = (ids: string[]) => {
    setFrames(frames.filter(frame => !ids.includes(frame.id)));
  };

  const handleReset = () => {
    setUploadedImage(null);
    setCaption("");
    setCaptionSize(24);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {activeView === 'generate' && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold">InstantFrame Generator</h1>
              <p className="text-muted-foreground">Create authentic film print</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <Editor
                uploadedImage={uploadedImage}
                onImageUpload={handleImageUpload}
                activeFrameType={activeFrameType}
                setActiveFrameType={setActiveFrameType}
                caption={caption}
                setCaption={setCaption}
                captionSize={captionSize}
                setCaptionSize={setCaptionSize}
                onDownloadCurrentFrame={handleDownloadCurrentFrame}
                onReset={handleReset}
                onAddFrame={handleAddFrame}
                zoom={zoom}
                setZoom={setZoom}
                position={position}
                setPosition={setPosition}
              />
              <FrameGallery
                frames={frames}
                onRemoveSelected={handleRemoveSelectedFrames}
              />
            </div>
          </>
        )}
        {activeView === 'gallery' && (
          <div className="max-w-7xl mx-auto flex flex-col h-full">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">Album Studio</h1>
                <p className="text-muted-foreground">Arrange and export your frames.</p>
              </div>
              <AlbumEditor frames={frames} />
          </div>
        )}
      </main>
    </div>
  );
}
