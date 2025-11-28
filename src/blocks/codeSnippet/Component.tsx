"use client";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import React, { useEffect, useRef } from "react";

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const scriptExecuted = useRef(false); // Ref to track if script has been executed

  useEffect(() => {
    // If the language is JavaScript and the script hasn't been executed yet
    if (language === "javascript" && !scriptExecuted.current) {
      try {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.textContent = code; // Set the code as the script content
        document.body.appendChild(script); // Execute the script by adding it to the body

        scriptExecuted.current = true; // Mark that the script has been executed

        // Cleanup: Remove the script after execution to avoid duplication or memory leaks
        return () => {
          document.body.removeChild(script);
          scriptExecuted.current = false; // Reset flag on cleanup
        };
      } catch (error) {
        console.error("Error executing JavaScript:", error);
      }
    }
  }, [language, code]);

  return (
    <div>
      <MaxWidthWrapper>
        {/* Render HTML code safely */}
        {language === "html" ? (
          <div dangerouslySetInnerHTML={{ __html: code }} />
        ) : null} {/* Only render HTML if the language is HTML */}

        {/* For non-JavaScript code (CSS, plain text, etc.), show the code as plain text */}
        {language !== "javascript" && language !== "html" && (
          <pre className="overflow-x-auto p-2 bg-gray-800 rounded-md">
            <code>{code}</code>
          </pre>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default CodeBlock;
