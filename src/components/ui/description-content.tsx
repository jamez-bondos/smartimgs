"use client";

import { CopyIcon } from "lucide-react";

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

export function DescriptionContent({
  title,
  description,
  imageUrl,
  fileName,
  onCopyDescription,
  isLoading,
  errorMessage,
}: {
  title: string;
  description: string | null;
  imageUrl: string | null;
  fileName?: string;
  onCopyDescription?: (textToCopy: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}) {
  const handleCopy = () => {
    if (description && !isLoading && !errorMessage && onCopyDescription) {
      onCopyDescription(description);
    }
  };

  const canCopy = !!description && !isLoading && !errorMessage;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {imageUrl && (
        <div className="md:w-1/2 flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between h-10 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Image {fileName && <span className="text-gray-500 text-sm ml-1">{truncateFilename(fileName)}</span>}
            </h3>
          </div>
          <div className="h-[320px] w-full flex items-center justify-center overflow-hidden border border-gray-200 rounded-md bg-gray-50">
            <img
              className="rounded-md object-contain max-h-full max-w-full"
              src={imageUrl}
              alt={title || "description image"}
            />
          </div>
        </div>
      )}
      <div className="md:w-1/2">
        <div className="flex items-center justify-between h-10 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {onCopyDescription && (
            <button
              onClick={handleCopy}
              className={`p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md ${
                !canCopy ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Copy description"
              disabled={!canCopy}
            >
              <CopyIcon size={18} />
            </button>
          )}
        </div>
        <div className="text-base text-left relative">
          <textarea
            className="w-full h-[320px] px-4 py-3 rounded-md border border-gray-200 focus:outline-none font-sans text-base resize-none bg-gray-50"
            value={description || ""}
            readOnly
            spellCheck="false"
            style={{
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              WebkitTextFillColor: 'inherit', // Ensures the text color remains normal despite being readonly
            }}
            onClick={(e) => {
              // Allow triple click to select all text
              if (e.detail === 3) {
                (e.target as HTMLTextAreaElement).select();
              }
            }}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-50/80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
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
