"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./AiTeamTabs.module.css";

const CARD_IDS = [
  "tabScroll1",
  "tabScroll2",
  "tabScroll3",
  "tabScroll4",
  "tabScroll5",
  "tabScroll6",
] as const;

type CardId = (typeof CARD_IDS)[number];

const AiTeamTabs: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState<CardId>("tabScroll1");

  const stackCardsRef = useRef<HTMLUListElement | null>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // ---- Helpers ----
  const osHasReducedMotion = (): boolean => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    const matchMediaObj = window.matchMedia("(prefers-reduced-motion: reduce)");
    return matchMediaObj?.matches ?? false;
  };

  const getIntegerFromProperty = (value: string, element: HTMLElement): number => {
    const node = document.createElement("div");
    node.setAttribute(
      "style",
      `opacity:0; visibility:hidden; position:absolute; height:${value}`,
    );
    element.appendChild(node);
    const intValue = parseInt(getComputedStyle(node).getPropertyValue("height"));
    element.removeChild(node);
    return intValue;
  };

  const collectItems = () => {
    if (!stackCardsRef.current) return;
    itemsRef.current = Array.from(
      stackCardsRef.current.querySelectorAll<HTMLLIElement>("[data-card-item='true']"),
    );
  };

  // ---- Stack cards base setup (desktop + mobile reset) ----
  const setStackCards = () => {
    const element = stackCardsRef.current;
    if (!element) return;

    const items = itemsRef.current;
    if (!items || items.length === 0) return;

    // Mobile / tablet: reset transforms, show normal list
    if (!isDesktop) {
      element.style.paddingBottom = "0px";
      items.forEach((item) => {
        item.style.transform = "none";
      });
      return;
    }

    // Desktop: stacked effect
    const marginYValue = getComputedStyle(element).getPropertyValue("--stack-cards-gap");
    const marginY = getIntegerFromProperty(marginYValue, element);

    if (isNaN(marginY)) {
      element.style.paddingBottom = "0px";
      items.forEach((item) => {
        item.style.transform = "none";
      });
      return;
    }

    element.style.paddingBottom = `${marginY * (items.length - 1)}px`;

    items.forEach((item, i) => {
      item.style.transition = "transform 0.12s ease-out";
      item.style.transform = `translateY(${marginY * i}px)`;
    });
  };

  // ---- Maintain scale based on current position (desktop) ----
  const maintainStackCardsScale = () => {
    if (!isDesktop) return;

    const element = stackCardsRef.current;
    if (!element) return;

    const items = itemsRef.current;
    if (!items.length) return;

    const marginYValue = getComputedStyle(element).getPropertyValue("--stack-cards-gap");
    const marginY = getIntegerFromProperty(marginYValue, element);
    if (isNaN(marginY)) return;

    const top = element.getBoundingClientRect().top;
    const firstStyle = getComputedStyle(items[0]);
    const cardTop = Math.floor(parseFloat(firstStyle.getPropertyValue("top")));
    const cardHeight = Math.floor(parseFloat(firstStyle.getPropertyValue("height")));

    items.forEach((item, i) => {
      const scrolling = cardTop - top - i * (cardHeight + marginY);

      if (scrolling > 0) {
        const scaling =
          i === items.length - 1 ? 1 : (cardHeight - scrolling * 0.05) / cardHeight;
        const boundedScaling = Math.max(0.7, Math.min(1, scaling));
        item.style.transform = `translateY(${marginY * i}px) scale(${boundedScaling})`;
      } else {
        item.style.transform = `translateY(${marginY * i}px)`;
      }
    });
  };

  // ---- Scroll animation for stack cards (desktop) ----
  const animateStackCards = () => {
    if (!isDesktop) {
      scrollingRef.current = false;
      syncActiveByVisibility();
      return;
    }

    const element = stackCardsRef.current;
    if (!element) {
      scrollingRef.current = false;
      return;
    }

    const items = itemsRef.current;
    if (!items.length) {
      scrollingRef.current = false;
      return;
    }

    const marginYValue = getComputedStyle(element).getPropertyValue("--stack-cards-gap");
    const marginY = getIntegerFromProperty(marginYValue, element);
    if (isNaN(marginY)) {
      scrollingRef.current = false;
      return;
    }

    const top = element.getBoundingClientRect().top;
    const firstStyle = getComputedStyle(items[0]);
    const cardTop = Math.floor(parseFloat(firstStyle.getPropertyValue("top")));
    const cardHeight = Math.floor(parseFloat(firstStyle.getPropertyValue("height")));
    const elementHeight = element.offsetHeight;
    const windowHeight = window.innerHeight;

    if (
      cardTop -
        top +
        windowHeight -
        elementHeight -
        cardHeight +
        marginY +
        marginY * items.length >
      0
    ) {
      scrollingRef.current = false;
      return;
    }

    let bestIndex = 0;
    let bestDist = Infinity;

    items.forEach((item, i) => {
      const scrolling = cardTop - top - i * (cardHeight + marginY);

      if (scrolling > 0) {
        const scaling =
          i === items.length - 1 ? 1 : (cardHeight - scrolling * 0.05) / cardHeight;
        item.style.transform = `translateY(${marginY * i}px) scale(${scaling})`;
      } else {
        item.style.transform = `translateY(${marginY * i}px)`;
      }

      const dist = Math.abs(scrolling);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    });

    const id = CARD_IDS[bestIndex];
    if (id && id !== activeTab) setActiveTab(id);

    scrollingRef.current = false;
  };

  const stackCardsScrolling = () => {
    if (!isDesktop || scrollingRef.current) return;
    scrollingRef.current = true;
    animationFrameRef.current = window.requestAnimationFrame(animateStackCards);
  };

  const initStackCardsEffect = () => {
    if (!stackCardsRef.current) return;
    collectItems();
    setStackCards();

    if (!isDesktop || osHasReducedMotion()) return;
    window.addEventListener("scroll", stackCardsScrolling, { passive: true });
  };

  const cleanupStackCards = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    window.removeEventListener("scroll", stackCardsScrolling);
  };

  // ---- Tab click → scroll to card ----
  const handleTabClick = (tabId: CardId) => {
    setActiveTab(tabId);
    const target = document.getElementById(tabId);
    if (!target) return;

    const scroller = scrollContainerRef.current;

    // If right panel is scrollable, scroll inside it
    if (scroller && scroller.scrollHeight > scroller.clientHeight) {
      const targetRect = target.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const current = scroller.scrollTop;
      const delta = targetRect.top - scrollerRect.top;
      scroller.scrollTo({ top: current + delta, behavior: "smooth" });
      return;
    }

    // Fallback to window scroll
    const y = window.scrollY + target.getBoundingClientRect().top - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // ---- Visibility ratio helpers for active tab sync ----
  const getCardEls = () =>
    CARD_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

  const ratioInRoot = (rect: DOMRect, rootRect: DOMRect) => {
    const top = Math.max(rect.top, rootRect.top);
    const bottom = Math.min(rect.bottom, rootRect.bottom);
    const visible = Math.max(0, bottom - top);
    return rect.height > 0 ? visible / rect.height : 0;
  };

  const syncActiveByVisibility = () => {
    const rootEl = scrollContainerRef.current ?? null;

    const rootRect =
      rootEl && rootEl.scrollHeight > rootEl.clientHeight
        ? rootEl.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

    const cards = getCardEls();
    if (!cards.length) return;

    let bestId: CardId = activeTab;
    let best = 0;

    cards.forEach((el) => {
      const r = el.getBoundingClientRect();
      const ratio = ratioInRoot(r, rootRect);
      if (ratio > best) {
        best = ratio;
        bestId = el.id as CardId;
      }
    });

    if (bestId !== activeTab && best >= 0.35) {
      setActiveTab(bestId);
    }
  };

  // ---- Global scroll listener (for active tab sync on mobile / non-stack cases) ----
  useEffect(() => {
    const rootEl = scrollContainerRef.current ?? null;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncActiveByVisibility);
    };

    (rootEl ?? window).addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    syncActiveByVisibility();

    return () => {
      (rootEl ?? window).removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef.current]);

  // ---- Handle resize & (re)init stack cards ----
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      cleanupStackCards();
      setTimeout(() => {
        collectItems();
        initStackCardsEffect();
      }, 100);
    };

    const desktop = window.innerWidth >= 1024;
    setIsDesktop(desktop);

    if (!osHasReducedMotion()) {
      setTimeout(() => {
        collectItems();
        initStackCardsEffect();
      }, 200);
    }

    let resizeTimeout: NodeJS.Timeout;
    const resizeListener = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 400);
    };

    window.addEventListener("resize", resizeListener);

    return () => {
      cleanupStackCards();
      window.removeEventListener("resize", resizeListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Interval: keep stack scale stable when not scrolling ----
  useEffect(() => {
    if (!isDesktop) return;

    const intervalId = window.setInterval(() => {
      if (!scrollingRef.current) {
        maintainStackCardsScale();
      }
    }, 16);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isDesktop]);

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <div className="pb-20 sectionPadding bg-cover mobile-padding-bottom-0">
      <section className="sectionPaddingCase pt-0 mobile-padding-bottom-0">
        <div className="w-full px-4 lg:px-8 xl:px-16">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <span className="buttonAnimation yellow inline-block px-4 py-2 text-sm font-medium rounded-full border-blue-400 bg-b-600 text-tropical-indigo">
              Case Studies
            </span>
            <h2 className="tracking-[-0.02em] mb-8 lg:leading-[4rem] md:text-5xl font-semibold headingSize lineHeight-1">
              Every Agent, Built to Perform
            </h2>
          </div>

          {/* Tabs header (for clicking) */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleTabClick("tabScroll1")}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === "tabScroll1"
                    ? "bg-white text-black border-white"
                    : "bg-transparent border-white/40 text-white/80 hover:border-white"
                }`}
              >
                WhatsApp AI Agent
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("tabScroll2")}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === "tabScroll2"
                    ? "bg-white text-black border-white"
                    : "bg-transparent border-white/40 text-white/80 hover:border-white"
                }`}
              >
                Phone AI Agent
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("tabScroll3")}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === "tabScroll3"
                    ? "bg-white text-black border-white"
                    : "bg-transparent border-white/40 text-white/80 hover:border-white"
                }`}
              >
                Shopify AI Agent
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("tabScroll4")}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === "tabScroll4"
                    ? "bg-white text-black border-white"
                    : "bg-transparent border-white/40 text-white/80 hover:border-white"
                }`}
              >
                AI Assistant App
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("tabScroll5")}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === "tabScroll5"
                    ? "bg-white text-black border-white"
                    : "bg-transparent border-white/40 text-white/80 hover:border-white"
                }`}
              >
                Voice + Chatbot
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("tabScroll6")}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === "tabScroll6"
                    ? "bg-white text-black border-white"
                    : "bg-transparent border-white/40 text-white/80 hover:border-white"
                }`}
              >
                Standalone Agent
              </button>
            </div>
          </div>

          {/* Stack cards area */}
          <div
            className={`${styles.scrollContainer} max-w-6xl mx-auto px-4 lg:px-6 tabBgbox`}
            ref={scrollContainerRef}
          >
            <ul
              className={`${styles.stackCards} service-scrollerArea`}
              ref={stackCardsRef}
            >
              {/* WhatsApp AI Agent */}
              <li
                id="tabScroll1"
                data-card-item="true"
                className={`${styles.stackCardItem} text-white`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 min-h-[400px]">
                  <div className="flex flex-col">
                    <button className="hrButton mb-4">
                      <span>.</span> WhatsApp AI Agent
                    </button>
                    <div className="space-y-4">
                      <h3 className="heading1">
                        Turn Conversations into Revenue on the World&apos;s Most
                        Active Messaging App
                      </h3>
                      <p className="text-white/80">
                        Your WhatsApp AI Agent replies in real time, detects
                        high-intent behavior, and nurtures customers through
                        every stage of the funnel — without you typing a word.
                      </p>

                      <h3 className="heading1">
                        Fast Answers. Smarter Follow-Ups. Full Coverage.
                      </h3>
                      <p className="text-white/80">
                        From product inquiries to payment reminders, this agent
                        handles it all instantly using your knowledge base,
                        ticket history, and real-time business logic.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 font-semibold text-lg">Agentic Workflow</h4>
                    <div className="space-y-3">
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Follows up automatically when Shopify agent detects cart
                          abandonment
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>Escalates chats to Phone Agent when urgency is high</p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Updates CRM after conversations using Standalone Agent
                          logic
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Triggers Voice Agent callbacks for verification or
                          follow-up sales
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Phone AI Agent */}
              <li
                id="tabScroll2"
                data-card-item="true"
                className={`${styles.stackCardItem} text-white`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 min-h-[400px]">
                  <div className="flex flex-col">
                    <button className="hrButton mb-4">
                      <span>.</span> Phone AI Agent
                    </button>
                    <div className="space-y-4">
                      <h3 className="heading1">
                        Every Call Answered, Routed, and Resolved — No Waiting, No
                        Voicemail
                      </h3>
                      <p className="text-white/80">
                        With human-sounding voice AI, your phone agent picks up
                        24/7, handles routine inquiries, books appointments, and
                        transfers complex issues to the right human.
                      </p>

                      <h3 className="heading1">
                        No Missed Opportunities, No Repetition — Just Resolution
                        at Scale
                      </h3>
                      <p className="text-white/80">
                        Built to mirror your tone and powered by real data, it
                        brings down hold times and clears up your team&apos;s
                        schedule without sacrificing service quality.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 font-semibold text-lg">Agentic Workflow</h4>
                    <div className="space-y-3">
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Connects with WhatsApp Agent to follow up on missed or
                          dropped call
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Books meetings directly into your Google Calendar via
                          Assistant App
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Sends post-call summaries to Standalone Agent for future
                          insights
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Flags high-volume issues to Chatbot Agent for proactive
                          site messaging
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Shopify AI Agent */}
              <li
                id="tabScroll3"
                data-card-item="true"
                className={`${styles.stackCardItem} text-white`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 min-h-[400px]">
                  <div className="flex flex-col">
                    <button className="hrButton mb-4">
                      <span>.</span> Shopify AI Agent
                    </button>
                    <div className="space-y-4">
                      <h3 className="heading1">
                        From Cart to Confirmation — This Agent Owns the Post-Sale
                        Journey
                      </h3>
                      <p className="text-white/80">
                        Whether it&apos;s order status, refund requests, or
                        shipping delays, your Shopify AI Agent handles them
                        instantly by syncing with your store data in real time.
                      </p>

                      <h3 className="heading1">
                        More Orders Completed, Fewer Tickets Created
                      </h3>
                      <p className="text-white/80">
                        By resolving customer issues before they ever hit your
                        support team, it not only saves hours — it boosts
                        satisfaction and retention where it matters most.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 font-semibold text-lg">Agentic Workflow</h4>
                    <div className="space-y-3">
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>Flags abandoned checkouts for WhatsApp Agent to follow up</p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>Syncs with Voice Agent to resolve high-friction returns</p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Surfaces product feedback to Assistant App for on-the-go
                          reviews
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Notifies Chatbot Agent to update product FAQs
                          automatically
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* AI Assistant App */}
              <li
                id="tabScroll4"
                data-card-item="true"
                className={`${styles.stackCardItem} text-white`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 min-h-[400px]">
                  <div className="flex flex-col">
                    <button className="hrButton mb-4">
                      <span>.</span> AI Assistant App
                    </button>
                    <div className="space-y-4">
                      <h3 className="heading1">
                        The Smartest Teammate in Your Pocket — Always Ready,
                        Always Synced
                      </h3>
                      <p className="text-white/80">
                        Whether you&apos;re in the field, remote, or in-store,
                        your Assistant App gives you instant access to internal
                        data, documents, and workflows — using voice or text.
                      </p>

                      <h3 className="heading1">
                        Work Faster, Smarter, and from Anywhere Without Logging
                        Into Anything
                      </h3>
                      <p className="text-white/80">
                        This mobile-first agent transforms how you interact with
                        your backend: need a document, insight, or task managed?
                        Just ask — it&apos;s already done.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 font-semibold text-lg">Agentic Workflow</h4>
                    <div className="space-y-3">
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Pulls live customer context from Chatbot Agent when
                          updates are needed
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Logs answers from Voice Agent for internal knowledge
                          access
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Adds calendar events triggered by Phone Agent bookings
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Syncs insights from Standalone Agent to update
                          playbooks on the go
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Voice + Chatbot Agents */}
              <li
                id="tabScroll5"
                data-card-item="true"
                className={`${styles.stackCardItem} text-white`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 min-h-[400px]">
                  <div className="flex flex-col">
                    <button className="hrButton mb-4">
                      <span>.</span> Voice + Chatbot Agents
                    </button>
                    <div className="space-y-4">
                      <h3 className="heading1">
                        Your Always-On Brand Voice, No Matter How People Reach You
                      </h3>
                      <p className="text-white/80">
                        Whether it&apos;s a voice command or a typed question, this
                        hybrid agent delivers answers that feel human, contextual,
                        and instantly accurate across all channels.
                      </p>

                      <h3 className="heading1">
                        Reduce Human Load, Raise Response Quality — 24/7,
                        Multilingual, Multiplatform
                      </h3>
                      <p className="text-white/80">
                        Trained on real conversations and support history, these
                        agents not only talk — they listen, learn, and adapt to
                        every interaction in real time.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 font-semibold text-lg">Agentic Workflow</h4>
                    <div className="space-y-3">
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Detects trending questions and signals Assistant App to
                          update support scripts
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Collaborates with Phone Agent to handle
                          language-specific inquiries
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Pushes recurring feedback to Shopify Agent for product
                          improvement
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Syncs resolved tickets with WhatsApp Agent for follow-up
                          or upsell offers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Standalone AI Agent */}
              <li
                id="tabScroll6"
                data-card-item="true"
                className={`${styles.stackCardItem} text-white`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 min-h-[400px]">
                  <div className="flex flex-col">
                    <button className="hrButton mb-4">
                      <span>.</span> Standalone AI Agent
                    </button>
                    <div className="space-y-4">
                      <h3 className="heading1">
                        Deploy One Link and Deliver Full-Service AI — No Platform
                        Needed
                      </h3>
                      <p className="text-white/80">
                        Whether you&apos;re running lean or building fast, this
                        browser-based agent handles customer queries, sales, and
                        workflows independently — just plug and launch.
                      </p>

                      <h3 className="heading1">
                        Perfect for Onboarding, Support, Sales, or Internal Use —
                        It Adapts to Your Flow
                      </h3>
                      <p className="text-white/80">
                        It learns from each interaction, pulls data from integrated
                        tools, and evolves to support every part of your business
                        with zero dev effort.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="greyIcon">
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 font-semibold text-lg">Agentic Workflow</h4>
                    <div className="space-y-3">
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/iconss.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Shares real-time feedback to Chatbot Agent for web
                          knowledge accuracy
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Informs Phone Agent of user preferences before callbacks
                        </p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon3.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>Pushes lead data to WhatsApp Agent for nurturing</p>
                      </div>
                      <div className="tabBox">
                        <div>
                          <Image
                            src="/assets/img/icon2.png"
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                        <p>
                          Feeds insights into Assistant App for mobile access and
                          action
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiTeamTabs;
