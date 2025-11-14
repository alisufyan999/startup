"use client";

import { useEffect } from "react";
import styles from "./VideoPopup.module.css";

type VideoPopupSize = "sm" | "md" | "lg" | "xl" | "xxl";

interface VideoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  videoTitle?: string;
  size?: VideoPopupSize;
}

const VideoPopup = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  videoTitle = "Video player",
  size = "lg"
}: VideoPopupProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Check if videoUrl is a local video file
  const isLocalVideo = videoUrl && (
    videoUrl.endsWith('.mp4') || 
    videoUrl.endsWith('.webm') || 
    videoUrl.endsWith('.ogg') ||
    videoUrl.endsWith('.mov')
  );

  return (
    <div
      className={`${styles.popupOverlay} ${isOpen ? styles.fadeIn : ""}`}
      onClick={onClose}
    >
      <div
        className={`${styles.popupContent} ${styles[`size${size === "sm" ? "Sm" : size === "md" ? "Md" : size === "lg" ? "Lg" : size === "xl" ? "Xl" : "Xxl"}`]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close video"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Video Container */}
        <div className={styles.videoContainer}>
          {isLocalVideo ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className={styles.videoElement}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoIframe}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;

