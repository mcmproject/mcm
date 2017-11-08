let app = (() => {
    let version   = "1.0.1",
        codeName  = "Nikozija",
        buildDate = "08.11.2017.",

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

document.addEventListener("DOMContentLoaded", () => {
    let escapeHTML = (str) => { 
        return str.replace(/[&"'<>]/g, (m) => ({ "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" })[m]); 
    }

    let like_tracking = (<HTMLInputElement>document.getElementById("likes-setting"));
    chrome.storage.local.get("mcm-settings", (result) => {
        let settings = result["mcm-settings"];
        if (settings["like_tracker"]) {
            like_tracking.checked = true;
        } else {
            like_tracking.checked = false;
        }
    });

    let likes = null;
    
    chrome.storage.local.get("mcm-likes", (result) => {
        likes = result["mcm-likes"];

        if (likes !== null) {
            let likes_list = document.getElementById("likes-list");
            for (let i = likes.length-1; i >= 0; --i) {
                let tr = document.createElement("tr");
                let author = document.createElement("td");
                let link = document.createElement("td");
                let a = document.createElement("a");
                let time = document.createElement("td");
                let date = document.createElement("td");

                author.innerHTML = escapeHTML(likes[i]["author"]);
                time.innerHTML = escapeHTML(likes[i]["time"]);
                date.innerHTML = escapeHTML(likes[i]["date"]);

                tr.appendChild(author);
                a.innerText = likes[i]["link"];
                a.href = likes[i]["link"];
                link.appendChild(a);
                tr.appendChild(link);
                tr.appendChild(time);
                tr.appendChild(date);
                likes_list.appendChild(tr);
            }
        }
    });

    document.getElementById("new").addEventListener("click", () => {
        let choice = confirm("Da li ste sigurni da želite započnete novu sesiju? Ova opcija će " +
                             "obrisati sve do sada zabeležene podatke.");
        if (choice) {
            chrome.storage.local.set({"mcm-likes": []}, () => {
                if (chrome.runtime.lastError) {
                    alert("Došlo je do greške pri započinjanju nove sesije!");
                    console.log(chrome.runtime.lastError);
                    throw new Error("Došlo je do greške pri započinjanju nove sesije.");
                }
            });
            window.location.reload();
        }
    });

    document.getElementById("informations").addEventListener("click", () => {
        alert(
            "Verzija: " + app.getVersion() + "\n" +
            "Kodno ime: " + app.getCodeName() + "\n" +
            "Datum izgradnje: " + app.getBuildDate() + "\n\n" +
            "Ovo je eksperimentalna verzija proširenja."
        );
    });

    document.getElementById("likes-setting").addEventListener("click", () => {
        let setting = (<HTMLInputElement>document.getElementById("likes-setting"));
        if (!setting.checked) {
            chrome.storage.local.get("mcm-settings", (result) => {
                let settings = result["mcm-settings"];
                settings["like_tracker"] = false;
                chrome.storage.local.set({"mcm-settings": settings}, () => {
                    if (chrome.runtime.lastError) {
                        alert("Došlo je do greške pri promeni podešavanja!");
                        console.log(chrome.runtime.lastError);
                        throw new Error("Došlo je do greške pri promeni podešavanja.");
                    }
                    console.log("Praćenje lajkova je isključeno.");
                })
            });
        } else {
            chrome.storage.local.get("mcm-settings", (result) => {
                let settings = result["mcm-settings"];
                settings["like_tracker"] = true;
                chrome.storage.local.set({"mcm-settings": settings}, () => {
                    if (chrome.runtime.lastError) {
                        alert("Došlo je do greške pri promeni podešavanja!");
                        console.log(chrome.runtime.lastError);
                        throw new Error("Došlo je do greške pri promeni podešavanja.");
                    }
                    console.log("Praćenje lajkova je uključeno.");
                })
            });
        }
    });
});