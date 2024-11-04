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

// Export Bookmark Data 
interface BookmarkNode {
  id: string;
  title: string;
  url?: string; // optional because folders won't have a URL
  children?: BookmarkNode[]; // optional, for folders
}

// Define a formatted bookmark interface
interface FormattedBookmark {
  title: string;
  url?: string;
  children?: FormattedBookmark[];
}

// Function to format bookmarks data
function formatBookmarks(bookmarkNodes: BookmarkNode[]): FormattedBookmark[] {
  const formattedBookmarks: FormattedBookmark[] = [];

  function traverseNodes(nodes: BookmarkNode[]): FormattedBookmark[] {
      return nodes.map(node => {
          if (node.url) {
              // This is a bookmark
              return {
                  title: node.title,
                  url: node.url
              };
          } else if (node.children) {
              // This is a folder
              return {
                  title: node.title,
                  children: traverseNodes(node.children)
              };
          }
      }).filter(node => node !== undefined) as FormattedBookmark[];
  }

  return traverseNodes(bookmarkNodes);
}

interface BookmarkNode {
  id: string;
  title: string;
  url?: string; // optional because folders won't have a URL
  children?: BookmarkNode[];
  dateAdded?: number,
  dateLastUsed?: number,
  parentId?: string // optional, for folders
}
/*
{
    "dateAdded": 1686047235275,
    "dateLastUsed": 1728932091001,
    "id": "31",
    "index": 1,
    "parentId": "1",
    "title": "Telegram Web",
    "url": "https://web.telegram.org/k/"
}
*/
// Define a formatted bookmark interface
interface FormattedBookmark {
  title: string;
  url?: string;
  dateAdded?: number,
  dateLastUsed?: number,
  id?: string
  parentId?: string
}

// Function to flatten bookmarks data
function flattenBookmarks(bookmarkNodes: BookmarkNode[]): FormattedBookmark[] {
  const flattenedBookmarks: FormattedBookmark[] = [];

  function traverseNodes(nodes: BookmarkNode[]): void {
      nodes.forEach(node => {
          if (node.url) {
              // This is a bookmark, add it to the flat array
              flattenedBookmarks.push({
                  title: node.title,
                  url: node.url,
                  dateAdded: node?.dateAdded,
                  dateLastUsed: node?.dateLastUsed,
                  id: node.id,
                  parentId: node?.parentId
              });
          } else if (node.children) {
              // If this is a folder, traverse its children
              traverseNodes(node.children);
          }
      });
  }

  traverseNodes(bookmarkNodes);
  return flattenedBookmarks;
}

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "export-data-bookmark") {
    console.log("hlleod");
    
    chrome.bookmarks.getTree(async (bookmarkTreeNodes) => {
      const flattenedData = flattenBookmarks(bookmarkTreeNodes);
      console.log(bookmarkTreeNodes);
      console.log("Flattened Bookmarks:", JSON.stringify(flattenedData, null, 2));
    });
   
  }
  return true;
});