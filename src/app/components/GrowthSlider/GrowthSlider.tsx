"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Container from "../Container";
import styles from "./GrowthSlider.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowRightIcon } from "../icons";

type Guide = {
  id: string;
  image: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  href: string;
};

export default function GrowthSlider({ items }: { items: Guide[] }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isSwiperReady, setIsSwiperReady] = useState(false);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    if (swiperRef.current) {
      setIsSwiperReady(true);
    }
  }, []);

  return (
    <section className={styles.section}>
      <Container maxWidth="xl">
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Growth <span className={styles.titleGradient}>Guides</span>
          </h2>
        </div>

        <div className={styles.swiperWrapper}>
          <button
            onClick={handlePrev}
            aria-label="Previous"
            disabled={isBeginning}
            className={`${styles.navButton} ${styles.navButtonLeft}`}
          >
            <span className={styles.arrowIcon}>‹</span>
          </button>
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
              setIsSwiperReady(true);
            }}
            onSlideChange={handleSlideChange}
            onResize={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            className={`${styles.swiperContainer} ${isSwiperReady ? styles.swiperReady : ''}`}
          >
            {items.map((it) => (
              <SwiperSlide key={it.id}>
                <article className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={it.image}
                      alt={it.title}
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.category}>
                    <span className={styles.categoryTag}>{it.category}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{it.title}</h3>

                  <div className={styles.metadata}>
                    <span className={styles.metadataItem}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.icon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{it.date}</span>
                    </span>
                    <span>•</span>
                    <span>{it.readTime}</span>
                  </div>

                  <p className={styles.excerpt}>{it.excerpt}</p>

                  <div className={styles.readButtonWrapper}>
                    <a href={it.href} className={styles.readButton}>
                      Read Now &nbsp; <ArrowRightIcon />
                    </a>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            onClick={handleNext}
            aria-label="Next"
            disabled={isEnd}
            className={`${styles.navButton} ${styles.navButtonRight}`}
          >
            <span className={styles.arrowIcon}>›</span>
          </button>
        </div>
      </Container>
    </section>
  );
}
