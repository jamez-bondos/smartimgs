"use client";

import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HomeLandingDrop } from "@/components/HomeLandingDrop";
import { PromptContent } from "@/components/ui/prompt-content";
import { useLanguage } from "@/lib/i18n/language-provider";

export type StatusApp = "idle" | "processing" | "generating" | "error";

export default function Home() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<StatusApp>("idle");
  const [file, setFile] = useState<File>();
  const [activeView, setActiveView] = useState<"prompt" | null>(null);
  const [promptResult, setPromptResult] = useState<{
    title: string;
    prompt: string;
  }>();
  const [generatedVisual, setGeneratedVisual] = useState<string>();
  const [showMobileDetails] = useState(true);
  const [errorMesg, setErrorMesg] = useState<string | null>(null);
  const [promptLang, setPromptLang] = useState<string>("zh");

  const { toast } = useToast();

  const handleCopyPrompt = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: t.toasts.copied,
        description: t.toasts.copiedPrompt,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: t.toasts.copyFailed,
        description: t.toasts.copyFailedPrompt,
        variant: "destructive",
      });
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMesg(null);
    
    if (!file) {
      toast({
        title: t.toasts.noImage,
        description: t.toasts.noImageDescription,
        variant: "destructive",
      });
      return;
    }

    // Immediately set activeView to prompt and status to generating
    setActiveView("prompt"); 
    setStatus("generating");
    if (generatedVisual) URL.revokeObjectURL(generatedVisual); // Revoke old one if exists
    setGeneratedVisual(URL.createObjectURL(file)); // Set current image for display
    setPromptResult(undefined); // Explicitly clear prompt for loading state

    const apiFormData = new FormData();
    apiFormData.append("image", file);
    apiFormData.append("promptLang", promptLang);

    try {
      // Choose API endpoint based on model
      const apiEndpoint = "/api/reverse-image";
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to process error response" }));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.prompt) {
        setPromptResult({
          title: t.homePage.prompt,
          prompt: result.prompt,
        });
        setStatus("idle"); // Set to idle once data is successfully fetched
      } else {
        throw new Error(result.error || "No prompt found in API response");
      }

    } catch (error: unknown) {
      console.error("Error generating prompt:", error);
      const message = error instanceof Error 
        ? error.message 
        : "An unknown error occurred during generation.";
      setErrorMesg(message);
      toast({
        title: t.toasts.errorGeneratingPrompt,
        description: message,
        variant: "destructive",
      });
      setStatus("error"); // Keep activeView as "prompt" to show error in place
    }
  }

  const resetToSelect = () => {
    setActiveView(null);
    setFile(undefined);
    setPromptResult(undefined);
    setErrorMesg(null);
    if (generatedVisual) {
      URL.revokeObjectURL(generatedVisual);
      setGeneratedVisual(undefined);
    }
    setStatus("idle");
  };

  // Page title and description component
  const PageHeader = () => (
    <>
      <h1 className="text-center text-4xl font-bold md:text-5xl">
        {t.homePage.title}
      </h1>
      <p 
        className="mx-auto mt-6 max-w-md text-balance text-center leading-snug md:text-lg md:leading-snug"
        dangerouslySetInnerHTML={{ __html: t.homePage.description }}
      />
    </>
  );

  return (
    <div>
      {status === "idle" && !activeView ? (
        <div className="mt-4 md:mt-10">
          <PageHeader />
          <div className="mt-10 md:mt-16">
            <HomeLandingDrop
              status={status}
              file={file}
              setFile={(selectedFile) => {
                setFile(selectedFile);
                if (activeView) {
                  resetToSelect();
                }
              }}
              handleSubmit={handleSubmit}
              promptLang={promptLang}
              onPromptLangChange={setPromptLang}
            />
          </div>
        </div>
      ) : activeView === "prompt" ? (
        <div className="mt-4 px-4 md:mt-10">
          <div className="mx-auto max-w-3xl">
            <PageHeader />

            {/* Mobile view for details (collapsible) */}
            <div className="mt-10 md:mt-16 rounded-lg bg-gray-200 px-4 py-2 shadow md:hidden">
              {showMobileDetails && (
                <div className="mt-2">
                  <PromptContent 
                    title={promptResult?.title || t.homePage.prompt}
                    prompt={promptResult?.prompt || null} 
                    imageUrl={generatedVisual || null} 
                    fileName={file?.name}
                    onCopyPrompt={handleCopyPrompt}
                    isLoading={status === "generating"}
                    errorMessage={errorMesg}
                  />
                </div>
              )}
            </div>

            {/* Desktop view for details */}
            <div className="mt-10 md:mt-16 md:flex gap-4 hidden">
              <div className="w-full grow rounded-lg bg-white p-5 text-gray-500 shadow">
                <PromptContent 
                  title={promptResult?.title || t.homePage.prompt}
                  prompt={promptResult?.prompt || null} 
                  imageUrl={generatedVisual || null} 
                  fileName={file?.name}
                  onCopyPrompt={handleCopyPrompt}
                  isLoading={status === "generating"}
                  errorMessage={errorMesg}
                />
              </div>
            </div>

            {/* Select New Image button - styled */}
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={resetToSelect}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150"
                disabled={status === "generating"}
              >
                {t.homePage.selectNewImage}
              </Button>
            </div>
          </div>
        </div>
      ) : status === "error" && !activeView ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <PageHeader />
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">{t.homePage.errorTitle}</h2>
            <p className="text-gray-700 mb-6">{errorMesg || "An unexpected error occurred."}</p>
            <Button onClick={resetToSelect}>{t.homePage.tryAgain}</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
