"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  onTabSelect, // Handler for when a tab is selected
  activeTab,  // The currently active tab value
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  onTabSelect: (value: string) => void; // Handler type
  activeTab: string;  // Active tab value
}) => {
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  useEffect(() => {
    setTabs(propTabs); // Sync tabs if prop changes
  }, [propTabs]);

  const handleTabClick = (tab: Tab, idx: number) => {
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      const selectedTab = newTabs.splice(idx, 1)[0];
      newTabs.unshift(selectedTab); // Move selected tab to the top
      return newTabs;
    });
    onTabSelect(tab.value); // Call the parent handler
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => handleTabClick(tab, idx)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {activeTab === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ",
                  activeTabClassName
                )}
              />
            )}
            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      {tabs.length > 0 && (
        <FadeInDiv
          tabs={tabs}
          active={tabs.find((tab) => tab.value === activeTab)!}
          className={cn("mt-32", contentClassName)}
        />
      )}
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  active,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
}) => {
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: tab.value === active.value ? [0, 40, 0] : 0,
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
