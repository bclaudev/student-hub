import React from "react";

const UserAvatar = ({
  name,
  size = 32,
  textColor = "#FFFFFF", // Default text color is white
}) => {
  // Generate initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Define a selection of background colors
  const backgroundColors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
  
  // Pick a random color from the array
  const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: randomColor,
        fontSize: size * 0.5, // Font size is 50% of the circle size
        color: textColor,
        fontWeight: "bold", // Use bold font weight
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        textTransform: "uppercase", // Ensure letters are uppercase
      }}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
