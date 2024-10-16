import React, { useEffect, useState } from "react";
// import { MemoryRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import CreateBookmark from "./components/CreateBookmark";
type TProvider = string;
type TState = "create" | "update" | "null";
const Popup = () => {
  const [state, setState] = useState<TState>("null");
  const handleAuth = (provider: TProvider) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `http://localhost:3008/auth/${provider}`,
        interactive: true,
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          return new Error(
            `WebAuthFlow failed: ${
              chrome.runtime.lastError?.message || "Unknown error"
            }`
          );
        }
        const urlParams = new URLSearchParams(new URL(redirectUrl).search);
        const token = urlParams.get("token");
        chrome.runtime.sendMessage(
          {
            type: "formdata",
            redirectUrl,
            token,
          },
          (response) => {
            console.log(response);
          }
        );
      }
    );
  };

  const handleAllBookmark = async () => {
    const req = await fetch("http://localhost:3008/api/get-all-bookmark", {
      credentials: "include",
    });
    const data = await req.json();
    console.log(data);
    chrome.runtime.sendMessage(
      {
        type: "bookmark",
        data,
      },
      (response) => {
        console.log(response);
      }
    );
  };
  return (
    <div style={{ minWidth: "400px", minHeight: "500px" }}>
      {/* <UpdateBookmark />
       */}
      <button onClick={() => handleAuth("google")}>Google</button>
      <button onClick={() => handleAuth("github")}>Github</button>
      {/* <button onClick={() => handleAuth("github")}>Go to other page</button> */}
      <button onClick={handleAllBookmark}>GET DATA</button>
      <button onClick={() => setState("create")}>Create</button>
      <button onClick={() => setState("update")}>Update</button>
      {/* <button onClick={handleAllBookmark}>Logout</button> */}

      {state === "create" && <CreateBookmark />}
      {state === "update" && <CreateBookmark />}
      {state === "null" && (
        <div>
          <h1>dumpStore - Bookmark Your Link</h1>
          <p>You can create and update bookmark from here</p>
          <p>For more functionality you can go to website</p>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
