import React, { useEffect, useState } from "react";
// import { MemoryRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import CreateBookmark from "./components/CreateBookmark";
import BookmarkCard from "./components/BookmarkCard";
import { TbEdit } from "react-icons/tb";
type TProvider = string;
type TState = "create" | "update" | "null";
export interface IBookMark {
  _id: string;
  title: string;
  link: string;
  tag: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  topics?: string;
  // _v: number;
}
const Popup = () => {
  const [state, setState] = useState<TState>("null");
  const [allBookmark, setAllBookmark] = useState<IBookMark[]>([]);
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
    setAllBookmark(data.data as IBookMark[]);
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
  const handleUpdateAndBookmark = async () => {
    await handleAllBookmark();
    setState("update");
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
      <button onClick={handleUpdateAndBookmark}>Update</button>
      {/* <button onClick={handleAllBookmark}>Logout</button> */}

      {state === "create" && <CreateBookmark />}
      {state === "update" && (
        <>
          {allBookmark.length > 0 &&
            allBookmark.map((el) => (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    backgroundColor: "#e2e8f0", // bg-slate-100
                    cursor: "pointer",
                    maxHeight: "18rem", // max-h-72
                    minWidth: "16rem", // min-w-64
                    maxWidth: "24rem", // max-w-96
                    border: "1px solid #e2e8f0", // border
                  }}
                  onClick={() => window.open(el.link)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        display: "inline-block",
                        height: "4rem",
                        width: "4rem",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                      src={el.image}
                      alt="bookmark"
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* <Link to={data.link} target="_blank" style={{ textDecoration: "none" }}> */}
                    <h1
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      {el.title}
                    </h1>
                    <div>
                      {el.tag.includes(",") &&
                        el.tag.split(",").map((x: string) => (
                          <button
                            key={x}
                            style={{
                              width: "25%",
                              backgroundColor: "white",
                              border: "1px solid #94a3b8", // border-slate-500
                              borderRadius: "12px",
                              margin: "0.25rem",
                            }}
                          >
                            {x}
                          </button>
                        ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      opacity: 0.4,
                    }}
                    // onClick={() => navigate(`/edit/${data._id}`)}
                  >
                    <TbEdit
                      style={{ fontSize: "1.25rem", marginRight: "0.25rem" }}
                    />
                    {/* <p>{FindDate(el.createdAt as Date)}</p> */}
                  </div>
                </div>
              </>
            ))}
        </>
      )}
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
