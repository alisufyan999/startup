"use client";

import Container from "../Container";
import { REVIEWS_SECTION } from "../../constants";
import styles from "./Reviews.module.css";

export default function Reviews() {

  return (
    <>
      <section className={styles.section}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <div className={styles.header}>
            <h2 className={styles.heading}>
              <span className="text-white">
                {REVIEWS_SECTION.heading.part1}
              </span>
              <span className="text-[#0fdac2]">
                {REVIEWS_SECTION.heading.part2}
              </span>
            </h2>
            <div className={styles.subtitleContainer}>
              <p className={styles.subtitle}>{REVIEWS_SECTION.subtitle}</p>
            </div>
            <p className={styles.ctaText}>
              See how{" "}
              <span className="text-[#0fdac2]">Smart Marketing AI Teams</span>{" "}
              turned invisibility into daily inquiries
            </p>
          </div>

          {/* Rating Badges */}
          <div className={styles.badgesContainer}>
            {REVIEWS_SECTION.ratingBadges.map((badge, index) => (
              <div
                key={index}
                className={styles.badge}               
              >
                <div className={styles.badgeLogo}>
                  {badge.platform === "Trustpilot" && (
                    <img src="/assets/images/trust-pilot.webp" alt="Google Logo" className={styles.trustpilotLogo}/>
                  )}
                  {badge.platform === "Google" && (
                   <img src="/assets/images/google.webp" alt="Google Logo" className={styles.googleLogo}/>
                  )}
                  {badge.platform === "Facebook" && (
                    <img src="/assets/images/facebook.webp" alt="Facebook Logo" className={styles.facebookLogo}/>
                  )}
                </div>
                <span className={styles.badgeRating}>
                  Rated {badge.rating}
                </span>
              </div>
            ))}
          </div>

          {/* Reviews Masonry */}
          <div className={styles.reviewsMasonry}>
            {REVIEWS_SECTION.reviews.map((review, index) => {
              // Card 3 (index 2) and Card 6 (index 5) should have borders
              const hasBorder = index === 2 || index === 5;
              return (
              <div
                key={review.id}
                className={`${styles.reviewCard} ${
                  hasBorder ? styles.highlightedCard : ""
                }`}
              >
                <div className={styles.reviewCardContent}>
                {/* Avatar, Name, and Stars Row */}
                <div className={styles.reviewHeader}>
                  <div className={styles.avatar}>
                    <span>{review.initials}</span>
                  </div>
                  <div className={styles.reviewerInfo}>
                    <h3 className={styles.reviewerName}>{review.name}</h3>
                    <p className={styles.reviewSource}>
                      {review.source} - {review.date}
                    </p>
                  </div>
                  {/* Star Rating - positioned to the right */}
                  <div className={styles.starRating}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#0fdac2"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className={styles.reviewText}>{review.text}</p>

                {/* Video Player (if video review - shown after text) */}
                {review.isVideo && (
                  <div className={styles.videoContainer}>
                    <video
                      src='/assets/images/videoplayback.mp4'
                      controls
                      className={styles.videoElement}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                </div>
              </div>
            );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

