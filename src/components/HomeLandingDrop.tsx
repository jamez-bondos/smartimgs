"use client";

import { SparklesIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Dropzone, { Accept } from "react-dropzone";
import HomepageImage1 from "./images/homepage-image-1";
import HomepageImage2 from "./images/homepage-image-2";
import { StatusApp } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/language-provider";

// Helper function to truncate filename
const truncateFilename = (filename: string, maxLength = 25) => {
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

export const HomeLandingDrop = ({
  status,
  file,
  setFile,
  handleSubmit,
  promptLang,
  onPromptLangChange,
}: {
  status: StatusApp;
  file?: File | null;
  setFile: (file: File | undefined) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  promptLang: string;
  onPromptLangChange: (lang: string) => void;
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const acceptType: Accept = { 
    "image/png": [".png"], 
    "image/jpeg": [".jpg", ".jpeg"], 
    "image/webp": [".webp"] 
  };

  useEffect(() => {
    // Cleanup function to revoke the object URL
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleFileDrop = (acceptedFiles: File[]) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "📁 File Too Large",
          description: "⚠️ File size must be less than 5MB",
        });
        setFile(undefined);
        return;
      }
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(undefined);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto max-w-md px-4"
      >
        <div className="pointer-events-none absolute left-[-40px] top-[-105px] flex w-[200px] items-center md:-left-[calc(min(30vw,350px))] md:-top-20 md:w-[390px]">
          <HomepageImage1 />
        </div>
        <div className="pointer-events-none absolute right-[20px] top-[-30px] flex w-[70px] justify-center md:-right-[calc(min(30vw,350px))] md:-top-5 md:w-[390px]">
          <HomepageImage2 />
        </div>

        <div className="relative">
          <div className="flex flex-col rounded-xl bg-white px-6 py-6 shadow md:px-12 md:py-8">
            <label className="text-gray-500" htmlFor="file">
              {t.fileUpload.dropzone}
            </label>
            <Dropzone
              multiple={false}
              accept={acceptType}
              onDrop={handleFileDrop}
            >
              {({ getRootProps, getInputProps, isDragAccept }) => (
                <div
                  className={`mt-2 flex flex-col aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-100 ${isDragAccept ? "border-blue-500" : "border-gray-250"}`}
                  {...getRootProps()}
                >
                  <input required={!file} {...getInputProps()} />
                  <div className="text-center">
                    {file && imagePreviewUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={imagePreviewUrl} alt="Preview" className="max-h-40 max-w-full object-contain mb-2"/>
                        <p className="text-sm text-gray-600 truncate max-w-full px-2">{truncateFilename(file.name)}</p>
                      </div>
                    ) : (
                      <Button type="button" className="md:text-base">
                        {t.fileUpload.selectImage}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Dropzone>
            <label className="mt-8 text-gray-500" htmlFor="promptLang">
              {t.fileUpload.promptLangLabel}
            </label>
            <Select value={promptLang} name="promptLang" onValueChange={onPromptLangChange}>
              <SelectTrigger className="mt-2 bg-gray-100" id="promptLang">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-8 text-center">
            <Button
              type="submit"
              variant="secondary"
              className="w-60 border bg-white/80 text-base font-semibold hover:bg-white md:w-auto"
              disabled={status === "processing" || !file}
            >
              <SparklesIcon />
              {t.fileUpload.describe}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
