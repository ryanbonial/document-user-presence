import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const UserPresenceContext = createContext<
  | {
      usersPresent: {
        [userId: string]: { avatar: string; elementId: string; id: string };
      };
      setPresenceEvent: (
        eventType: "element-focus" | "element-blur",
        elementId: string
      ) => void;
      userId: string;
      setUserId: (userId: string) => void;
      avatar: string;
      setAvatar: (avatar: string) => void;
    }
  | undefined
>(undefined);

const UserPresenceProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const mockDocumentId = "a0d93771-e32d-41e9-9e68-03d708355cdb";
  const mockPageId = "4e16fa44-66eb-4d0c-bb6a-65de95023c9f";

  const [usersPresent, setUsersPresent] = useState<{
    [userId: string]: { avatar: string; elementId: string; id: string };
  }>({});
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
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
            id: data.id,
          },
        };
      });
    });

    socket.current.on("element-blur", (data) => {
      if (data.message.userId === userId) {
        return;
      }
      setUsersPresent((prevUsersPresent) => {
        if (
          data.message.elementId !==
          prevUsersPresent[data.message.userId]?.elementId
        ) {
          return prevUsersPresent;
        }
        const updatedUsersPresent = { ...prevUsersPresent };
        updatedUsersPresent[data.message.userId].elementId = "";
        updatedUsersPresent[data.message.userId].id = data.id;
        return updatedUsersPresent;
      });
    });

    socket.current.on("user-disconnected", (data) => {
      setUsersPresent((prevUsersPresent) => {
        // find the user that disconnected by socket id
        if (!data.id) {
          return prevUsersPresent;
        }

        const disconnectedUser = Object.keys(prevUsersPresent).find(
          (userId) => prevUsersPresent[userId]?.id === data.id
        );

        if (!disconnectedUser) {
          return prevUsersPresent;
        }
        delete prevUsersPresent[disconnectedUser];
        const updatedUsersPresent = { ...prevUsersPresent };
        return updatedUsersPresent;
      });
      console.log("Received data:", data);
    });

    // Clean up on component unmount
    return () => {
      socket.current?.disconnect();
    };
  }, [userId]);

  return (
    <UserPresenceContext.Provider
      value={{
        usersPresent,
        setPresenceEvent: (
          eventType: "element-focus" | "element-blur",
          elementId: string
        ) => sendPresenceEvent(eventType, elementId),
        userId,
        setUserId: (userId) => setUserId(userId),
        avatar,
        setAvatar: (avatar) => setAvatar(avatar),
      }}
    >
      {children}
    </UserPresenceContext.Provider>
  );
};

export { UserPresenceContext, UserPresenceProvider };
