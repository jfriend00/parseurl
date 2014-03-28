function log(args) {
    var str = "";
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "object") {
            str += JSON.stringify(arguments[i]);
        } else {
            str += arguments[i];
        }
    }
    var div = document.createElement("div");
    div.innerHTML = str;
    document.body.appendChild(div);
}


var testURLs = [
    "http://www.example.com/",
    "http://www.example.com/whatever",
    "https://www.aaa.google.com:80/what%20ever/search.html/?aaa=bbb&ccc=ddd&eee=%20fff#jump12",
    "http://example.com",
    "http://www.example.com",
    "http://www.example.com/what%20ever",
    "http://www.example.com/whatever?test=foo",
    "http://www.example.com/whatever?test=foo#hello",
];

var urlObj;
var err = false;
for (var i = 0; i < testURLs.length; i++) {
    urlObj = new parseURL(testURLs[i]);
    if (urlObj.getURL() !== testURLs[i]) {
        err = true;
        log("difference(" + i + "): ", testURLs[i], "&nbsp;&nbsp;&nbsp;&nbsp;", urlObj.getURL());
    }
}
if (!err) {
    log("All tests successful");
}


/*
var o = new URL("https://www.aaa.google.com:80/what%20ever/search.html/?aaa=bbb&ccc=ddd&eee=%20fff#jump12");
log("getURL(): ", o.getURL());
log("finalDomain(): ", o.getFinalDomain());
log("subDomain(): ", o.getSubDomain());
for (var prop in o) {
    if (o.hasOwnProperty(prop)) {
        log(prop, ": ", o[prop]);
    }
}
*/