"use client";

import { HeroBannerProps } from "../../types/types";
import Button from "../Button";
import Container from "../Container";
import { ArrowRightIcon } from "../icons";
import LogosSlider from "../LogosSlider/LogosSlider";
import styles from "./HeroBanner.module.css";

export default function HeroBanner({
  headline,
  headlineHighlight,
  subheadline,
  description,
  ctaButton,
  className = "",
}: HeroBannerProps) {
  return (
    <section
      className={`${styles.heroBackground} relative sectionPadding pb-0 overflow-hidden ${className}`}
    >
      <Container maxWidth="2xl" className={`${styles.content} relative z-10`}>
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-3xl">
            <span className="text-white">{headline}</span>
            {headlineHighlight && (
              <>
                <span className="text-[#0fdac2]">{headlineHighlight}</span>
              </>
            )}
            {subheadline && (
              <>
                <span className="text-white">{subheadline}</span>
              </>
            )}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-3xl leading-relaxed">
            {description}
          </p>
          <div className="mt-4">
            <Button
              href={ctaButton.href}
              variant={ctaButton.variant || "secondary"}
              size="lg"
              icon={<ArrowRightIcon />}
              iconPosition="right"
            >
              {ctaButton.text}
            </Button>
          </div>
        </div>
      </Container>
      <LogosSlider className="mt-16" />

    </section>
  );
}

