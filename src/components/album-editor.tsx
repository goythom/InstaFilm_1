
"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Download, ZoomIn, ZoomOut, Minimize2, ArrowLeft, ArrowRight, BookOpen, Book } from "lucide-react";
import type { GeneratedFrame } from "@/app/page";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface AlbumEditorProps {
  frames: GeneratedFrame[];
}

const PageContent = ({ pageFrames }: { pageFrames: GeneratedFrame[] }) => (
    <div className="w-1/2 h-full bg-[#0f0f0f] p-1 box-border border-black border-[12px]">
      <div className="w-full h-full bg-[#0f0f0f] relative">
        {pageFrames.map((frame, index) => {
          const pos = {
            top: `${10 + (index % 2) * 45}%`,
            left: `${10 + Math.floor(index / 2) * 45}%`,
          };
          return (
            <div key={frame.id} className="absolute bg-white p-1 rounded-sm shadow-md flex flex-col" style={{ 
              top: pos.top, 
              left: pos.left,
              width: '40%',
              cursor: 'move'
            }}>
              <img src={frame.imageSrc} alt="Album frame" className="w-full h-auto object-contain" />
            </div>
          )
        })}
      </div>
    </div>
  );

export default function AlbumEditor({ frames }: AlbumEditorProps) {
  const [zoom, setZoom] = React.useState(1);
  const [isNotebookOpen, setIsNotebookOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const framesPerPage = 8;
  const totalPages = 4;


  const handleDownloadPdf = () => {
    alert("PDF download functionality coming soon!");
  };
  
  const handleNextPage = () => {
    setPage(p => Math.min(p + 1, totalPages - 1));
  }

  const handlePrevPage = () => {
    setPage(p => Math.max(p - 1, 0));
  }

  const startIndex = page * framesPerPage;
  const endIndex = startIndex + framesPerPage;
  const currentFrames = frames.slice(startIndex, endIndex);

  const leftPageFrames = currentFrames.slice(0, 4);
  const rightPageFrames = currentFrames.slice(4, 8);
  

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b bg-background rounded-t-lg gap-2">
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}><ZoomOut /> Zoom Out</Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(2, z + 0.1))}><ZoomIn /> Zoom In</Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(1)}><Minimize2 /> Fit</Button>
            <Button variant="outline" size="sm" disabled>{Math.round(zoom * 100)}%</Button>
        </div>

        <div className="flex items-center gap-2">
           {isNotebookOpen && (
            <>
              <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={page === 0}><ArrowLeft /></Button>
              <span>Page {page + 1} of {totalPages}</span>
              <Button variant="outline" size="icon" onClick={handleNextPage} disabled={page >= totalPages -1}><ArrowRight /></Button>
            </>
          )}
          <Button onClick={() => setIsNotebookOpen(true)} disabled={isNotebookOpen} className="bg-black text-white hover:bg-gray-800">
            <BookOpen className="mr-2" />
            Open
          </Button>
          <Button onClick={() => setIsNotebookOpen(false)} disabled={!isNotebookOpen} className="bg-black text-white hover:bg-gray-800">
            <Book className="mr-2" />
            Close
          </Button>
          <Button onClick={handleDownloadPdf} className="bg-black text-white hover:bg-gray-800">
            <Download className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

       <div className="flex-1 w-full flex items-center justify-center p-8 bg-white">
        <div 
          className="relative w-full max-w-6xl [filter:drop-shadow(0_10px_8px_rgba(0,0,0,0.25))]"
          style={{ 
            aspectRatio: '2/1.414',
            transform: `scale(${zoom})`, 
            transformOrigin: 'center', 
            transition: 'transform 0.2s ease'
          }}
        >
          {!isNotebookOpen ? (
             <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/2 h-full flex flex-col items-center justify-center text-white p-1 bg-black border-black border-[12px]">
                <div className="w-full h-full bg-[#0f0f0f] flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-bold font-serif mb-4">InstaVintage Album</h2>
                    <p className="text-muted-foreground mb-8">Your generated frames are saved here.</p>
                    <Button size="lg" onClick={() => setIsNotebookOpen(true)} variant="secondary">
                      <BookOpen className="mr-2" />
                      Open Notebook
                    </Button>
                </div>
              </div>
            </div>
          ) : (
             <div className="w-full h-full flex box-border">
                <PageContent pageFrames={leftPageFrames} />
                <PageContent pageFrames={rightPageFrames} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
