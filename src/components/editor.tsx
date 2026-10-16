"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FRAME_CONFIG, IMAGE_FILTERS, type FrameType, type ImageFilter } from "@/lib/constants";
import { Image as ImageIcon, RefreshCcw, ZoomIn, Move, Plus } from "lucide-react";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";


interface EditorProps {
  uploadedImage: string | null;
  onImageUpload: (file: File) => void;
  activeFrameType: FrameType;
  setActiveFrameType: (type: FrameType) => void;
  caption: string;
  setCaption: (caption: string) => void;
  captionSize: number;
  setCaptionSize: (size: number) => void;
  onDownloadCurrentFrame: () => void;
  onReset: () => void;
  onAddFrame: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  imageFilter: ImageFilter;
  setImageFilter: (filter: ImageFilter) => void;
}

export default function Editor({
  uploadedImage,
  onImageUpload,
  activeFrameType,
  setActiveFrameType,
  caption,
  setCaption,
  captionSize,
  setCaptionSize,
  onDownloadCurrentFrame,
  onReset,
  onAddFrame,
  zoom,
  setZoom,
  position,
  setPosition,
  imageFilter,
  setImageFilter,
}: EditorProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const frameConfig = FRAME_CONFIG[activeFrameType];
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPosition({ x: position.x + dx, y: position.y + dy });
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const TabTrigger = ({ value, children }: { value: FrameType, children: React.ReactNode }) => (
    <button
      onClick={() => setActiveFrameType(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
        activeFrameType === value
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
  
  return (
    <Card className="flex flex-col w-full bg-card">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-4 flex-1">
            <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
                <TabTrigger value="instax">
                    <ImageIcon className="h-4 w-4" /> Instax Mini
                </TabTrigger>
                <TabTrigger value="polaroid">
                     <ImageIcon className="h-4 w-4" /> Polaroid
                </TabTrigger>
            </div>
            
            <div 
                className="relative w-full max-w-[300px] bg-white rounded-lg overflow-hidden border"
                style={{ aspectRatio: `${frameConfig.aspectRatio}` }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="absolute inset-0 flex flex-col bg-white" >
                    <div 
                        className="flex-grow min-h-0 bg-gray-200 w-[92%] mx-auto mt-[4%] relative overflow-hidden rounded-sm"
                        style={{
                            cursor: uploadedImage ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => !uploadedImage && inputRef.current?.click()}
                    >
                        {uploadedImage ? (
                          <img
                            src={uploadedImage}
                            alt="Uploaded photo preview"
                            draggable={false}
                            className="absolute inset-0 h-full w-full select-none object-cover"
                            style={{
                              filter: IMAGE_FILTERS[imageFilter].value,
                              objectPosition: 'center',
                              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                              transformOrigin: 'center center',
                              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            }}
                          />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-center text-gray-500 p-4">
                                <div onClick={() => inputRef.current?.click()}>
                                    <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                                    <span className="text-sm">Drag & drop or click to upload</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0 h-[20%] flex items-center justify-center">
                        <Input
                            placeholder="XXXX"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="text-center w-full h-full border-none focus:ring-0 placeholder:text-gray-400 bg-transparent font-serif tracking-wider text-4xl font-bold text-black"
                        />
                    </div>
                </div>
            </div>

            <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                ref={inputRef}
                onChange={handleFileChange}
            />
            
            <div className="w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ZoomIn className="h-4 w-4" />
                        <span>{Math.round(zoom * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Move className="h-4 w-4" />
                        <span>Drag to position</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => inputRef.current?.click()}>
                        Upload New Photo
                    </Button>
                    <Button variant="outline" onClick={onReset}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>

                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Color format</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(IMAGE_FILTERS) as ImageFilter[]).map((filter) => (
                      <Button
                        key={filter}
                        type="button"
                        variant={imageFilter === filter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setImageFilter(filter)}
                      >
                        {IMAGE_FILTERS[filter].name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="caption-size" className="text-muted-foreground">Caption Size: {captionSize}px</Label>
                    <Slider
                        id="caption-size"
                        value={[captionSize]}
                        min={12}
                        max={40}
                        step={1}
                        onValueChange={(value) => setCaptionSize(value[0])}
                        disabled={!caption}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={onDownloadCurrentFrame} variant="outline" disabled={!uploadedImage} className="w-full">
                        Download Frame
                    </Button>
                    <Button onClick={onAddFrame} disabled={!uploadedImage} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Gallery
                    </Button>
                 </div>
            </div>
        </CardContent>
    </Card>
  );
}
