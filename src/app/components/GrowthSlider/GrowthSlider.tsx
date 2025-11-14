"use client";

import { useRef, useState, useEffect } from "react";
import Container from "../Container";

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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("article") as HTMLElement | null;
    // card width fallback
    const cardWidth = card ? Math.round(card.getBoundingClientRect().width) : Math.floor(el.clientWidth * 0.8);
    // try to read gap from computed style, fallback to 24
    const style = getComputedStyle(el) as any;
    const gapPx = style.gap || style.columnGap || "24px";
    const gap = parseInt(gapPx as string, 10) || 24;
    const offset = direction === "left" ? -(cardWidth + gap) : cardWidth + gap;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    window.addEventListener("resize", updateArrows);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", updateArrows);
      el.removeEventListener("scroll", onScroll as any);
    };
  }, [items]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll("right");
    } else if (e.key === "Home") {
      const el = scrollRef.current;
      if (el) el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (e.key === "End") {
      const el = scrollRef.current;
      if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="sectionPadding">
      <Container maxWidth="xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex-1 text-center text-3xl md:text-4xl font-semibold text-white">Growth Guides</h2>
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous"
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full bg-black/40 border border-white/6 text-white flex items-center justify-center shadow-md ${!canScrollLeft ? "opacity-40 cursor-not-allowed" : "hover:bg-black/50"
                }`}
            >
              ‹
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next"
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full bg-black/40 border border-white/6 text-white flex items-center justify-center shadow-md ${!canScrollRight ? "opacity-40 cursor-not-allowed" : "hover:bg-black/50"
                }`}
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          role="region"
          aria-label="Growth guides carousel"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="overflow-x-auto -mx-4 px-4 scroll-smooth snap-x snap-mandatory flex gap-6"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((it) => (
            <article
              key={it.id}
              className="snap-start bg-gradient-to-b from-[#0b1020] to-[#0b0b12] rounded-2xl p-4 shadow-xl border border-white/6 flex flex-col flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={it.image}
                  alt={it.title}
                  className="w-full h-36 sm:h-40 md:h-44 lg:h-48 object-cover block rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-[#38214a] text-[#e9d7ff] px-3 py-1 rounded-full">
                  {it.category}
                </span>
              </div>

              <h3 className="text-base md:text-lg text-white font-semibold mb-2 leading-snug">
                {it.title}
              </h3>

              <div className="text-xs text-gray-400 mb-3 flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{it.date}</span>
                </span>
                <span>•</span>
                <span>{it.readTime}</span>
              </div>

              <p className="text-sm text-gray-300 mb-5">{it.excerpt}</p>

              <div className="mt-auto">
                <a
                  href={it.href}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#7c3aed] to-[#a21caf] text-white py-2 px-5 rounded-full text-sm shadow-lg"
                >
                  Read Now →
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
