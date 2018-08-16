/// <reference types="chrome"/>

"use strict";

const version = "1.4.0";
const codeName = "Tirana";
const buildDate = "16.08.2018.";

let storage = chrome.storage.local;

interface ArrayConstructor {
    from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

class MCM {
    static addLike(like: Like) {
        if (like instanceof Like) {
            if (like.isValid()) {
                storage.get("mcm-likes", (result) => {
                    let likes = result["mcm-likes"];
                    likes.push(like.export());
                    storage.set({"mcm-likes": likes}, () => {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.errorOnAddingLike(chrome.runtime.lastError);
                        }
                    });
                });
            } else {
                ErrorNotification.invalidLike();
            }
        } else {
            ErrorNotification.notLike();
        }
    }

    static addSavedPost(post: SavedPost) {
        if (post instanceof SavedPost) {
            if (post.isValid()) {
                storage.get("mcm-saved-posts", result => {
                    let savedPosts = result["mcm-saved-posts"];
                    savedPosts[post.id] = post.export();
                    storage.set({"mcm-saved-posts": savedPosts}, () => {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.errorOnAddingSavedPost(chrome.runtime.lastError);
                        }
                    });
                });
            } else {
                ErrorNotification.invalidSavedPost();
            }
        } else {
            ErrorNotification.notSavedPost();
        }
    }
}

class DateTime {
    getCurrentTime() {
        let datetime = new Date();
        return datetime.getHours() + ":" + datetime.getMinutes();
    }

    getCurrentDate() {
        let datetime = new Date();
        return datetime.getDate() + "." + String(datetime.getMonth() + 1) + "." + datetime.getFullYear() + ".";
    }
}

class ErrorNotification {
    static extensionInitError(error) {
        alert("Upsss, došlo je do greške pri podešavanju proširenja!");
        console.log(error);
        throw new Error("Došlo je do greške pri podešavanju proširenja.");
    }

    static notLike() {
        throw new Error("Poslati parametar nije 'Like' objekat.");
    }

    static invalidLike() {
        throw new Error("Poslati parametar nije validan 'Like' objekat.");
    }

    static errorOnAddingLike(error) {
        alert("Došlo je do greške pri dodavanju lajka!");
        console.log(error);
        throw new Error("Došlo je do greške pri dodavanju lajka.");
    }

    static notSavedPost() {
        throw new Error("Poslati parametar nije 'SavedPost' objekat.");
    }

    static invalidSavedPost() {
        throw new Error("Poslati parametar nije validan 'SavedPost' objekat.");
    }

    static errorOnAddingSavedPost(error) {
        alert("Došlo je do greške pri dodavanju poruke u sačuvane poruke!");
        console.log(error);
        throw new Error("Došlo je do greške pri dodavanju poruke u sačuvane poruke.");
    }
}

class Post {
    author: string = null;
    link: string   = null;
    valid: boolean = true;

    setAuthor(author: string) {
        this.author = author;
        return this;
    }

    setLink(link: string) {
        this.link = link;
        return this;
    }

    isValid() {
        if (typeof this.author !== "string" || !this.author.length) {
            this.valid = false;
        }

        if (typeof this.link !== "string" || !this.link.length) {
            this.valid = false;
        }

        return this.valid;
    }

    export() {
        let time = new DateTime().getCurrentTime();
        let date = new DateTime().getCurrentDate();

        return {
            "author": this.author,
            "link": this.link,
            "time": time,
            "date": date
        }
    }
}

class Like extends Post { }

class SavedPost extends Post {
    id: string = null;

    setId(id: string) {
        this.id = id;
        return this;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let url = window.location.href;

    let mcm_settings = {
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

    storage.get("mcm", result => {
        let results = result.mcm;
        if (results === undefined) {
            let mcm = {
                "version": version,
                "codeName": codeName,
                "buildDate": buildDate
            };

            let mcm_likes = [];

            let mcm_saved_posts = {};

            storage.set({"mcm": mcm}, () => {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Opšti podaci o proširenju su dodati.");
            });

            storage.set({"mcm-likes": mcm_likes}, () => {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Skladište za praćenje lajkova je dodato.");
            });

            storage.set({"mcm-saved-posts": mcm_saved_posts}, () => {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Skladište za sačuvane poruke je dodato.");
            });

            storage.set({"mcm-settings": mcm_settings}, () => {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Podešavanja proširenja su dodata.");

                alert("Čestitamo, proširenje je uspešno podešeno! " +
                      "Za pristup podešavanjima i ostalim opcijama " +
                      "proširenja kliknite na ikonicu proširenja " +
                      "koja se nalazi pored polja za kucanje URL-a.");
            });
        } else {
            storage.get("mcm-settings", result => {
                let settings = result["mcm-settings"];
                let updateSettings = false;

                for (let setting in mcm_settings) {
                    if (mcm_settings.hasOwnProperty(setting) && mcm_settings[setting] === undefined) {
                        settings[setting] = mcm_settings[setting];
                        updateSettings = true;
                    }
                }

                if (updateSettings) {
                    storage.set({"mcm-settings": settings}, () => {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.extensionInitError(chrome.runtime.lastError);
                        }
                    });
                }

                storage.get("mcm-saved-posts", result => {
                    let savedPosts = result["mcm-saved-posts"];
                    if (savedPosts === undefined) {
                        storage.set({"mcm-saved-posts": {}}, () => {
                            if (chrome.runtime.lastError) {
                                ErrorNotification.extensionInitError(chrome.runtime.lastError);
                            }
                            console.log("Skladište za sačuvane poruke je dodato.");
                        });
                    }
                });

                let like_tracker = settings["like_tracker"];
                if (like_tracker) {
                    if (document.querySelectorAll(".lajk").length) {
                        let likes = document.querySelectorAll(".lajk");

                        for (let i = 0; i < likes.length; i++) {
                            likes.item(i).addEventListener("click", () => {
                                let href = likes.item(i).getAttribute("href");
                                let id   = href.split(",")[1].slice(1, href.split(",")[1].length - 1);
                                let link = url.split("#")[0] + "#p" + id;
                                let author = document.querySelector("#tabela_poruke_"+id)
                                            .querySelectorAll(".profile").item(0).getAttribute("href")
                                            .split("/")[4];

                                let like = new Like();
                                like.setAuthor(author).setLink(link);
                                MCM.addLike(like);
                            });
                        }
                    }
                }

                let savedPosts = null;
                if (document.querySelector("#topictablebody")) {
                    chrome.storage.local.get("mcm-saved-posts", result => {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.extensionInitError(chrome.runtime.lastError);
                        }
                        savedPosts = result["mcm-saved-posts"];

                        let currentUrl = window.location;
                        let socialButtonsList = document.querySelectorAll(".socials");
                        let usernameSections = document.querySelectorAll(".name");
                        let links = Array.from(document.querySelectorAll("a.nick_white"))
                                    .filter(link => link.getAttribute("href") !== "#content");

                        for (let i = 0; i < socialButtonsList.length; i++) {
                            let id = links[i].getAttribute("href").substr(2);

                            if (!savedPosts[id]) {
                                let text = document.createTextNode("Sačuvaj poruku");
                                let a = document.createElement("a");
                                let li = document.createElement("li");
                                let ul = socialButtonsList.item(i);

                                a.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    let link = currentUrl.toString().split("#")[0] + "#p" + id;
                                    let author = usernameSections.item(i).childNodes.item(0).nodeValue;

                                    let savedPost = new SavedPost();
                                    savedPost.setId(id).setAuthor(author).setLink(link);
                                    MCM.addSavedPost(savedPost);
                                    ul.removeChild(ul.childNodes.item(ul.childNodes.length-1));
                                });

                                a.appendChild(text);
                                a.style.padding = "0 4px 0 4px";
                                a.setAttribute("href", "#");
                                li.appendChild(a);
                                li.style.borderRadius = "2px";
                                ul.appendChild(li);
                            }
                        }
                    });
                }
            });
        }
    });
});