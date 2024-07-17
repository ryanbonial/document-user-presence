import { useContext, useState } from "react";

import "./App.css";
import PresenceIndicator from "./PresenceIndicator";
import { UserPresenceContext } from "./context/UserPresenceContext";

function App() {
  const userPresenceContext = useContext(UserPresenceContext);

  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [loginUserId, setLoginUserId] = useState("");
  const [loginAvatar, setLoginAvatar] = useState("");

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>User Presence Example</h1>
          {userPresenceContext?.userId &&
            JSON.stringify(userPresenceContext?.usersPresent)}
        </header>
        {!userPresenceContext?.userId && (
          <div>
            <div>
              <input
                type="text"
                placeholder="Enter user ID"
                value={loginUserId}
                onChange={(e) => setLoginUserId(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter emoji"
                value={loginAvatar}
                onChange={(e) => setLoginAvatar(e.target.value)}
                maxLength={3}
              />
            </div>
            <button
              onClick={() => {
                userPresenceContext?.setUserId(loginUserId);
                userPresenceContext?.setAvatar(loginAvatar);
              }}
              disabled={!loginUserId || !loginAvatar}
            >
              Login
            </button>
          </div>
        )}
        {userPresenceContext?.userId && (
          <form>
            <div>
              <PresenceIndicator label="First input" description="First one">
                <input
                  type="text"
                  placeholder="Enter text"
                  id="first-input"
                  value={firstInput}
                  onChange={(e) => setFirstInput(e.target.value)}
                />
              </PresenceIndicator>
            </div>
            <div>
              <PresenceIndicator
                label="Second Input"
                description="This is the second one"
              >
                <input
                  type="text"
                  placeholder="Enter text"
                  id="second-input"
                  value={secondInput}
                  onChange={(e) => setSecondInput(e.target.value)}
                />
              </PresenceIndicator>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default App;
