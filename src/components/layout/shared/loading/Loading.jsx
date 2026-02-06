import React from "react";

export const Loading = ({ text = "Cargando...", fullScreen = false }) => {
  const content = (
    <div className="app-loading__card">
      <div className="app-loading__spinner" />
      <div className="app-loading__text">{text}</div>
    </div>
  );

  if (fullScreen) {
    return <div className="app-loading app-loading--fullscreen">{content}</div>;
  }

  return <div className="app-loading">{content}</div>;
};

export default Loading;
