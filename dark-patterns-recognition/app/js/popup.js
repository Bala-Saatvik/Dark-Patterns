window.onload = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
  });

  var analyzeButton = document.getElementsByClassName("analyze-button")[0];
  if (analyzeButton) {
    analyzeButton.onclick = function () {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
      });
    };
  }

  var linkElement = document.getElementsByClassName("link")[0];
  if (linkElement) {
    linkElement.onclick = function () {
      chrome.tabs.create({
        url: linkElement.getAttribute("href"),
      });
    };
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "update_current_count") {
    var numberElement = document.getElementsByClassName("number")[0];
    if (numberElement) {
      numberElement.textContent = request.count;
    }
  }
});
