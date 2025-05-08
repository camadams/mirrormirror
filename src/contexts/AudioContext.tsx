"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";

interface AudioContextType {
  isPlaying: boolean;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ 
  children,
  audioSrc 
}: { 
  children: React.ReactNode;
  audioSrc: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only create the audio element once
    if (!initializedRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      initializedRef.current = true;
    }

    return () => {
      // Only clean up when the provider is unmounted completely
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioSrc]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Autoplay prevented:", error);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
