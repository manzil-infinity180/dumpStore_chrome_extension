import React from "react";
import ReactDOM from "react-dom";
import CreateBookmark from "./components/CreateBookmark";

const Popup = () => {
  return (
    <div>
      <CreateBookmark />
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById("popup-root"));
