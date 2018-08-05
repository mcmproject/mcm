/// <reference types="chrome"/>
"use strict";
var version = "1.3.0";
var codeName = "Skoplje";
var buildDate = "05.08.2018.";
var storage = chrome.storage.local;
var MCM = (function () {
    function MCM() {
    }
    MCM.addLike = function (like) {
        if (like instanceof Like) {
            if (like.isValid()) {
                storage.get("mcm-likes", function (result) {
                    var likes = result["mcm-likes"];
                    likes.push(like["export"]());
                    storage.set({ "mcm-likes": likes }, function () {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.errorOnAddingLike(chrome.runtime.lastError);
                        }
                    });
                });
            }
            else {
                ErrorNotification.invalidLike();
            }
        }
        else {
            ErrorNotification.notLike();
        }
    };
    return MCM;
}());
var Like = (function () {
    function Like() {
        this.id = null;
        this.author = null;
        this.link = null;
        this.time = null;
        this.date = null;
        this.valid = true;
    }
    Like.prototype.setId = function (id) {
        this.id = id;
        return this;
    };
    Like.prototype.setAuthor = function (author) {
        this.author = author;
        return this;
    };
    Like.prototype.setLink = function (link) {
        this.link = link;
        return this;
    };
    Like.prototype.setTime = function (time) {
        this.time = time;
        return this;
    };
    Like.prototype.setDate = function (date) {
        this.date = date;
        return this;
    };
    Like.prototype.isValid = function () {
        if (typeof this.id !== "string" || !this.id.length) {
            this.valid = false;
        }
        if (typeof this.author !== "string" || !this.author.length) {
            this.valid = false;
        }
        if (typeof this.link !== "string" || !this.link.length) {
            this.valid = false;
        }
        if (typeof this.time !== "string" || !this.time.length) {
            this.valid = false;
        }
        if (typeof this.date !== "string" || !this.date.length) {
            this.valid = false;
        }
        return this.valid;
    };
    Like.prototype["export"] = function () {
        return {
            "id": this.id,
            "author": this.author,
            "link": this.link,
            "time": this.time,
            "date": this.date
        };
    };
    return Like;
}());
var DateTime = (function () {
    function DateTime() {
    }
    DateTime.prototype.getCurrentTime = function () {
        var datetime = new Date();
        return datetime.getHours() + ":" + datetime.getMinutes();
    };
    DateTime.prototype.getCurrentDate = function () {
        var datetime = new Date();
        return datetime.getDate() + "." + String(datetime.getMonth() + 1) + "." + datetime.getFullYear() + ".";
    };
    return DateTime;
}());
var ErrorNotification = (function () {
    function ErrorNotification() {
    }
    ErrorNotification.extensionInitError = function (error) {
        alert("Upsss, došlo je do greške pri podešavanju proširenja!");
        console.log(error);
        throw new Error("Došlo je do greške pri podešavanju proširenja.");
    };
    ErrorNotification.notLike = function () {
        throw new Error("Poslati parametar nije 'Like' objekat.");
    };
    ErrorNotification.invalidLike = function () {
        throw new Error("Poslati parametar nije validan 'Like' objekat.");
    };
    ErrorNotification.errorOnAddingLike = function (error) {
        alert("Došlo je do greške pri dodavanju lajka!");
        console.log(error);
        throw new Error("Došlo je do greške pri dodavanju lajka.");
    };
    return ErrorNotification;
}());
document.addEventListener("DOMContentLoaded", function () {
    var url = window.location.href;
    storage.get("mcm", function (result) {
        var results = result.mcm;
        if (results === undefined) {
            var mcm = {
                "version": version,
                "codeName": codeName,
                "buildDate": buildDate
            };
            var mcm_likes = [];
            var mcm_settings = {
                "like_tracker": true,
                "gifffer": false,
                "yt_block": false,
                "auto_fill": false,
                "post_html": false,
                "post_bbcode": true,
                "post_smilies": true,
                "post_signature": true,
                "post_email": false
            };
            storage.set({ "mcm": mcm }, function () {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Opšti podaci o proširenju su dodati.");
            });
            storage.set({ "mcm-likes": mcm_likes }, function () {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Skladište za praćenje lajkova je dodato.");
            });
            storage.set({ "mcm-settings": mcm_settings }, function () {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Podešavanja proširenja su dodata.");
                alert("Čestitamo, proširenje je uspešno podešeno! " +
                    "Za pristup podešavanjima i ostalim opcijama " +
                    "proširenja kliknite na ikonicu proširenja " +
                    "koja se nalazi pored polja za kucanje URL-a.");
            });
        }
        else {
            storage.get("mcm-settings", function (result) {
                var settings = result["mcm-settings"];
                var updateSettings = false;
                if (settings["yt_block"] === undefined) {
                    settings["yt_block"] = false;
                    updateSettings = true;
                }
                if (settings["auto_fill"] === undefined) {
                    settings["auto_fill"] = false;
                    updateSettings = true;
                }
                if (settings["post_html"] === undefined) {
                    settings["post_html"] = false;
                    updateSettings = true;
                }
                if (settings["post_bbcode"] === undefined) {
                    settings["post_bbcode"] = true;
                    updateSettings = true;
                }
                if (settings["post_smilies"] === undefined) {
                    settings["post_smilies"] = true;
                    updateSettings = true;
                }
                if (settings["post_signature"] === undefined) {
                    settings["post_signature"] = true;
                    updateSettings = true;
                }
                if (settings["post_email"] === undefined) {
                    settings["post_email"] = false;
                    updateSettings = true;
                }
                if (updateSettings) {
                    storage.set({ "mcm-settings": settings }, function () {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.extensionInitError(chrome.runtime.lastError);
                        }
                    });
                }
                var like_tracker = settings["like_tracker"];
                if (like_tracker) {
                    if (document.getElementsByClassName("lajk").length) {
                        var likes_1 = document.getElementsByClassName("lajk");
                        var _loop_1 = function (i) {
                            likes_1[i].addEventListener("click", function () {
                                var href = likes_1[i].getAttribute("href");
                                var id = href.split(",")[1].slice(1, href.split(",")[1].length - 1);
                                var link = url.split("#")[0] + "#p" + id;
                                var author = document.getElementById("tabela_poruke_" + id)
                                    .getElementsByClassName("profile")[0].getAttribute("href")
                                    .split("/")[4];
                                var time = new DateTime().getCurrentTime();
                                var date = new DateTime().getCurrentDate();
                                var like = new Like();
                                like.setId(id).setAuthor(author).setLink(link).setTime(time).setDate(date);
                                MCM.addLike(like);
                            });
                        };
                        for (var i = 0; i < likes_1.length; i++) {
                            _loop_1(i);
                        }
                    }
                }
            });
        }
    });
});
