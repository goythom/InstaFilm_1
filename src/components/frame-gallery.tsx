"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { FRAME_CONFIG } from "@/lib/constants";
import { Download, Trash2 } from "lucide-react";
import type { GeneratedFrame } from "@/app/page";
import * as React from "react";
import { ScrollArea } from "./ui/scroll-area";

interface FrameGalleryProps {
    frames: GeneratedFrame[];
    onRemoveSelected: (ids: string[]) => void;
}

export default function FrameGallery({ frames, onRemoveSelected }: FrameGalleryProps) {
    const [selectedFrames, setSelectedFrames] = React.useState<string[]>([]);

    const handleDownload = (imageSrc: string, filename: string) => {
        const link = document.createElement("a");
        link.href = imageSrc;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadSelected = () => {
        selectedFrames.forEach((frameId, index) => {
            const frame = frames.find(f => f.id === frameId);
            if (frame) {
            handleDownload(frame.imageSrc, `instant-frame-${index + 1}.png`);
            }
        });
    }

    const handleDeleteSelected = () => {
        onRemoveSelected(selectedFrames);
        setSelectedFrames([]);
    }

    const toggleFrameSelection = (id: string) => {
        setSelectedFrames(prev => 
            prev.includes(id) ? prev.filter(frameId => frameId !== id) : [...prev, id]
        );
    }
    
    return (
        <Card className="flex flex-col h-full bg-card">
            <CardContent className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Frame Gallery</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownloadSelected} disabled={selectedFrames.length === 0}>
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={selectedFrames.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
                
                <ScrollArea className="flex-1 rounded-lg border bg-secondary">
                    <div className="p-4">
                        {frames.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8 min-h-[400px]">
                                <p>Your generated frames will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {frames.map((frame) => (
                                    <div key={frame.id} className="group relative" onClick={() => toggleFrameSelection(frame.id)}>
                                        <div className="absolute top-2 right-2 z-10">
                                             <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-accent bg-background border-border rounded focus:ring-accent"
                                                checked={selectedFrames.includes(frame.id)}
                                                onClick={(event) => event.stopPropagation()}
                                                onChange={() => toggleFrameSelection(frame.id)}
                                            />
                                        </div>
                                        <div
                                            className={`overflow-hidden rounded-md border-2 ${selectedFrames.includes(frame.id) ? 'border-accent' : 'border-transparent'}`}
                                            style={{ aspectRatio: `${FRAME_CONFIG[frame.frameType].aspectRatio}` }}
                                        >
                                            <img src={frame.imageSrc} alt="Generated frame" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
                 <Button size="lg" className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90" disabled>
                    Generate Album Photo
                </Button>
            </CardContent>
        </Card>
    );
}
