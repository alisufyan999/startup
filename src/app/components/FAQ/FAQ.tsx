"use client";

import { useState } from "react";
import Container from "../Container";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionData {
    title: {
        part1: string;
        part2: string;
    };
    subtitle: string;
}

interface FAQProps {
    faqs: FAQItem[];
    sectionData: FAQSectionData;
    className?: string;
}

export default function FAQ({
    faqs,
    sectionData,
    className = "",
}: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            className={`relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-17 ${className}`}
        >
            <Container maxWidth="xl" className="px-0">
                <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
                    {/* Section Title */}
                    <div className="text-center w-full px-4 sm:px-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-5 leading-tight">
                            <span className="text-white">{sectionData.title.part1}</span>{" "}
                            <span className="text-[#0fdac2]">{sectionData.title.part2}</span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
                            {sectionData.subtitle}
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="w-full">
                        <div className="space-y-0">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border-b border-white/10 last:border-b-0"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-0 py-4 sm:py-5 md:py-6 flex items-center justify-between text-left focus:outline-none transition-colors hover:opacity-80 gap-3 sm:gap-4"
                                    >
                                        <span className="text-white font-semibold text-base sm:text-lg md:text-xl lg:text-2xl pr-2 sm:pr-4 flex-1 leading-snug sm:leading-normal">
                                            {faq.question}
                                        </span>
                                        <span className="text-white text-xl sm:text-2xl md:text-3xl font-light flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center">
                                            {openIndex === index ? "−" : "+"}
                                        </span>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-[500px] pb-4 sm:pb-5 md:pb-6" : "max-h-0"
                                            }`}
                                    >
                                        <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed pr-2 sm:pr-4 md:pr-8">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

