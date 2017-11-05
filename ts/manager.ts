/// <reference types="chrome"/>

"use strict";

const version = "1.0.0";
const codeName = "Nikozija";
const buildDate = "05.11.2017.";

let storage = chrome.storage.local;

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
}

class Like {
    id: string     = null;
    author: string = null;
    link: string   = null;
    time: string   = null;
    date: string   = null;
    valid: boolean = true;

    setId(id: string) {
        this.id = id;
        return this;
    }

    setAuthor(author: string) {
        this.author = author;
        return this;
    }

    setLink(link: string) {
        this.link = link;
        return this;
    }

    setTime(time: string) {
        this.time = time;
        return this;
    }

    setDate(date: string) {
        this.date = date;
        return this;
    }

    isValid() {
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
    }

    export() {
        return {
            "id": this.id,
            "author": this.author,
            "link": this.link,
            "time": this.time,
            "date": this.date
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
}

document.addEventListener("DOMContentLoaded", () => {
    let url = window.location.href;

    if (url.slice(0, 21) === "https://www.mycity.rs" || url.slice(0, 31) === "https://www.mycity-military.com") {
        storage.get("mcm", (result) => {
            let results = result.mcm;
            if (results === undefined) {
                let mcm = {
                    "version": version,
                    "codeName": codeName,
                    "buildDate": buildDate
                };
        
                let mcm_likes = [];
        
                let mcm_settings = {
                    "like_tracker": true
                };
        
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
            }
        });

        storage.get("mcm-settings", (result) => {
            let like_tracker = result["mcm-settings"]["like_tracker"];
            if (like_tracker) {
                if (document.getElementsByClassName("lajk").length) {
                    let likes = document.getElementsByClassName("lajk");
    
                    for (let i = 0; i < likes.length; i++) {
                        likes[i].addEventListener("click", () => {
                            let href = likes[i].getAttribute("href");
                            let id   = href.split(",")[1].slice(1, href.split(",")[1].length - 1);
                            let link = url.split("#").length == 2 ? url : url + "#p" + id;
                            let author = document.getElementById("tabela_poruke_"+id)
                                        .getElementsByClassName("profile")[0].getAttribute("href")
                                        .split("/")[4];
                            
                            let time = new DateTime().getCurrentTime();
                            let date = new DateTime().getCurrentDate();
                            
                            let like = new Like();
                            like.setId(id).setAuthor(author).setLink(link).setTime(time).setDate(date);
                            MCM.addLike(like);
                        });
                    }
                }
            }
        });
    }
});