'use client';

import Link from "next/link";
import Image from 'next/image';
import React, { useEffect, useRef, useState } from "react";
import { useModalStore } from "@/stores/useModalStore";

const CaseStudySection = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("tabScroll1");
  // refs (TOP)
  const stackCardsRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const scrollingFnRef = useRef<(() => void) | null>(null);
  const scrollingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null); // ✅ moved up
  const openModal = useModalStore((state: { openModal: any; }) => state.openModal);


  // Helper functions
  const hasClass = (el: HTMLElement, className: string): boolean => {
    if (el.classList) return el.classList.contains(className);
    else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  };

  const addClass = (el: HTMLElement, className: string): void => {
    const classList = className.split(' ');
    if (el.classList) el.classList.add(classList[0]);
    else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
    if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
  };

  const removeClass = (el: HTMLElement, className: string): void => {
    const classList = className.split(' ');
    if (el.classList) el.classList.remove(classList[0]);
    else if (hasClass(el, classList[0])) {
      const reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
    if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
  };

  const osHasReducedMotion = (): boolean => {
    if (!window.matchMedia) return false;
    const matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (matchMediaObj) return matchMediaObj.matches;
    return false;
  };

  // Stack Cards functions
  const setStackCards = (): void => {
    const element = stackCardsRef.current;
    if (!element) return;

    const items = itemsRef.current;
    if (!items || items.length === 0) return;

    // Reset all transformations if not desktop
    if (!isDesktop) {
      element.style.paddingBottom = '0px';
      for (let i = 0; i < items.length; i++) {
        if (items[i]) {
          items[i].style.transform = 'none';
          // Remove stack card classes on mobile
          items[i].classList.remove('service-scrollerItemContainer', 'stack-cards__item', 'js-stack-cards__item');
          // Show all items on mobile
          items[i].style.display = 'block';
        }
      }
      return;
    }

    // Desktop setup - show all items with stack effect
    for (let i = 0; i < items.length; i++) {
      if (items[i]) {
        items[i].style.display = 'block';
        items[i].style.transition = 'transform 0.1s ease-out'; // ✅ Add smooth transition
        // Ensure classes are present on desktop (don't add if already there)
        if (!items[i].classList.contains('service-scrollerItemContainer')) {
          items[i].classList.add('service-scrollerItemContainer', 'stack-cards__item', 'js-stack-cards__item');
        }
      }
    }

    // Check if we have at least one item before calling getComputedStyle
    if (!items[0]) return;

    const marginYValue = getComputedStyle(element).getPropertyValue('--stack-cards-gap');
    const marginY = getIntegerFromProperty(marginYValue, element);
    const elementHeight = element.offsetHeight;

    const cardStyle = getComputedStyle(items[0]);
    const cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue('top')));
    const cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue('height')));

    if (isNaN(marginY)) {
      element.style.paddingBottom = '0px';
    } else {
      element.style.paddingBottom = (marginY * (items.length - 1)) + 'px';
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i]) {
        if (isNaN(marginY)) {
          items[i].style.transform = 'none';
        } else {
          items[i].style.transform = `translateY(${marginY * i}px)`;
        }
      }
    }
  };

  const getIntegerFromProperty = (value: string, element: HTMLElement): number => {
    const node = document.createElement('div');
    node.setAttribute('style', 'opacity:0; visbility: hidden;position: absolute; height:' + value);
    element.appendChild(node);
    const intValue = parseInt(getComputedStyle(node).getPropertyValue('height'));
    element.removeChild(node);
    return intValue;
  };

  const syncActiveByVisibility = () => {
    const list = stackCardsRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>("li[id^='tabScroll']"));
    if (!cards.length) return;

    const rootEl = scrollContainerRef.current;
    const rootRect = rootEl && rootEl.scrollHeight > rootEl.clientHeight
      ? rootEl.getBoundingClientRect()
      : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

    let bestId = activeTab, best = 0;
    for (const el of cards) {
      const r = el.getBoundingClientRect();
      const top = Math.max(r.top, rootRect.top);
      const bottom = Math.min(r.bottom, rootRect.bottom);
      const visible = Math.max(0, bottom - top);
      const ratio = r.height ? visible / r.height : 0;
      if (ratio > best) { best = ratio; bestId = el.id; }
    }
    if (bestId !== activeTab) setActiveTab(bestId);
  };

  useEffect(() => {
    if (isDesktop) return; // desktop pe stack math hi chalegi
    const root: any = scrollContainerRef.current ?? window;
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(syncActiveByVisibility); };
    root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    syncActiveByVisibility();
    return () => { root.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [isDesktop]);

  // ✅ New function to maintain scale based on current position
  const maintainStackCardsScale = (): void => {
    if (!isDesktop) return;

    const element = stackCardsRef.current;
    if (!element) return;

    const items = itemsRef.current;
    if (!items || items.length === 0 || !items[0]) return;

    const marginYValue = getComputedStyle(element).getPropertyValue('--stack-cards-gap');
    const marginY = getIntegerFromProperty(marginYValue, element);
    if (isNaN(marginY)) return;

    const top = element.getBoundingClientRect().top;
    const cardStyle = getComputedStyle(items[0]);
    const cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue('top')));
    const cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue('height')));

    for (let i = 0; i < items.length; i++) {
      if (!items[i]) continue;
      
      const scrolling = cardTop - top - i * (cardHeight + marginY);

      if (scrolling > 0) {
        const scaling = i === items.length - 1 ? 1 : (cardHeight - scrolling * 0.05) / cardHeight;
        const boundedScaling = Math.max(0.7, Math.min(1, scaling));
        items[i].style.transform = `translateY(${marginY * i}px) scale(${boundedScaling})`;
      } else {
        items[i].style.transform = `translateY(${marginY * i}px)`;
      }
    }
  };

  const animateStackCards = (): void => {
    if (!isDesktop) {
      scrollingRef.current = false;
      syncActiveByVisibility();
      return;
    }

    const element = stackCardsRef.current;
    if (!element) return;

    const items = itemsRef.current;
    if (!items || items.length === 0 || !items[0]) {
      scrollingRef.current = false;
      return;
    }

    const marginYValue = getComputedStyle(element).getPropertyValue('--stack-cards-gap');
    const marginY = getIntegerFromProperty(marginYValue, element);
    if (isNaN(marginY)) { scrollingRef.current = false; return; }

    const top = element.getBoundingClientRect().top;
    const cardStyle = getComputedStyle(items[0]);
    const cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue('top')));
    const cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue('height')));
    const elementHeight = element.offsetHeight;
    const windowHeight = window.innerHeight;

    if (cardTop - top + windowHeight - elementHeight - cardHeight + marginY + marginY * items.length > 0) {
      scrollingRef.current = false;
      return;
    }

    let bestIndex = 0;
    let bestDist = Infinity;

    for (let i = 0; i < items.length; i++) {
      if (!items[i]) continue;
      
      const scrolling = cardTop - top - i * (cardHeight + marginY);

      if (scrolling > 0) {
        const scaling = i === items.length - 1 ? 1 : (cardHeight - scrolling * 0.05) / cardHeight;
        items[i].style.transform = `translateY(${marginY * i}px) scale(${scaling})`;
      } else {
        items[i].style.transform = `translateY(${marginY * i}px)`;
      }

      const dist = Math.abs(scrolling);
      if (dist < bestDist) { bestDist = dist; bestIndex = i; }
    }

    const id = `tabScroll${bestIndex + 1}`;
    if (id !== activeTab) setActiveTab(id);

    scrollingRef.current = false;
  };


  const stackCardsScrolling = (): void => {
    if (!isDesktop || scrollingRef.current) return;
    scrollingRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animateStackCards);
  };

  const initStackCardsEffect = (): void => {
    // Only initialize if we have the required elements
    if (stackCardsRef.current && itemsRef.current && itemsRef.current.length > 0) {
      setStackCards();
      if (!isDesktop) return;

      window.addEventListener('scroll', stackCardsScrolling);
    }
  };

  const cleanupStackCards = (): void => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    window.removeEventListener('scroll', stackCardsScrolling);
  };



  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const target = document.getElementById(tabId);
    if (!target) return;

    const scroller = scrollContainerRef.current;

    // Prefer container scroll if it's actually scrollable
    if (scroller && scroller.scrollHeight > scroller.clientHeight) {
      const targetRect = target.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const current = scroller.scrollTop;
      const delta = targetRect.top - scrollerRect.top; // distance inside the box
      scroller.scrollTo({ top: current + delta, behavior: "smooth" });
      return;
    }

    // Fallback: page scroll
    const y =
      window.scrollY +
      target.getBoundingClientRect().top -
      80; // adjust if you have a sticky header
    window.scrollTo({ top: y, behavior: "smooth" });
  };


  // helper: fetch all card <li> by known ids (order preserved)
  const getCardEls = () => (
    ["tabScroll1", "tabScroll2", "tabScroll3", "tabScroll4", "tabScroll5", "tabScroll6"]
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
  );

  // compute visible ratio of an element inside a root rect
  const ratioInRoot = (rect: DOMRect, rootRect: DOMRect) => {
    const top = Math.max(rect.top, rootRect.top);
    const bottom = Math.min(rect.bottom, rootRect.bottom);
    const visible = Math.max(0, bottom - top);
    return rect.height > 0 ? visible / rect.height : 0;
  };

  // 🔁 robust scroll-based sync (no IO)
  useEffect(() => {
    const rootEl = scrollContainerRef.current ?? null;

    // if right panel actually scrolls, use it as root; else viewport
    const getRootRect = () =>
      rootEl && rootEl.scrollHeight > rootEl.clientHeight
        ? rootEl.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

    let raf = 0;

    const selectMostVisible = () => {
      const cards = getCardEls();
      if (!cards.length) return;

      const rootRect = getRootRect();
      let bestId = activeTab;
      let best = 0;

      for (const el of cards) {
        const r = el.getBoundingClientRect();
        const ratio = ratioInRoot(r, rootRect);
        if (ratio > best) {
          best = ratio;
          bestId = el.id;
        }
      }

      // little hysteresis to avoid flicker
      if (bestId !== activeTab && best >= 0.35) setActiveTab(bestId);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(selectMostVisible);
    };

    // attach to both roots so desktop/mobile both covered
    (rootEl ?? window).addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // initial sync
    selectMostVisible();

    return () => {
      (rootEl ?? window).removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollContainerRef.current]); // only rewire if the scrolling root changes

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      // Clean up and reinitialize
      cleanupStackCards();
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        initStackCardsEffect();
      }, 100);
    };

    // Initial setup
    const desktop = window.innerWidth >= 1024;
    setIsDesktop(desktop);

    // Initialize only if not reduced motion and after a delay to ensure DOM is ready
    if (!osHasReducedMotion()) {
      setTimeout(() => {
        initStackCardsEffect();
      }, 200);
    }

    // Set up resize listener
    let resizeTimeout: NodeJS.Timeout;
    const resizeListener = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 500);
    };

    window.addEventListener('resize', resizeListener);

    // Clean up
    return () => {
      cleanupStackCards();
      window.removeEventListener('resize', resizeListener);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [isDesktop, activeTab]);

  // Update service scroller class
  useEffect(() => {
    const updateServiceScrollerClass = () => {
      const el = document.getElementById("serviceScrollerArea");
      if (!el) return;

      if (window.innerWidth > 1024) {
        removeClass(el as HTMLElement, "service-scrollerArea");
      } else {
        addClass(el as HTMLElement, "service-scrollerArea");
      }
    };

    updateServiceScrollerClass();
    window.addEventListener("resize", updateServiceScrollerClass);
    return () => {
      window.removeEventListener("resize", updateServiceScrollerClass);
    };
  }, []);

  // Initialize items ref
  useEffect(() => {
    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (stackCardsRef.current) {
        itemsRef.current = Array.from(
          stackCardsRef.current.getElementsByClassName('js-stack-cards__item')
        ) as HTMLLIElement[];

        // Only call setStackCards on mobile to remove classes
        if (!isDesktop && itemsRef.current.length > 0) {
          setStackCards();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isDesktop]);

  // ✅ Add intersection observer or interval to maintain scale when not scrolling
  useEffect(() => {
    if (!isDesktop) return;
    
    const intervalId = setInterval(() => {
      if (!scrollingRef.current) {
        maintainStackCardsScale();
      }
    }, 16); // Check every 16ms (60fps) when not actively scrolling

    return () => clearInterval(intervalId);
  }, [isDesktop]);


  return (


    
    <div className="pb_8 sectionPadding bg-cover mobile-padding-bottom-0">
      <section className="sectionPaddingCase pt-0 mobile-padding-bottom-0">
        <div className="container mx-auto">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-6 text-center section-heading-para mb-10">
              <h2 className="mb-5 text-white text-center">
                Meet Your <span>AI-Empowered</span><br></br> Team Behind Your Growth
              </h2>
              <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, <br></br>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
          <div className="w-[70%] mx-auto">
            <div className="tabSection">
              <div className="">
                <div className="px-4" ref={scrollContainerRef}>
                  <ul
                    className="service-scrollerArea stack-cards js-stack-cards"
                    id="serviceScrollerArea"
                    ref={stackCardsRef}
                  >
                    {/* WhatsApp AI Agent */}
                    <li
                      className="service-scrollerItemContainer stack-cards__item js-stack-cards__item"
                      id="tabScroll1"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 scrollerItem">
                            <div className="inner-div my-auto p-5">
                                <h3>Brand Designer</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur</p>
                                <div className="inner-tags flex flex-wrap gap-2">
                                    <span>Logo Design</span>
                                    <span>Brand Guidelines</span>
                                    <span>Color Palette</span>
                                    <span>Typography System</span>
                                    <span>Social Templates</span>
                                    <span>Rebrand Plan</span>
                                    <span>Business Cards</span>
                                    <span>Email Signature</span>
                                    <span>Icon Set</span>
                                    <span>Mockups</span>
                                    <span>Packaging</span>
                                    <span>Stationery</span>
                                    <span>Uniform Branding</span>
                                </div>
                                <Link href="#" className="btn-primary">Hire Brand Designer &#8594;</Link>
                            </div>
                            <div className="text-center">
                                <Image src="/assets/images/2.png" alt="brand-designer" width={300} height={200} />
                            </div>
                        </div>
                    </li>

                    {/* Phone AI Agent */}
                    <li
                      className="service-scrollerItemContainer stack-cards__item js-stack-cards__item"
                      id="tabScroll2"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 scrollerItem">
                            <div className="inner-div my-auto p-5">
                                <h3>Brand Designer</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur</p>
                                <div className="inner-tags flex flex-wrap gap-2">
                                    <span>Logo Design</span>
                                    <span>Brand Guidelines</span>
                                    <span>Color Palette</span>
                                    <span>Typography System</span>
                                    <span>Social Templates</span>
                                    <span>Rebrand Plan</span>
                                    <span>Business Cards</span>
                                    <span>Email Signature</span>
                                    <span>Icon Set</span>
                                    <span>Mockups</span>
                                    <span>Packaging</span>
                                    <span>Stationery</span>
                                    <span>Uniform Branding</span>
                                </div>
                                <Link href="#" className="btn-primary">Hire Brand Designer &#8594;</Link>
                            </div>
                            <div className="text-center">
                                <Image src="/assets/images/2.png" alt="brand-designer" width={300} height={200} />
                            </div>
                        </div>
                    </li>

                    {/* Shopify AI Agent */}
                    <li
                      className="service-scrollerItemContainer stack-cards__item js-stack-cards__item"
                      id="tabScroll3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 scrollerItem">
                            <div className="inner-div my-auto p-5">
                                <h3>Brand Designer</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur</p>
                                <div className="inner-tags flex flex-wrap gap-2">
                                    <span>Logo Design</span>
                                    <span>Brand Guidelines</span>
                                    <span>Color Palette</span>
                                    <span>Typography System</span>
                                    <span>Social Templates</span>
                                    <span>Rebrand Plan</span>
                                    <span>Business Cards</span>
                                    <span>Email Signature</span>
                                    <span>Icon Set</span>
                                    <span>Mockups</span>
                                    <span>Packaging</span>
                                    <span>Stationery</span>
                                    <span>Uniform Branding</span>
                                </div>
                                <Link href="#" className="btn-primary">Hire Brand Designer &#8594;</Link>
                            </div>
                            <div className="text-center">
                                <Image src="/assets/images/2.png" alt="brand-designer" width={300} height={200} />
                            </div>
                        </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudySection;