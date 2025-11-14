"use client";

import { useState } from "react";
import Container from "../Container";
import { TECHNOLOGIES_SECTION } from "../../constants";
import styles from "./Technologies.module.css";

export default function Technologies() {
  const [activeTab, setActiveTab] = useState("creative");

  const currentTools = TECHNOLOGIES_SECTION.tools[activeTab as keyof typeof TECHNOLOGIES_SECTION.tools];
  const currentTab = TECHNOLOGIES_SECTION.tabs.find((tab) => tab.id === activeTab);

  // Duplicate tools for seamless infinite scroll
  const toolsRow1 = [...currentTools, ...currentTools, ...currentTools];
  const toolsRow2 = [...currentTools, ...currentTools, ...currentTools];
  const toolsRow3 = [...currentTools, ...currentTools, ...currentTools];

  return (
    <section className={styles.section}>
      <Container maxWidth="full" className="px-0">
        {/* Header Section */}
        <div className={styles.header}>
          <h2 className={styles.heading}>
            <span className="text-white">{TECHNOLOGIES_SECTION.heading.part1}</span>{" "}
            <span className="text-[#0fdac2]">{TECHNOLOGIES_SECTION.heading.part2}</span>
            <span className="text-[#0fdac2]">{TECHNOLOGIES_SECTION.heading.part3}</span>
          </h2>
          <p className={styles.description}>{TECHNOLOGIES_SECTION.description}</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          {TECHNOLOGIES_SECTION.tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.activeTab : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tools Category Header */}
        <div className={styles.categoryHeader}>
          <h3 className={styles.categoryTitle}>
            {currentTab?.label} Tools ({" "}
            <span className="text-[#0fdac2]">{currentTab?.value}</span> )
          </h3>
        </div>

        {/* Three Animated Sliders */}
        <div className={styles.slidersContainer}>
          {/* First Slider - Right to Left */}
          <div className={`${styles.slider} ${styles.sliderRightToLeft}`}>
            <div className={styles.sliderTrack}>
              {toolsRow1.map((tool, index) => (
                <div key={`${tool.id}-${index}`} className={styles.toolCard}>
                  <div
                    className={styles.toolIcon}
                    style={{ color: tool.iconColor }}
                  >
                    {tool.icon}
                  </div>
                  <span className={styles.toolName}>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Second Slider - Left to Right */}
          <div className={`${styles.slider} ${styles.sliderLeftToRight}`}>
            <div className={styles.sliderTrack}>
              {toolsRow2.map((tool, index) => (
                <div key={`${tool.id}-${index}`} className={styles.toolCard}>
                  <div
                    className={styles.toolIcon}
                    style={{ color: tool.iconColor }}
                  >
                    {tool.icon}
                  </div>
                  <span className={styles.toolName}>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Third Slider - Right to Left */}
          <div className={`${styles.slider} ${styles.sliderRightToLeft}`}>
            <div className={styles.sliderTrack}>
              {toolsRow3.map((tool, index) => (
                <div key={`${tool.id}-${index}`} className={styles.toolCard}>
                  <div
                    className={styles.toolIcon}
                    style={{ color: tool.iconColor }}
                  >
                    {tool.icon}
                  </div>
                  <span className={styles.toolName}>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

