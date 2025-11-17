"use client";

import { useState, useEffect } from "react";
import { InlineWidget } from "react-calendly";
import Container from "../Container";
import styles from "./CalendlySection.module.css";
import Button from "../Button";

interface CalendlySectionProps {
  heading?: {
    part1: string;
    part2: string;
    part3: string;
  };
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  calendlyUrl: string;
  calendlyText?: string;
  className?: string;
}

const CalendlySection = ({
  heading = {
    part1: "Let's Talk About Taking",
    part2: "Marketing",
    part3: "Off Your Plate",
  },
  description = "Book a quick video call to see how your Smart Marketing AI Team can free you to run jobs while your digital presence runs itself",
  buttonText = "Free Up Your Time",
  buttonHref = "/get-started",
  calendlyUrl = "https://calendly.com/md-hasnain-developer/30min?month=2025-11",
  calendlyText = "In minutes, you'll see examples of what your team can handle — ads, social, website, graphics — and how it all works together seamlessly",
  className = "",
}: CalendlySectionProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Log URL for debugging
    if (calendlyUrl) {
      console.log('Calendly URL:', calendlyUrl);
    }
  }, [calendlyUrl]);

  return (
    <section className={`${styles.calendlySection} ${className}`}>
      <Container maxWidth="xl">
        <div className={styles.contentWrapper}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            <h2 className={styles.heading}>
              <span className={styles.headingPart1}>{heading.part1}</span>
              <span className={styles.headingPart2}>{heading.part2}</span>
              <span className={styles.headingPart3}>{heading.part3}</span>
            </h2>

            <p className={styles.description}>{description}</p>

            <div className={styles.buttonWrapper}>
              <Button href={buttonHref} variant="secondary" size="lg">
                <span>{buttonText}</span>
                <div className={styles.playIconContainer}>
                  <svg
                    className={styles.playIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </Button>
            </div>
          </div>

          {/* Right Section - Calendly Widget */}
          <div className={styles.rightSection}>
            <div className={styles.calendlyContainer}>
              <div className={styles.calendlyWrapper}>
                {calendlyUrl && isMounted ? (
                  <InlineWidget 
                    url={calendlyUrl}
                    styles={{
                      height: '650px',
                      minHeight: '650px'
                    }}
                    pageSettings={{
                      backgroundColor: 'ffffff',
                      hideEventTypeDetails: false,
                      hideLandingPageDetails: false,
                      primaryColor: '643bff',
                      textColor: '4d5055'
                    }}
                  />
                ) : (
                  <div className={styles.placeholderMessage}>
                    <div className={styles.placeholderIcon}>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <h3 className={styles.placeholderTitle}>Loading Calendar...</h3>
                  </div>
                )}
              </div>
            </div>

            <p className={styles.calendlyText}>{calendlyText}</p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CalendlySection;
