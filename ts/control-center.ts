"use strict";

var app = (function () {
    var version   = "1.0.0",
        codeName  = "Nikozija",
        buildDate = "30.10.2017.",

        api = {
            getVersion() {
                return version;
            },
            getCodeName() {
                return codeName;
            },
            getBuildDate() {
                return buildDate;
            }
        };

    return api;
})();

document.addEventListener("DOMContentLoaded", function () {

});