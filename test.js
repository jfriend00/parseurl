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

var err = false;

function assert(val1, val2, txt) {
    txt = txt || "";
    if (val1 !== val2) {
        log(txt, ", Expecting: " + val1 + " === " + val2);
        err = true;
    }
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
for (var i = 0; i < testURLs.length; i++) {
    urlObj = new parseURL(testURLs[i]);
    if (urlObj.getURL() !== testURLs[i]) {
        err = true;
        log("difference(" + i + "): ", testURLs[i], "&nbsp;&nbsp;&nbsp;&nbsp;", urlObj.getURL());
    }
}

// test the various parts
urlObj = new parseURL("https://www.aaa.google.com:80/what%20ever/search.html/?aaa=bbb&ccc=ddd&eee=%20fff#jump12");
assert(urlObj.queryObject["aaa"], "bbb");
assert(urlObj.queryObject["eee"], " fff");
assert(urlObj.protocol, "https");
assert(urlObj.port, "80");
assert(urlObj.getFinalDomain(), "google.com");
assert(urlObj.getSubDomain(), "www.aaa");
assert(urlObj.containsPathComponent("what ever"), true);
assert(urlObj.getPortNum(), 80);
assert(urlObj.isSameOrigin("https://www.aaa.google.com:80/index.html"), true);
assert(urlObj.isSameOrigin("https://www.aaa.google.com/index.html"), false);
assert(urlObj.isSameOrigin("https://www.google.com/index.html"), false);
assert(urlObj.hash, "jump12");

urlObj = new parseURL("https://www.google.com");
assert(urlObj.isSameOrigin("https://www.google.com/index.html"), true);
assert(urlObj.isSameOrigin("http://www.google.com/index.html"), false);
assert(urlObj.isSameOrigin("https://google.com/index.html"), false);

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