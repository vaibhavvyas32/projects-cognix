import "../../styles/Main.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { GlobalThemeContext } from "../../context/ThemeContext";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);
  const { theme } = useContext(GlobalThemeContext);

  return (
    <div className={`main ${theme}`}>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon1} alt="" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Genx</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest something somethingsomething something</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Corporis quod alias, illo eveniet ae aliquam vero accusantium!
                  Ad, minima sed!
                </p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Illoibusdam odit illum eveniet accusantium quia. Voluptatem,
                  expedita aliquam!
                </p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>
                  Lorem ipsum dolor sit amet, veniam optio unde exercitationem,
                  suscipit ex voluptatem ad! Fugiat qui eum eius?
                </p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon1} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input ? (
                <img
                  onClick={() => onSent(input)}
                  src={assets.send_icon}
                  alt="send button"
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            voluptatum laborum dicta
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
