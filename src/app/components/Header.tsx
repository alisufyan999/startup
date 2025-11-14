"use client";

import { useState } from "react";
import { COMPANY_INFO, NAVIGATION_LINKS } from "../constants";
import Container from "./Container";
import Button from "./Button";
import Image from "next/image";
import { ArrowRightIcon } from "./icons";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-12 left-0 right-0 z-50 flex items-center justify-center w-full py-4 bg-transparent" style={{ willChange: "transform" }}>
      <Container maxWidth="xl" className="px-0">
        <nav className="flex items-center justify-between w-full rounded-full px-4 md:px-6 py-4 bg-[#02001c] backdrop-blur-sm shadow-lg border border-[#4e4989]" style={{ minHeight: "64px" }}>
          <div className="flex items-center gap-2">
            <div className="flex flex-col relative" style={{ width: 100, height: 40 }}>
              <Image
                src={COMPANY_INFO.logo}
                alt="Logo"
                width={100}
                height={40}
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white text-sm font-medium hover:text-[#0fdac2] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex">
            <Button
              href="/demo"
              variant="primary"
              icon={<ArrowRightIcon style={{ fill: "#000" }} />}
              iconPosition="right"
            >
              Book A Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>
      </Container>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 w-full bg-[#0a0a1a] border-t border-[#1a1a2e]/50 md:hidden z-50">
          <div className="flex flex-col px-4 py-4 gap-4">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white text-base font-medium hover:text-[#0fdac2] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button
              href="/demo"
              variant="primary"
              size="md"
              icon="→"
              iconPosition="right"
              className="mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book A Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
