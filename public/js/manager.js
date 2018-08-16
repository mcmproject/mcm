/// <reference types="chrome"/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var version = "1.4.0";
var codeName = "Tirana";
var buildDate = "16.08.2018.";
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
    MCM.addSavedPost = function (post) {
        if (post instanceof SavedPost) {
            if (post.isValid()) {
                storage.get("mcm-saved-posts", function (result) {
                    var savedPosts = result["mcm-saved-posts"];
                    savedPosts[post.id] = post["export"]();
                    storage.set({ "mcm-saved-posts": savedPosts }, function () {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.errorOnAddingSavedPost(chrome.runtime.lastError);
                        }
                    });
                });
            }
            else {
                ErrorNotification.invalidSavedPost();
            }
        }
        else {
            ErrorNotification.notSavedPost();
        }
    };
    return MCM;
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
    ErrorNotification.notSavedPost = function () {
        throw new Error("Poslati parametar nije 'SavedPost' objekat.");
    };
    ErrorNotification.invalidSavedPost = function () {
        throw new Error("Poslati parametar nije validan 'SavedPost' objekat.");
    };
    ErrorNotification.errorOnAddingSavedPost = function (error) {
        alert("Došlo je do greške pri dodavanju poruke u sačuvane poruke!");
        console.log(error);
        throw new Error("Došlo je do greške pri dodavanju poruke u sačuvane poruke.");
    };
    return ErrorNotification;
}());
var Post = (function () {
    function Post() {
        this.author = null;
        this.link = null;
        this.valid = true;
    }
    Post.prototype.setAuthor = function (author) {
        this.author = author;
        return this;
    };
    Post.prototype.setLink = function (link) {
        this.link = link;
        return this;
    };
    Post.prototype.isValid = function () {
        if (typeof this.author !== "string" || !this.author.length) {
            this.valid = false;
        }
        if (typeof this.link !== "string" || !this.link.length) {
            this.valid = false;
        }
        return this.valid;
    };
    Post.prototype["export"] = function () {
        var time = new DateTime().getCurrentTime();
        var date = new DateTime().getCurrentDate();
        return {
            "author": this.author,
            "link": this.link,
            "time": time,
            "date": date
        };
    };
    return Post;
}());
var Like = (function (_super) {
    __extends(Like, _super);
    function Like() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Like;
}(Post));
var SavedPost = (function (_super) {
    __extends(SavedPost, _super);
    function SavedPost() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = null;
        return _this;
    }
    SavedPost.prototype.setId = function (id) {
        this.id = id;
        return this;
    };
    return SavedPost;
}(Post));
document.addEventListener("DOMContentLoaded", function () {
    var url = window.location.href;
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
    storage.get("mcm", function (result) {
        var results = result.mcm;
        if (results === undefined) {
            var mcm = {
                "version": version,
                "codeName": codeName,
                "buildDate": buildDate
            };
            var mcm_likes = [];
            var mcm_saved_posts = {};
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
            storage.set({ "mcm-saved-posts": mcm_saved_posts }, function () {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Skladište za sačuvane poruke je dodato.");
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
                for (var setting in mcm_settings) {
                    if (mcm_settings.hasOwnProperty(setting) && mcm_settings[setting] === undefined) {
                        settings[setting] = mcm_settings[setting];
                        updateSettings = true;
                    }
                }
                if (updateSettings) {
                    storage.set({ "mcm-settings": settings }, function () {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.extensionInitError(chrome.runtime.lastError);
                        }
                    });
                }
                storage.get("mcm-saved-posts", function (result) {
                    var savedPosts = result["mcm-saved-posts"];
                    if (savedPosts === undefined) {
                        storage.set({ "mcm-saved-posts": {} }, function () {
                            if (chrome.runtime.lastError) {
                                ErrorNotification.extensionInitError(chrome.runtime.lastError);
                            }
                            console.log("Skladište za sačuvane poruke je dodato.");
                        });
                    }
                });
                var like_tracker = settings["like_tracker"];
                if (like_tracker) {
                    if (document.querySelectorAll(".lajk").length) {
                        var likes_1 = document.querySelectorAll(".lajk");
                        var _loop_1 = function (i) {
                            likes_1.item(i).addEventListener("click", function () {
                                var href = likes_1.item(i).getAttribute("href");
                                var id = href.split(",")[1].slice(1, href.split(",")[1].length - 1);
                                var link = url.split("#")[0] + "#p" + id;
                                var author = document.querySelector("#tabela_poruke_" + id)
                                    .querySelectorAll(".profile").item(0).getAttribute("href")
                                    .split("/")[4];
                                var like = new Like();
                                like.setAuthor(author).setLink(link);
                                MCM.addLike(like);
                            });
                        };
                        for (var i = 0; i < likes_1.length; i++) {
                            _loop_1(i);
                        }
                    }
                }
                var savedPosts = null;
                if (document.querySelector("#topictablebody")) {
                    chrome.storage.local.get("mcm-saved-posts", function (result) {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.extensionInitError(chrome.runtime.lastError);
                        }
                        savedPosts = result["mcm-saved-posts"];
                        var currentUrl = window.location;
                        var socialButtonsList = document.querySelectorAll(".socials");
                        var usernameSections = document.querySelectorAll(".name");
                        var links = Array.from(document.querySelectorAll("a.nick_white"))
                            .filter(function (link) { return link.getAttribute("href") !== "#content"; });
                        var _loop_2 = function (i) {
                            var id = links[i].getAttribute("href").substr(2);
                            if (!savedPosts[id]) {
                                var text = document.createTextNode("Sačuvaj poruku");
                                var a = document.createElement("a");
                                var li = document.createElement("li");
                                var ul_1 = socialButtonsList.item(i);
                                a.addEventListener("click", function (e) {
                                    e.preventDefault();
                                    var link = currentUrl.toString().split("#")[0] + "#p" + id;
                                    var author = usernameSections.item(i).childNodes.item(0).nodeValue;
                                    var savedPost = new SavedPost();
                                    savedPost.setId(id).setAuthor(author).setLink(link);
                                    MCM.addSavedPost(savedPost);
                                    ul_1.removeChild(ul_1.childNodes.item(ul_1.childNodes.length - 1));
                                });
                                a.appendChild(text);
                                a.style.padding = "0 4px 0 4px";
                                a.setAttribute("href", "#");
                                li.appendChild(a);
                                li.style.borderRadius = "2px";
                                ul_1.appendChild(li);
                            }
                        };
                        for (var i = 0; i < socialButtonsList.length; i++) {
                            _loop_2(i);
                        }
                    });
                }
            });
        }
    });
});
