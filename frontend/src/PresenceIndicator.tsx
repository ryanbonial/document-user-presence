const PresenceIndicator = ({
  users,
  children,
}: {
  users: {
    [userId: string]: { avatar: string; elementId: string };
  };
  children: React.ReactElement;
}) => {
  const maxAvatars = 5;

  const filteredUsers = Object.keys(users).filter(
    (user) => users[user].elementId === children?.props.id
  );
  const displayedUsers = Object.keys(filteredUsers).slice(0, maxAvatars);
  const remainingUsers = Object.keys(filteredUsers).length - maxAvatars;

  return (
    <div className="user-indicator-container">
      {children}
      <div className="user-indicator-avatars">
        {displayedUsers.map((user, index) => (
          <div key={index} className="user-avatar" title={user}>
            {users[user]?.avatar}
          </div>
        ))}
        {remainingUsers > 0 && (
          <div
            className="user-avatar more-users"
            title={`${remainingUsers} more users`}
          >
            +{remainingUsers}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresenceIndicator;
