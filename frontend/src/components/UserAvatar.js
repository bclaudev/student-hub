import React from "react";

const UserAvatar = ({ name, size }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&size=${size * 2}&background=random&color=fff`;

  return (
    <img
      src={avatarUrl}
      alt="User Avatar"
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
};

export default UserAvatar;
