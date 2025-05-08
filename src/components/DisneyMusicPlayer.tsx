"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useAudio } from "@/contexts/AudioContext";

export default function DisneyMusicPlayer() {
  const { isPlaying, togglePlayPause } = useAudio();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full bg-card/80 backdrop-blur-sm hover:bg-card shadow-md p-3"
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title="Disney soundtrack"
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4 text-primary" />
        ) : (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
