import { useContext, useState } from "react";
import "../../styles/Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { GlobalThemeContext } from "../../context/ThemeContext";

function Sidebar() {
  const [extended, setExtended] = useState(false);
  const { onSent, newChat, setRecentPrompt, previousPrompt } =
    useContext(Context);
  const loadPrompt = async (prompt: string) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };
  const { theme, toggleTheme } = useContext(GlobalThemeContext);
  return (
    <div className={`sidebar ${theme}`}>
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt=""
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {previousPrompt.map((item) => {
              return (
                <div
                  onClick={() => {
                    loadPrompt(item);
                  }}
                  className="recent-entry"
                >
                  <img src={assets.message_icon} alt="" />
                  <p>{item.slice(0, 18)} ...</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img onClick={toggleTheme} src={assets.bulb_icon} alt="" />
          {extended ? <p>Theme</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
