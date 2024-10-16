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
