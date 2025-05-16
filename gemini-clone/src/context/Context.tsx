import { createContext, useState } from "react";
import run from "../config/gemini";

interface GlobalContext {
  onSent: (prompt: string) => void;
  recentPrompt: string;
  showResult: boolean;
  loading: boolean;
  resultData: string;
  setInput: (value: string) => void;
  input: string;
  previousPrompt: string[];
  newChat: () => void;
  setRecentPrompt: (prompt: string) => void;
}

export const Context = createContext<GlobalContext>({
  onSent: () => {},
  recentPrompt: "",
  showResult: false,
  loading: false,
  resultData: "",
  setInput: () => {},
  input: "",
  previousPrompt: [],
  newChat: () => {},
  setRecentPrompt: () => {},
});

const ContextProvider = (props: { children: React.ReactNode }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index: number, nextWord: string) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
  const onSent = async (prompt: string) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response: string;

    const isCodeRequest = /generate code|show code|give me code/i.test(prompt);

    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPreviousPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }

    const responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    // Handles ## Heading 2
    newResponse = newResponse.replace(/##\s*(.*)/g, "<h2>$1</h2>");

    // if the prompt has to generate code then
    if (isCodeRequest) {
      newResponse = `\`\`\`javascript\n${newResponse}\n\`\`\``;
    }

    //handle ``` in inline code blocks
    newResponse = newResponse.replace(
      /```([^```]+)```/g,
      "<pre><code>$1</code></pre>"
    );

    const newResponse2 = newResponse.split("*").join("</br>");
    const newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };
  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
