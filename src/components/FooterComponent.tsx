"use client";

import { useLanguage } from "@/lib/i18n/language-provider";
import { LanguageSelector } from "./ui/language-selector";
import GithubIcon from "@/components/icons/github";
import XIcon from "@/components/icons/x";

export function FooterComponent() {
  const { t } = useLanguage();
  
  return (
    <footer className="mx-auto mt-14 flex w-full max-w-7xl items-center justify-between px-4 py-6 md:mt-0">
      <div className="flex items-center">
        <p className="text-xs text-gray-300 md:text-sm">
          {t.footer.poweredBy}{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 underline transition hover:text-gray-900"
            href="https://ai.google.dev/gemini-api/docs"
          >
            {t.footer.google}
          </a>
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <LanguageSelector />
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-250 bg-white px-2 py-1.5 text-xs text-gray-300 shadow transition hover:bg-white/75 md:rounded-xl md:px-4 md:text-sm"
          href="https://github.com/jamez-bondos/smartimgs"
        >
          <GithubIcon className="size-4" />
          {t.footer.github}
        </a>
        <a
          href="https://x.com/AIJamezBondos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-250 bg-white px-2 py-1.5 text-xs text-gray-300 shadow transition hover:bg-white/75 md:rounded-xl md:px-4 md:text-sm"
        >
          <XIcon className="size-3" />
          {t.footer.twitter}
        </a>
      </div>
    </footer>
  );
} 