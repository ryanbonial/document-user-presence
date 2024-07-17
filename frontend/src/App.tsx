import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

import "./App.css";
import PresenceIndicator from "./PresenceIndicator";

function App() {
  const mockDocumentId = "a0d93771-e32d-41e9-9e68-03d708355cdb";
  const mockPageId = "4e16fa44-66eb-4d0c-bb6a-65de95023c9f";
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [thirdInput, setThirdInput] = useState("");
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userSaved, setUserSaved] = useState(false);
  const [usersPresent, setUsersPresent] = useState<{
    [userId: string]: { avatar: string; elementId: string };
  }>({});

  const socket = useRef<Socket>();

  const sendPresenceEvent = useCallback(
    (eventType: "element-focus" | "element-blur", elementId: string) => {
      if (!socket.current && elementId) {
        return;
      }
      socket.current?.emit(`${eventType}`, {
        message: {
          userId,
          avatar,
          elementId,
          documentId: mockDocumentId,
          pageId: mockPageId,
        },
      });
      console.log(`Sent ${eventType} event for element with id ${elementId}`);
    },
    [avatar, userId]
  );

  useEffect(() => {
    socket.current = io("http://localhost:3000");
    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Listen for events from the server
    socket.current.on("element-focus", (data) => {
      if (data.message.userId === userId) {
        return;
      }
      setUsersPresent((prevUsersPresent) => {
        return {
          ...prevUsersPresent,
          [data.message.userId]: {
            avatar: data.message.avatar,
            elementId: data.message.elementId,
          },
        };
      });
      console.log("Received data:", data);
    });
    socket.current.on("element-blur", (data) => {
      if (data.message.userId === userId) {
        return;
      }
      setUsersPresent((prevUsersPresent) => {
        if (
          data.message.elementId !==
          prevUsersPresent[data.message.userId].elementId
        ) {
          return prevUsersPresent;
        }
        const updatedUsersPresent = { ...prevUsersPresent };
        updatedUsersPresent[data.message.userId].elementId = "";
        return updatedUsersPresent;
      });
      console.log("Received data:", data);
    });

    // Clean up on component unmount
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>User Presence Example</h1>
          {JSON.stringify(usersPresent)}
        </header>
        {!userSaved && (
          <div>
            <div>
              <input
                type="text"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter emoji"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                maxLength={2}
              />
            </div>
            <button
              onClick={() => {
                setUserSaved(true);
              }}
              disabled={!userId || !avatar}
            >
              Login
            </button>
          </div>
        )}
        {userSaved && (
          <form>
            <div>
              <PresenceIndicator users={usersPresent}>
                <input
                  type="text"
                  placeholder="Enter text"
                  id="first-input"
                  value={firstInput}
                  onChange={(e) => setFirstInput(e.target.value)}
                  onFocus={(e) => {
                    sendPresenceEvent("element-focus", e.target.id);
                  }}
                  onBlur={(e) => {
                    sendPresenceEvent("element-blur", e.target.id);
                  }}
                />
              </PresenceIndicator>
            </div>
            <div>
              <PresenceIndicator users={usersPresent}>
                <input
                  type="text"
                  placeholder="Enter text"
                  id="second-input"
                  value={secondInput}
                  onChange={(e) => setSecondInput(e.target.value)}
                  onFocus={(e) => {
                    sendPresenceEvent("element-focus", e.target.id);
                  }}
                  onBlur={(e) => {
                    sendPresenceEvent("element-blur", e.target.id);
                  }}
                />
              </PresenceIndicator>
            </div>
            <div>
              <textarea
                placeholder="Enter text"
                id="third-input"
                value={thirdInput}
                onChange={(e) => setThirdInput(e.target.value)}
                onFocus={(e) => {
                  sendPresenceEvent("element-focus", e.target.id);
                }}
                onBlur={(e) => {
                  sendPresenceEvent("element-blur", e.target.id);
                }}
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default App;
