chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: "index.html" });
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "formdata") {
    console.log(message);
    console.log(message.token);
    // console.log(message.data);
  }
  return true;
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "bookmark") {
    console.log(message);
    console.log(message.data);
    // console.log(message.data);
  }
  return true;
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "tab") {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log(tabs[0].url);
    });
  }
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "tabx") {
    console.log(message);
    async function getCurrentTabUrl() {
      const tabs = await chrome.tabs.query({ active: true });
      console.log(tabs);
      return tabs[0].url;
    }
    (async () => {
      // see the note below on how to choose currentWindow or lastFocusedWindow
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      console.log(tab.url);
      // ..........
    })();
  }
});

let isPopupOpen: boolean = false; // Track popup state

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (isPopupOpen) {
    // Close the popup by setting an empty popup
    chrome.action.setPopup({ popup: "" });
    isPopupOpen = false;
  } else {
    // Open the popup by setting the popup to popup.html
    chrome.action.setPopup({ popup: "popup.html" });
    isPopupOpen = true;
  }
});
