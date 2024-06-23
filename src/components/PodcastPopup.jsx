import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import Transcript from "./Transcript";
import "./PodcastPopup.css";

const PodcastPopup = ({ open, podcast, onClose }) => {
  const spectrogramRef = useRef(null);
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  useEffect(() => {
    if (!initialRenderComplete) return;

    if (open && podcast && podcast.script && spectrogramRef.current) {
      console.log("Initializing audio and spectrogram");

      const container = spectrogramRef.current;

      const audio = document.createElement("audio");
      audio.crossOrigin = "anonymous";
      audio.controls = true;
      audio.autoplay = true;
      container.appendChild(audio);

      audioRef.current = audio;

      const handleAudioEnd = () => {
        console.log("Audio ended, updating index");
        setCurrentIndex((prevIndex) => prevIndex + 1);
      };

      audio.addEventListener("ended", handleAudioEnd);

      const audioMotion = new AudioMotionAnalyzer(container, {
        source: audio,
        height: 350,
        ansiBands: false,
        showScaleX: false,
        bgAlpha: 0,
        overlay: true,
        mode: 1,
        frequencyScale: "log",
        radial: true,
        showPeaks: false,
        channelLayout: "dual-vertical",
        smoothing: 0.7,
        gradient: "prism",
      });

      console.log("AudioMotionAnalyzer initialized");

      return () => {
        console.log("Cleaning up");
        audioMotion.destroy();
        audio.removeEventListener("ended", handleAudioEnd);
        if (container.contains(audio)) {
          container.removeChild(audio);
        }
      };
    }
  }, [open, podcast, initialRenderComplete]);

  useEffect(() => {
    if (!initialRenderComplete) return;

    if (open && podcast && podcast.script && audioRef.current) {
      const audio = audioRef.current;
      if (currentIndex < podcast.script.length) {
        console.log(`Setting audio source for index ${currentIndex}`);
        audio.src = `data:audio/mp3;base64,${podcast.script[currentIndex].audio}`;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        });
      } else {
        console.log("No more audio to play");
      }
    }
  }, [currentIndex, open, podcast, initialRenderComplete]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {podcast.title}
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="podcast-container">
          <div className="audio-container" ref={spectrogramRef}></div>
          <div id="transcript-container">
            <Transcript
              transcript={podcast.script}
              currentIndex={currentIndex}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PodcastPopup;
