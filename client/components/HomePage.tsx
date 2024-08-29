"use client";
import { Tabs } from "@/components/ui/tabs";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Image from "next/image";

const tabContent = [
  {
    title: "Tab 1",
    value: "tab1",
    content: (
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <Image
          src={`/image1.jpg`}
          alt="image1"
          height="400"
          width="400"
          className="object-contain"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">

        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">

        </p>
      </BackgroundGradient>
    ),
  },
  {
    title: "Tab 2",
    value: "tab2",
    content: (
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <Image
          src={`/image2.jpg`}
          alt="image2"
          height="400"
          width="400"
          className="object-contain"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">

        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">

        </p>
      </BackgroundGradient>
    ),
  },
  // Add more tabs as needed
];

export default function HomePage() {
  return (
    <div className="relative w-full h-full">
      {/* Logo and Site Name */}
      <div className="absolute top-4 left-4 flex items-center space-x-4">
        <Image
          src="/logo.png" // Ensure this path is correct
          alt="Smart Chef AI Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-2xl font-bold text-white">Smart Chef AI</span>
      </div>

      {/* Tabs Component */}
      <Tabs
        tabs={tabContent}
        containerClassName="flex flex-row items-center justify-center"
        activeTabClassName="bg-purple-600 text-white"
        tabClassName="text-sm font-medium"
        contentClassName="w-full h-full"
      />

      {/* Parallax Scroll Component */}
      <ParallaxScroll
        images={tabContent.map(tab => tab.content.props.children[0].props.src)}
        className="mt-8"
      />
    </div>
  );
}
