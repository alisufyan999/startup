"use client";

import Image from "next/image";
import React from "react";
import { BRAND_LOGOS } from "./logosData";
import styles from "./LogosSlider.module.css";

const LogosSlider = ({ className }: { className?: string }) => {
  // Duplicate logos for seamless infinite loop
  const duplicatedLogos = BRAND_LOGOS && BRAND_LOGOS.length > 0 
    ? [...BRAND_LOGOS, ...BRAND_LOGOS] 
    : [];

  if (duplicatedLogos.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.logosSliderSection} ${className} py-4 md:py-6`}>
      <div className={`${styles.heroBrand} overflow-hidden whitespace-nowrap relative w-full mx-auto`}>
        <div className={`${styles.logoItems} inline-flex`}>
          {duplicatedLogos.map((logo, index) => (
            <Image
              key={`${logo.alt}-${index}`}
              src={logo.src}
              alt={logo.alt}
              className="mx-4"
              width={200}
              height={100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogosSlider;

