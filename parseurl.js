function parseURL(url) {
    this.parse(url);
}

parseURL.prototype = {
    init: function() {
        this.origURL = "";
        // protocol normalized to lowercase
        this.protocol = "";
        // port is stored as a string
        this.port = "";
        // domain is normalized to all lowercase
        this.domain = "";
        // path is everything between domain and query string, including filename
        this.path = "";
        // path parts includes filename
        this.pathParts = [];
        // filename includes extension
        this.filename = "";
        // filebase is filename part before the extension
        this.filebase = "";
        // extension does not include "."
        this.extension = "";
        // raw query string
        this.query = "";
        // queryObject assumes only one use of each key per URL
        this.queryObject = {};
        this.hash = "";
    },
    // gets the last part of the domain 
    // assumes there's always a .xxx at the end of the domain
    getFinalDomain: function() {
        var parts = this.domain.split(".");
        if (parts.length >= 2) {
            return parts.slice(-2).join(".");
        }
        return this.domain;
    },
    getSubDomain: function() {
        var finalDomain = this.getFinalDomain();
        if (finalDomain === this.domain) {
            return "";
        }
        return this.domain.slice(0, this.domain.length - finalDomain.length - 1);
    },
    getURL: function() {
        var url = "";
        if (this.protocol) {
            url += this.protocol + "://";
        }
        if (this.domain) {
            url += this.domain;
        }
        if (this.port) {
            url += ":" + this.port;
        }
        if (this.path) {
            url += encodeURI(this.path);
        }
        var queryItems = [];
        for (var item in this.queryObject) {
            if (Object.prototype.hasOwnProperty.call(this.queryObject, item)) {
                queryItems.push(encodeURIComponent(item) + "=" + encodeURIComponent(this.queryObject[item]));
            }
        }
        if (queryItems.length) {
            url += "?" + queryItems.join("&");
        }
        if (this.hash) {
            url += "#" + encodeURIComponent(this.hash);
        }
        return url;
        
    },
    parse: function(url) {
        this.init();
        if (!url) {
            return;
        }
        this.origURL = url;
        // find protocol
        var pieces = url.split("://"), index, item, temp, i, parts;
        if (pieces.length > 1) {
            this.protocol = pieces[0].toLowerCase();
            temp = pieces[1];
        } else {
            temp = pieces[0];
        }
        // get hash off the end
        index = temp.lastIndexOf("#");
        if (index !== -1) {
            // extract hash
            this.hash = decodeURIComponent(temp.slice(index + 1));
            // remove hash from end of string
            temp = temp.slice(0, index);
        }
        // get query off the end
        index = temp.lastIndexOf("?");
        if (index !== -1) {
            // extract query off the end of temp
            this.query = temp.slice(index + 1);
            // remove query from temp
            temp = temp.slice(0, index);
            // split each query pair
            pieces = this.query.split("&");
            // process each query pair
            for (i = 0; i < pieces.length; i++) {
                parts = pieces[i].split("=");
                if (parts.length < 2) {
                    parts.push("");
                }
                this.queryObject[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
        }
        // now find domain and port
        pieces = temp.split("/");
        parts = pieces[0].split(":");
        this.domain = parts[0].toLowerCase();
        if (parts.length > 1) {
            this.port = parts[1];
        }
        if (pieces.length > 1) {
            // toss domain - already processed
            pieces.shift();
            // special case for just a domain and trailing slash, nothing else
            if (pieces.length === 1 && pieces[0] === "") {
                this.path = "/";
            } else {
                // decode all path parts
                for (var i = 0; i < pieces.length; i++) {
                    pieces[i] = decodeURI(pieces[i]);
                }
                this.pathParts = pieces.slice(0);
                this.path = "/" + this.pathParts.join("/");
                // filename is simply the last piece of the path (whether it's actually a filename or not)
                this.filename = pieces.pop();
                if (this.filename == "") {
                    this.filename = pieces.pop();
                    if (!this.filename) this.filename = "";
                }
                this.filebase = this.filename;
                var index = this.filename.lastIndexOf(".");
                if (index !== -1) {
                    this.filebase = this.filename.slice(0, index);
                    this.extension = this.filename.slice(index + 1);
                }
            }
        }
    }
}
