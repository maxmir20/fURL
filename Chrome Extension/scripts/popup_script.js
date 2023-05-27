function copyAddressBar(){

    let url = window.location.href;

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

copyAddressBar();
