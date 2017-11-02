"use strict";

if (!window.localStorage) {
    alert("Vaš pregledač ne podržava lokalno skladište!");
}

if (!localStorage.getItem("mcm")) {
    let mcm = {
        "likes": [],
        "favorites": [],
        "settings": {
            "like_tracking": true,
            "favorite_tracking": true
        }
    }
    localStorage.setItem("mcm", JSON.stringify(mcm));
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

class Favorite extends Like {}

class MCM {
    static addLike(like: Like) {
        if (like instanceof Like) {
            if (like.isValid()) {
                let mcm = JSON.parse(localStorage.getItem("mcm"));
                mcm["likes"].push(like.export());
                localStorage.setItem("mcm", JSON.stringify(mcm));
            } else {
                ErrorNotification.invalidLike();
            }
        } else {
            ErrorNotification.notLike();
        }
    }

    static addFavorite(favorite: Favorite) {
        if (favorite instanceof Favorite) {
            if (favorite.isValid()) {
                let mcm = JSON.parse(localStorage.getItem("mcm"));
                mcm["favorites"].push(favorite.export());
                localStorage.setItem("mcm", JSON.stringify(mcm));
            } else {
                ErrorNotification.invalidFavorite();
            }
        } else {
            ErrorNotification.notFavorite();
        }
    }

    static removeFavorite(id: string) {
        let mcm = JSON.parse(localStorage.getItem("mcm"));
        mcm["favorites"] = mcm["favorites"].filter(function(favorite) {
            return favorite["id"] !== id;
        });
        localStorage.setItem("mcm", mcm);
    }

    static hasFavoriteWithId(id: string) {
        let mcm = JSON.parse(localStorage.getItem("mcm"));
        return mcm["favorites"].filter(function(favorite) {
            return favorite["id"] === id;
        }).length;
    }
}

class ErrorNotification {
    static notLike() {
        throw new Error("Poslati parametar nije 'Like' objekat.");
    }

    static invalidLike() {
        throw new Error("Poslati parametar nije validan 'Like' objekat.");
    }

    static notFavorite() {
        throw new Error("Poslati parametar nije 'Favorite' objekat.");
    }

    static invalidFavorite() {
        throw new Error("Poslati parametar nije validan 'Favorite' objekat.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let url = window.location.href;
    let mcm = JSON.parse(localStorage.getItem("mcm"));
    let like_tracking_set = mcm["settings"]["like_tracking"];
    let favorite_tracking_set = mcm["settings"]["favorite_tracking"];

    if (url.slice(0, 18) === "https://www.mycity") {
        if (like_tracking_set) {
            if (document.getElementsByClassName("lajk").length) {
                let likes = document.getElementsByClassName("lajk");

                for (let i = 0; i < likes.length; i++) {
                    likes[i].addEventListener("click", function() {
                        let href = this.getAttribute("href");
                        let id   = href.split(",")[1].slice(1, href.split(",")[1].length - 1);
                        let link = url.split("#").length == 2 ? url : url + "#p" + id;
                        let author = document.getElementById("tabela_poruke_"+id)
                                    .getElementsByClassName("profile")[0].getAttribute("href")
                                    .split("/")[4];
                        
                        let datetime = new Date();
                        let time = datetime.getHours() + ":" + datetime.getMinutes();
                        let date = datetime.getDate() + "." + datetime.getMonth() + "." + datetime.getFullYear() + ".";
                        
                        let like = new Like();
                        like.setId(id).setAuthor(author).setLink(link).setTime(time).setDate(date);
                        MCM.addLike(like);
                    });
                }
            }
        }

        if (favorite_tracking_set) {
            if (document.getElementsByClassName("post-controls").length) {
                let posts = document.getElementsByClassName("post-controls");

                for (let i = 0; i < posts.length; i++) {
                    let id = posts[i].parentElement.parentElement.parentElement
                             .childNodes[1].attributes["id"].nodeValue.slice(17);
                    let li = document.createElement("li");
                    let a = document.createElement("a");
                    a.setAttribute("class", "mcm-favorite");
                    a.setAttribute("id", "favorite"+id);
                    let text = null;
                    if (MCM.hasFavoriteWithId(id)) {
                        text = document.createTextNode("Dodaj u omiljene");
                    } else {
                        text = document.createTextNode("Ukloni iz omiljenih");
                    }

                    a.appendChild(text);
                    li.appendChild(a);
                    li.addEventListener("click", function() {
                        let link = url.split("#").length == 2 ? url : url + "#p" + id;
                        let author = document.getElementById("tabela_poruke_"+id)
                                     .getElementsByClassName("profile")[0].getAttribute("href")
                                     .split("/")[4];

                        let datetime = new Date();
                        let time = datetime.getHours() + ":" + datetime.getMinutes();
                        let date = datetime.getDate() + "." + datetime.getMonth() + "." + datetime.getFullYear() + ".";

                        let favorite = new Favorite();
                        favorite.setId(id).setAuthor(author).setLink(link).setTime(time).setDate(date);
                        MCM.addFavorite(favorite);
                    });

                    posts[i].childNodes[1].appendChild(li);
                }
            }
        }
    }
});