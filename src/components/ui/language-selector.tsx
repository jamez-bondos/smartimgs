"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-provider";
import { Language, languages } from "@/lib/i18n";
import { Button } from "./button";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  // Define languages to cycle through
  const allLanguages = Object.keys(languages) as Language[];
  
  // Get the next language in the cycle
  const getNextLanguage = () => {
    const currentIndex = allLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % allLanguages.length;
    return allLanguages[nextIndex];
  };

  return (
    <Button 
      variant="outline" 
      className="text-xs md:text-sm"
      onClick={() => setLanguage(getNextLanguage())}
    >
      <Languages className="size-4 mr-1" />
      {language === 'en' ? '中文' : 'English'}
    </Button>
  );
} 