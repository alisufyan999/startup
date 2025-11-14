"use client";

import Image from "next/image";
import Container from "../Container";
import Button from "../Button";
import { ArrowRightIcon } from "../icons";
import styles from "./CTABanner.module.css";

interface CTABannerProps {
  question?: string;
  questionHighlight?: string;
  buttonText?: string;
  buttonHref?: string;
  backgroundImage?: string;
  className?: string;
}

const CTABanner = ({
  question = "What's Your",
  questionHighlight = "Challenge",
  buttonText = "Let's Get Your Marketing Handled",
  buttonHref = "/get-started",
  backgroundImage = "/assets/images/cta-banner.webp",
  className = "",
}: CTABannerProps) => {
  return (
    <section className={`${styles.ctaBanner} ${className} relative overflow-hidden`}>
      {/* Content */}
      <Container maxWidth="xl" className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Left Side - Question */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center md:text-left">
              <span className="text-white">{question} </span>
              <span className="text-[#0fdac2]">{questionHighlight}</span>
              <span className="text-white">?</span>
            </h2>
          </div>

          {/* Right Side - Button */}
          <div className="flex-shrink-0">
            <Button
              href={buttonHref}
              variant="secondary"
              size="lg"
              icon={<ArrowRightIcon style={{ fill: "#fff" }} />}
              iconPosition="right"
              className="whitespace-nowrap"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTABanner;

