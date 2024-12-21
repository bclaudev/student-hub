// src/components/UserAvatar.js
import React, { useState } from "react";
import AvatarCustomizationModal from "./AvatarCustomizationModel.js";

const UserAvatar = ({ name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState({
    name: name || "User",
    backgroundColor: "random",
    fontSize: 0.5,
  });

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = (newConfig) => {
    setAvatarConfig(newConfig);
    setIsModalOpen(false);
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    avatarConfig.name
  )}&background=${avatarConfig.backgroundColor}&size=128&font-size=${avatarConfig.fontSize}`;

  return (
    <div>
      <img
        src={avatarUrl}
        alt={`${avatarConfig.name}'s Avatar`}
        className="w-12 h-12 rounded-full cursor-pointer"
        onClick={handleAvatarClick}
      />
      {isModalOpen && (
        <AvatarCustomizationModal
          isOpen={isModalOpen}
          currentConfig={avatarConfig}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserAvatar;

