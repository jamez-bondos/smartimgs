"use client";

import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { MenuIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HomeLandingDrop } from "@/components/HomeLandingDrop";
import { DescriptionContent } from "@/components/ui/description-content";

export type StatusApp = "idle" | "processing" | "generating" | "error";

export default function Home() {
  const [status, setStatus] = useState<StatusApp>("idle");
  const [file, setFile] = useState<File>();
  const [activeView, setActiveView] = useState<"description" | null>(null);
  const [descriptionResult, setDescriptionResult] = useState<{
    title: string;
    description: string;
  }>();
  const [generatedVisual, setGeneratedVisual] = useState<string>();
  const [showMobileDetails, setShowMobileDetails] = useState(true);
  const [errorMesg, setErrorMesg] = useState<string | null>(null);

  const { toast } = useToast();

  const handleCopyDescription = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Description copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMesg(null);
    const formData = new FormData(e.currentTarget);
    const model = formData.get("model") as string;

    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image file to generate a description.",
        variant: "destructive",
      });
      return;
    }

    // Immediately set activeView to description and status to generating
    setActiveView("description"); 
    setStatus("generating");
    if (generatedVisual) URL.revokeObjectURL(generatedVisual); // Revoke old one if exists
    setGeneratedVisual(URL.createObjectURL(file)); // Set current image for display
    setDescriptionResult(undefined); // Explicitly clear description for loading state

    const apiFormData = new FormData();
    apiFormData.append("image", file);

    try {
      // Choose API endpoint based on model
      const apiEndpoint = "/api/describe-image";
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to process error response" }));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.description) {
        setDescriptionResult({
          title: "Prompt",
          description: result.description,
        });
        setStatus("idle"); // Set to idle once data is successfully fetched
      } else {
        throw new Error(result.error || "No description found in API response");
      }

    } catch (error: any) {
      console.error("Error generating description:", error);
      const message = error.message || "An unknown error occurred during generation.";
      setErrorMesg(message);
      toast({
        title: "Error Generating Description",
        description: message,
        variant: "destructive",
      });
      setStatus("error"); // Keep activeView as "description" to show error in place
    }
  }

  const resetToSelect = () => {
    setActiveView(null);
    setFile(undefined);
    setDescriptionResult(undefined);
    setErrorMesg(null);
    if (generatedVisual) {
      URL.revokeObjectURL(generatedVisual);
      setGeneratedVisual(undefined);
    }
    setStatus("idle");
  };

  return (
    <div>
      {status === "idle" && !activeView ? (
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
        />
      ) : activeView === "description" ? (
        <div className="mt-4 px-4 md:mt-10">
          <div className="mx-auto max-w-3xl">
            {/* Added Titles - Start */}
            <h1 className="text-center text-4xl font-bold md:text-5xl">
              Describe Images
              <br /> in seconds
            </h1>
            <p 
              className="mx-auto mt-6 max-w-md text-balance text-center leading-snug md:text-lg md:leading-snug"
              dangerouslySetInnerHTML={{ __html: "Upload an <strong>image</strong> to get an AI-generated description." }}
            />
            {/* Added Titles - End */}

            {/* Mobile view for details (collapsible) */}
            <div className="mt-12 rounded-lg bg-gray-200 px-4 py-2 shadow md:hidden">
              {showMobileDetails && (
                <div className="mt-2">
                  <DescriptionContent 
                    title={descriptionResult?.title || "Prompt"}
                    description={descriptionResult?.description || null} 
                    imageUrl={generatedVisual || null} 
                    fileName={file?.name}
                    onCopyDescription={handleCopyDescription}
                    isLoading={status === "generating"}
                    errorMessage={errorMesg}
                  />
                </div>
              )}
            </div>

            {/* Desktop view for details */}
            <div className="mt-12 md:flex gap-4 hidden">
              <div className="w-full grow rounded-lg bg-white p-5 text-gray-500 shadow">
                <DescriptionContent 
                  title={descriptionResult?.title || "Prompt"}
                  description={descriptionResult?.description || null} 
                  imageUrl={generatedVisual || null} 
                  fileName={file?.name}
                  onCopyDescription={handleCopyDescription}
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
                Select New Image
              </Button>
            </div>
          </div>
        </div>
      ) : status === "error" && !activeView ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Generation Failed</h2>
          <p className="text-gray-700 mb-6">{errorMesg || "An unexpected error occurred."}</p>
          <Button onClick={resetToSelect}>Try Again</Button>
        </div>
      ) : null}
    </div>
  );
}
