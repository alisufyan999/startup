"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "../Container";
import VideoPopup from "../VideoPopup/VideoPopup";
import { PROFESSIONAL_ONLINE } from "../../constants";
import styles from "./ProfessionalOnline.module.css";

const ProfessionalOnline = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    
    <>
      <section className={styles.section}>
        <Container maxWidth="xl">
          <div className={styles.contentWrapper}>
            {/* Left Section */}
            <div className={styles.leftSection}>
              <h2 className={styles.heading}>
                <span className={styles.headingPart1}>
                  {PROFESSIONAL_ONLINE.heading.part1}
                </span>
                <span className={styles.headingPart2}>
                  {PROFESSIONAL_ONLINE.heading.part2}
                </span>
                <span className={styles.headingPart3}>
                  {PROFESSIONAL_ONLINE.heading.part3}
                </span>
              </h2>
              <p className={styles.description}>
                {PROFESSIONAL_ONLINE.description}
              </p>

              {/* Content Bars */}
              <div className={styles.barsContainer}>
                {PROFESSIONAL_ONLINE.contentBars.map((bar: { label: string; progress: number; color: string }, index: number) => (
                  <div key={index} className={styles.barWrapper}>
                    <div className={styles.barLabel}>
                      <span>{bar.label} :</span>
                    </div>
                    <div className={styles.barBackground}>
                      <div
                        className={`${styles.barFill} ${
                          bar.color === "purple"
                            ? styles.barFillPurple
                            : styles.barFillTeal
                        }`}
                        style={{ width: `${bar.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Video Player */}
            <div className={styles.rightSection}>
              <div
                className={styles.videoWrapper}
                onClick={() => setIsPopupOpen(true)}
              >
                {/* Video Thumbnail Container */}
                <div className={styles.videoCard}>
                  {/* Video Thumbnail */}
                  <div className={`${styles.videoThumbnail}`}>
                    {/* Person Image - Left Side */}
                    <div className={`${styles.personImageContainer}`}>
                      <Image
                        src={PROFESSIONAL_ONLINE.video.thumbnail}
                        alt="Person"
                        fill
                        className={`${styles.personImage} ms-4 max-w-[10rem]`}
                        priority
                      />
                      <div className={styles.personImageOverlay} />
                    </div>

                    {/* Overlay Text - Right Side */}
                    <div className={styles.overlayTextContainer}>
                      <p className={styles.overlayText}>
                        {PROFESSIONAL_ONLINE.video.overlayText}
                      </p>
                    </div>
                  </div>

                  {/* Play Button - Centered */}
                  <div className={styles.playButtonContainer}>
                    <div className={styles.playButton}>
                      <svg
                        className={styles.playIcon}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Heading */}
              <h3 className={styles.bottomHeading}>
                <span className={styles.bottomHeadingPart1}>
                  {PROFESSIONAL_ONLINE.bottomHeading.part1}
                </span>
                <span className={styles.bottomHeadingPart2}>
                  {PROFESSIONAL_ONLINE.bottomHeading.part2}
                </span>
                <span className={styles.bottomHeadingPart3}>
                  {PROFESSIONAL_ONLINE.bottomHeading.part3}
                </span>
              </h3>
            </div>
          </div>
        </Container>

        {/* Background Decorative Elements */}
        <div className={styles.backgroundDecoration} />
      </section>

      {/* Video Popup */}
      <VideoPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        videoUrl={PROFESSIONAL_ONLINE.video.videoUrl}
        videoTitle={PROFESSIONAL_ONLINE.video.videoTitle}
        size="lg"
      />
    </>
  );
};

export default ProfessionalOnline;

