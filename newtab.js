console.log("Excalidraw New Tab extension loaded");

document.addEventListener("DOMContentLoaded", function () {
  // Load saved Excalidraw data if it exists
  chrome.storage.local.get(["excalidrawData"], function (result) {
    if (result.excalidrawData) {
      const iframe = document.getElementById("excalidrawFrame");
      iframe.addEventListener("load", function () {
        iframe.contentWindow.postMessage(
          { type: "excalidraw", data: result.excalidrawData },
          "https://excalidraw.com"
        );
      });
    }
  });

  // Save Excalidraw data when the window is about to unload
  window.addEventListener("beforeunload", function () {
    const iframe = document.getElementById("excalidrawFrame");
    iframe.contentWindow.postMessage(
      { type: "excalidraw:getScene" },
      "https://excalidraw.com"
    );
  });

  // Listen for messages from the Excalidraw iframe
  window.addEventListener("message", function (event) {
    if (
      event.origin === "https://excalidraw.com" &&
      event.data.type === "excalidraw:scene"
    ) {
      chrome.storage.local.set({ excalidrawData: event.data }, function () {
        console.log("Excalidraw data saved");
      });
    }
  });
});
