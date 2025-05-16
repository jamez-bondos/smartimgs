"use client";

import { CopyIcon, Loader } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-provider";

// Helper function to truncate filename
const truncateFilename = (filename: string | undefined, maxLength = 25) => {
  if (!filename) return "";
  if (filename.length <= maxLength) return filename;
  
  // Find the last dot to preserve extension
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    // No extension
    return `${filename.substring(0, maxLength - 3)}...`;
  }

  const extension = filename.substring(lastDotIndex);
  const nameWithoutExtension = filename.substring(0, lastDotIndex);
  
  // If name is too short, just add ...
  if (nameWithoutExtension.length <= 10) {
    return `${nameWithoutExtension.substring(0, 5)}...${extension}`;
  }
  
  // Otherwise keep some chars from start and end
  const charsToKeep = Math.floor((maxLength - 3 - extension.length) / 2);
  return `${nameWithoutExtension.substring(0, charsToKeep)}...${nameWithoutExtension.substring(nameWithoutExtension.length - charsToKeep)}${extension}`;
};

export function PromptContent({
  title,
  prompt,
  imageUrl,
  fileName,
  onCopyPrompt,
  isLoading,
  errorMessage,
}: {
  title: string;
  prompt: string | null;
  imageUrl: string | null;
  fileName?: string;
  onCopyPrompt?: (textToCopy: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}) {
  const { t } = useLanguage();
  
  const handleCopy = () => {
    if (prompt && !isLoading && !errorMessage && onCopyPrompt) {
      onCopyPrompt(prompt);
    }
  };

  const canCopy = !!prompt && !isLoading && !errorMessage;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {imageUrl && (
        <div className="md:w-1/2 flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between h-10 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {t.prompt.imagePreview} {fileName && <span className="text-gray-500 text-sm ml-1">{truncateFilename(fileName)}</span>}
            </h3>
          </div>
          <div className="h-[360px] w-full flex items-center justify-center overflow-hidden border border-gray-200 rounded-md bg-gray-50">
            <img
              className="rounded-md object-contain max-h-full max-w-full"
              src={imageUrl}
              alt={title}
            />
          </div>
        </div>
      )}
      <div className="md:w-1/2">
        <div className="flex items-center justify-between h-10 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {onCopyPrompt && (
            <button
              onClick={handleCopy}
              className={`p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md ${
                !canCopy ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label={t.prompt.copy}
              disabled={!canCopy}
            >
              <CopyIcon size={18} />
            </button>
          )}
        </div>
        <div className="text-base text-left relative">
          <textarea
            className="w-full h-[360px] px-4 py-3 rounded-md border border-gray-200 focus:outline-none font-sans text-base resize-none text-gray-900 bg-gray-50"
            value={prompt || ""}
            readOnly
            spellCheck="false"
            style={{
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              WebkitTextFillColor: 'inherit',
            }}
            onClick={(e) => {
              if (e.detail === 3) {
                (e.target as HTMLTextAreaElement).select();
              }
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-50">
              <Loader className="animate-spin text-gray-400 w-8 h-8" />
            </div>
          )}
          
          {errorMessage && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-50/80">
              <p className="text-red-600">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
