import React from "react";
import { useSelector } from "../store"


// username/repo format
const REPO_NAME = "jinsujj/next_core_blog";

export const useUtterances = (noteId: string) => {
  const isDarkMode = useSelector((state) => state.common.isDark);

  React.useEffect(() => {
    const loadUtterancesScript = () => {
      const scriptParentNode = document.getElementById(noteId);
      if (!scriptParentNode) {
        return;
      }

      // remove previous script if exists
      while (scriptParentNode.firstChild) {
        scriptParentNode.removeChild(scriptParentNode.firstChild);
      }

      // Load Utterances script
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.async = true;
      script.setAttribute("repo", REPO_NAME);
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "✨comment✨");
      script.setAttribute("crossorigin", "anonymous");
      script.setAttribute("theme", isDarkMode ? "github-dark" : "github-light");
      scriptParentNode.appendChild(script);
    };

    const observer = new MutationObserver(() => {
      if (document.getElementById(noteId)) {
        observer.disconnect(); 
        loadUtterancesScript();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [noteId, isDarkMode]);
};

export default useUtterances;