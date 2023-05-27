

//This will take a URL and copy it to the clipboard using document.execCommand
function copyURL(url){

//  add URL element and confirm that we have a valid URL
    let copyFrom = document.createElement('input');
    copyFrom.type = 'url';
    copyFrom.value = url;
    if (!copyFrom.checkValidity()) {
        console.log("copied value isn't a url: " + copyFrom.value);
        return;
    }

//  trim the url of any utm elements
    copyFrom.value = trimURL(url);

//  update clipboard
    document.body.appendChild(copyFrom);
    copyFrom.select()
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
    return;
}

function trimURL(url){
//  search for query parameters
    const utm_params = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"]);

    let path_split = url.split('?')
    let updated_params = "";
    if  (path_split.length > 1) {
        let query_params = path_split[1].split('&');

        for (let i=0; i < query_params.length; i++) {
            let [key, value] = query_params[i].split('=');
            if (key && !(utm_params.has(key))) {
//              re-adding the parameter if it's not in our utm list
                updated_params += key + '=' + value;
            }
        }
    }

    if (updated_params){
        updated_params = "?" + updated_params
    }
//  return updated URL
    return path_split[0] + updated_params;

}


//Content Script for Pages: Detect Copy Events and Right Clicks
function addCopyEventListeners(){

//  Event listener for when we copy text using Ctrl+C or "Copy"
    window.addEventListener("copy", (event) => {
        const selection = window.getSelection();
        event.clipboardData.setData("text/plain",
            trimURL(selection.toString()));

        event.preventDefault();
    });

//  Event listener for when we right click on a hyperlink
    window.addEventListener("contextmenu", (event) => {
//      Confirm that right click is clicked
        if (event.button !== 2) {
            return;
        }

//      Select word where mouse is
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        range.expand('word');
        selection.addRange(range);

//      check if we can find an anchor node among parentNodes (indicating that the selection is a hyperlink)
        let currNode = selection.anchorNode.parentNode
        while (currNode) {
            if (currNode.href) {
//              check if user has navigated to a new page within the 3 seconds (indicating "Open in..." has been selected)
                setTimeout(function () {
                    if (document.hasFocus()) {
//                      copy to clipboard
                        copyURL(currNode.href);
                    } else {
                        console.log("document not in focus");
                        return;
                    }
                }, 3000);
                break;
            } else {
                currNode = currNode.parentNode;
            }
        }
    });
}

addCopyEventListeners();
