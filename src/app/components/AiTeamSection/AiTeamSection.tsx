"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./AiTeamSection.module.css";

gsap.registerPlugin(ScrollTrigger);

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
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const previousTabRef = useRef<TabId>(activeTab);
  const isMountedRef = useRef(true);

  const content = TAB_CONTENT[activeTab];

  // Cleanup BEFORE React updates DOM - useLayoutEffect runs synchronously
  useLayoutEffect(() => {
    // Get the PREVIOUS tab (before it changed)
    const previousTab = previousTabRef.current;
    
    // Only cleanup if tab actually changed
    if (previousTab !== activeTab) {
      // Collect all triggers to kill
      const triggersToKill: ScrollTrigger[] = [];
      
      // Collect triggers from ref
      triggersRef.current.forEach((trigger) => {
        if (trigger) {
          triggersToKill.push(trigger);
        }
      });

      // Collect triggers with matching IDs for previous tab
      ScrollTrigger.getAll().forEach((trigger) => {
        try {
          const triggerId = trigger.vars?.id?.toString() || "";
          if (triggerId.startsWith(`pin-${previousTab}`) || triggerId.startsWith(`scale-${previousTab}`)) {
            triggersToKill.push(trigger);
          }
        } catch (e) {
          // Ignore errors
        }
      });

      // Kill all triggers synchronously
      // First, manually restore any pinned elements to their original state
      triggersToKill.forEach((trigger) => {
        try {
          if (trigger && trigger.vars?.pin) {
            const element = trigger.trigger;
            if (element instanceof HTMLElement && document.contains(element)) {
              // Manually restore transform and position
              gsap.set(element, { clearProps: "all" });
              // Remove any inline styles added by ScrollTrigger
              element.style.transform = "";
              element.style.position = "";
              element.style.top = "";
              element.style.left = "";
              element.style.width = "";
              element.style.height = "";
            }
          }
        } catch (e) {
          // Ignore errors during restoration
        }
      });

      // Now kill all triggers
      triggersToKill.forEach((trigger) => {
        try {
          if (trigger) {
            trigger.disable();
            trigger.kill(false); // Kill without DOM cleanup since we already restored
          }
        } catch (e) {
          // Silently ignore errors - trigger might already be killed
        }
      });

      // Clear the ref
      triggersRef.current = [];
      
      // Update previous tab ref
      previousTabRef.current = activeTab;
    }
  }, [activeTab]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cleanup all triggers on unmount
      triggersRef.current.forEach((trigger) => {
        try {
          if (trigger) {
            trigger.kill(false);
          }
        } catch (e) {
          // Ignore errors
        }
      });
      triggersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const cardsContainer = cardsContainerRef.current;
    if (!cardsContainer || !isMountedRef.current) return;

    // Store all ScrollTriggers for cleanup
    const triggers: ScrollTrigger[] = [];

    // Small delay to ensure DOM is ready and cleanup from useLayoutEffect is complete
    const timeoutId = setTimeout(() => {
      // Check if still mounted and container still exists
      if (!isMountedRef.current || !cardsContainerRef.current) return;

      // Get all cards for current tab
      const cards = gsap.utils.toArray<HTMLElement>(
        cardsContainer.querySelectorAll(`[data-card="true"]`)
      );

      if (cards.length === 0) return;

      // Verify all cards are still in DOM
      const validCards = cards.filter(card => document.contains(card));
      if (validCards.length === 0) return;

      const spacer = 20;
      const maxScale = 1.0;
      const minScale = 0.8;

      const distributor = gsap.utils.distribute({
        base: maxScale,
        amount: minScale - maxScale, // Negative amount to go from max to min
      });

      // Account for sticky tabs height (approximately 120px including padding)
      const tabsOffset = 120;

      validCards.forEach((card, index) => {
        // Double check card is still in DOM before creating animations
        if (!document.contains(card)) return;

        const scaleVal = distributor(index, card, validCards);
        
        // Set initial scale - cards start at their distributed scale
        gsap.set(card, { scale: scaleVal });

        // Pin animation for each card - cards start hidden below tabs
        // Start position ensures cards are hidden below sticky tabs initially
        const pinTrigger = ScrollTrigger.create({
          trigger: card,
          start: `top-=${tabsOffset + 20 + index * spacer} top`,
          endTrigger: cardsContainer,
          end: `bottom top+=${200 + validCards.length * spacer}`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
          id: `pin-${activeTab}-${index}`,
          markers: false,
        });

        triggers.push(pinTrigger);

        // Scale animation - smoothly scale as card is pinned
        // Scale from minScale to maxScale as card moves through pin range
        const scaleAnimation = gsap.fromTo(
          card,
          { scale: scaleVal },
          {
            scale: maxScale,
            scrollTrigger: {
              trigger: card,
              start: `top-=${tabsOffset + 20 + index * spacer} top`,
              end: `top+=${tabsOffset} top`,
              scrub: 1,
              invalidateOnRefresh: true,
              id: `scale-${activeTab}-${index}`,
            },
            ease: "none",
          }
        );

        const scaleTrigger = scaleAnimation.scrollTrigger;
        if (scaleTrigger) {
          triggers.push(scaleTrigger);
        }
      });

      // Refresh ScrollTrigger after all animations are set up
      ScrollTrigger.refresh();

      // Store triggers in ref for cleanup only if still mounted
      if (isMountedRef.current) {
        triggersRef.current = [...triggers];
      } else {
        // If unmounted during setup, clean up immediately
        triggers.forEach(trigger => {
          try {
            trigger.kill(false);
          } catch (e) {
            // Ignore errors
          }
        });
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // Cleanup any triggers that were created but component unmounted
      // Use triggersRef to access triggers that might have been created
      const currentTriggers = triggersRef.current;
      currentTriggers.forEach(trigger => {
        try {
          if (trigger) {
            trigger.kill(false);
          }
        } catch (e) {
          // Ignore errors
        }
      });
    };
  }, [activeTab]);

  return (
    <section ref={sectionRef} className={styles.section}>
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
        <div className={`mt-10 ${styles.tabsContainer}`}>
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

        {/* Cards container for GSAP ScrollTrigger animation */}
        <div
          key={activeTab}
          ref={cardsContainerRef}
          className={styles.cardsContainer}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`${activeTab}-${index}`}
              data-card="true"
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
                  className={styles.avatar}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
