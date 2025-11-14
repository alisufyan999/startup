"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";

import styles from "./AiTeamSection.module.css";

type TabId = "creative" | "marketing" | "development" | "growth";

const TABS: { id: TabId; label: string }[] = [
  { id: "creative", label: "Creative & Design" },
  { id: "marketing", label: "Marketing & Growth" },
  { id: "development", label: "Development" },
  { id: "growth", label: "Key Growth" },
];

const TAB_CONTENT: Record<
  TabId,
  {
    title: string;
    subtitle: string;
    tags: string[];
    cta: string;
  }
> = {
  creative: {
    title: "Brand Designer",
    subtitle: "Builds The Foundation of Your Brand.",
    tags: [
      "Logo Design",
      "Brand Guidelines",
      "Color Palette",
      "Typography System",
      "Social Templates",
      "Rebrand Plan",
      "Business Cards",
      "Email Signature",
      "Icon Set",
      "Mockups",
      "Packaging",
      "Stationery",
      "Uniform Branding",
    ],
    cta: "Hire Brand Designer",
  },
  marketing: {
    title: "Marketing Strategist",
    subtitle: "Turns Attention Into Profitable Growth.",
    tags: [
      "Campaign Strategy",
      "Funnel Mapping",
      "Email Flows",
      "Ad Creative Briefs",
      "Landing Pages",
      "A/B Testing",
      "Offer Positioning",
      "Launch Calendars",
      "Audience Research",
    ],
    cta: "Hire Marketing Strategist",
  },
  development: {
    title: "Product Developer",
    subtitle: "Builds Fast, Stable, Conversion-Focused Experiences.",
    tags: [
      "Web Apps",
      "Landing Pages",
      "Integrations",
      "Automation Flows",
      "Performance Tuning",
      "Analytics Setup",
      "Tracking Events",
      "Technical SEO",
    ],
    cta: "Hire Product Developer",
  },
  growth: {
    title: "Key Growth Manager",
    subtitle: "Aligns Strategy, Execution, And Ongoing Optimization.",
    tags: [
      "Growth Roadmap",
      "KPI Tracking",
      "Experiment Backlog",
      "Reporting",
      "Channel Strategy",
      "Team Coordination",
      "Quarterly Planning",
      "Retention Initiatives",
    ],
    cta: "Hire Growth Manager",
  },
};

export default function AiTeamSection() {
  const [activeTab, setActiveTab] = useState<TabId>("creative");

  const content = TAB_CONTENT[activeTab];

  return (
    <section className={styles.section}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            Meet Your <span className={styles.aiText}>AI-Empowered</span> Team
            Behind Your Growth
          </h2>
          <p className="mt-5 text-sm md:text-base text-slate-300 leading-relaxed">
            When you bring on your Smart Marketing AI Team, you&apos;re not
            hiring freelancers — you&apos;re unlocking a complete digital
            department. Each role blends human expertise with AI precision to
            move your marketing faster, smarter, and farther than ever. Every
            deliverable builds lasting value for your business.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex justify-center">
          <div className={styles.tabsWrapper}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.tabActive : styles.tabInactive
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical slider – 3 cards per tab, scroll with mouse wheel */}
        <div className={`mt-10 ${styles.sliderWrapper}`}>
          <Swiper
            direction="vertical"
            slidesPerView={1}
            spaceBetween={0}
            mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
            modules={[Mousewheel]}
            className={styles.swiper}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <SwiperSlide key={`${activeTab}-${index}`}>
                <div
                  className={`${styles.card} ${styles.cardFade} flex flex-col gap-8 md:flex-row md:items-stretch`}
                >
                  {/* Left: text */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {content.title}
                    </h3>
                    <p className="mt-1 text-sm md:text-base font-semibold text-emerald-400">
                      {content.subtitle}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {content.tags.map((tag) => (
                        <span key={tag} className={styles.chip}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={`${styles.ctaButton} mt-7 inline-flex items-center gap-2 text-sm md:text-base font-semibold`}
                    >
                      {content.cta}
                      <span className="text-lg">↗</span>
                    </button>
                  </div>

                  {/* Right: avatar */}
                  <div className="relative flex flex-1 justify-center md:justify-end">
                    <Image
                      src="/assets/images/2.png"
                      alt="AI Team Section Avatar"
                      width={300}
                      height={300}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
