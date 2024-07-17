import { cloneElement, useContext } from "react";
import { UserPresenceContext } from "./context/UserPresenceContext";

const PresenceIndicator = ({
  children,
  label,
  description = "",
}: {
  children: React.ReactElement;
  label: string;
  description?: string;
}) => {
  const userPresenceContext = useContext(UserPresenceContext);
  const users = userPresenceContext?.usersPresent || {};

  const filteredUsers = Object.keys(users).filter(
    (user) => users[user].elementId === children?.props.id
  );

  return (
    <div>
      <strong>{label}</strong>
      <div className="user-indicator-avatars">
        {filteredUsers.map((user, index) => (
          <div key={index} className="user-avatar" title={user}>
            {users[user]?.avatar}
          </div>
        ))}
      </div>
      {description && <p>{description}</p>}

      {cloneElement(children, {
        // TODO: don't override onFocus/onBlur if they are already set, add to them
        onFocus: () => {
          userPresenceContext?.setPresenceEvent(
            "element-focus",
            children?.props.id
          );
        },
        onBlur: () => {
          userPresenceContext?.setPresenceEvent(
            "element-blur",
            children?.props.id
          );
        },
      })}
    </div>
  );
};

export default PresenceIndicator;
