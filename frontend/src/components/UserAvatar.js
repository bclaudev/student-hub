import React from "react";

const UserAvatar = ({ name = "User", size = 64 }) => {
  const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
      <div
          style={{
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "#A585FF",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: size / 2,
              fontWeight: "bold",
          }}
      >
          {initials}
      </div>
  );
};

export default UserAvatar;

