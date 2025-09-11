"use client";

import { Camera, Image as ImageIcon, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const menuItems = [
    { id: 'generate', label: 'Generate Frames', icon: Camera },
    { id: 'gallery', label: 'Album Studio', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-secondary/30 p-6 flex flex-col justify-between border-r">
      <div>
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-primary text-primary-foreground rounded-full p-3 mb-3">
            <Camera size={28} />
          </div>
          <h1 className="text-xl font-bold">InstantFrame</h1>
          <p className="text-sm text-muted-foreground">Frame print generator</p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">CREATE & MANAGE</p>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    activeView === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
