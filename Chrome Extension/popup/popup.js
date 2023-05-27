
async function getCurrentTab(){
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}

(async()=> {
    chrome.tabs.update({ active: true });

    let tabID = await getCurrentTab();

    chrome.scripting.executeScript({
        target : {tabId: tabID, allFrames : true },
        files: ["scripts/popup_script.js"]
        });
})();
