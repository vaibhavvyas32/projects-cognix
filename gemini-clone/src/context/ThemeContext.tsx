import { createContext, useState } from "react";

interface GlobalThemeContext {
  theme: string;
  toggleTheme: () => void;
}

export const GlobalThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {
    "light";
  },
});

const ThemeProvider = (props: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <GlobalThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </GlobalThemeContext.Provider>
  );
};

export default ThemeProvider;
