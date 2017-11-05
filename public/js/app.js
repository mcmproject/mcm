var app = (function () {
    var version = "1.0.0", codeName = "Nikozija", buildDate = "05.11.2017.", api = {
        getVersion: function () {
            return version;
        },
        getCodeName: function () {
            return codeName;
        },
        getBuildDate: function () {
            return buildDate;
        }
    };
    return api;
})();
document.addEventListener("DOMContentLoaded", function () {
    var like_tracking = document.getElementById("likes-setting");
    chrome.storage.local.get("mcm-settings", function (result) {
        var settings = result["mcm-settings"];
        if (settings["like_tracker"]) {
            like_tracking.checked = true;
        }
        else {
            like_tracking.checked = false;
        }
    });
    var likes = null;
    chrome.storage.local.get("mcm-likes", function (result) {
        likes = result["mcm-likes"];
        if (likes !== null) {
            var likes_list = document.getElementById("likes-list");
            for (var i = likes.length - 1; i >= 0; --i) {
                var tr = document.createElement("tr");
                var author = document.createElement("td");
                var link = document.createElement("td");
                var a = document.createElement("a");
                var time = document.createElement("td");
                var date = document.createElement("td");
                author.innerHTML = likes[i]["author"];
                time.innerHTML = likes[i]["time"];
                date.innerHTML = likes[i]["date"];
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
    document.getElementById("new").addEventListener("click", function () {
        var choice = confirm("Da li ste sigurni da želite započnete novu sesiju? Ova opcija će " +
            "obrisati sve do sada zabeležene podatke.");
        if (choice) {
            chrome.storage.local.set({ "mcm-likes": [] }, function () {
                if (chrome.runtime.lastError) {
                    alert("Došlo je do greške pri započinjanju nove sesije!");
                    console.log(chrome.runtime.lastError);
                    throw new Error("Došlo je do greške pri započinjanju nove sesije.");
                }
            });
            window.location.reload();
        }
    });
    document.getElementById("informations").addEventListener("click", function () {
        alert("Verzija: " + app.getVersion() + "\n" +
            "Kodno ime: " + app.getCodeName() + "\n" +
            "Datum izgradnje: " + app.getBuildDate() + "\n\n" +
            "Ovo je eksperimentalna verzija proširenja.");
    });
    document.getElementById("likes-setting").addEventListener("click", function () {
        var setting = document.getElementById("likes-setting");
        if (!setting.checked) {
            chrome.storage.local.get("mcm-settings", function (result) {
                var settings = result["mcm-settings"];
                settings["like_tracker"] = false;
                chrome.storage.local.set({ "mcm-settings": settings }, function () {
                    if (chrome.runtime.lastError) {
                        alert("Došlo je do greške pri promeni podešavanja!");
                        console.log(chrome.runtime.lastError);
                        throw new Error("Došlo je do greške pri promeni podešavanja.");
                    }
                    console.log("Praćenje lajkova je isključeno.");
                });
            });
        }
        else {
            chrome.storage.local.get("mcm-settings", function (result) {
                var settings = result["mcm-settings"];
                settings["like_tracker"] = true;
                chrome.storage.local.set({ "mcm-settings": settings }, function () {
                    if (chrome.runtime.lastError) {
                        alert("Došlo je do greške pri promeni podešavanja!");
                        console.log(chrome.runtime.lastError);
                        throw new Error("Došlo je do greške pri promeni podešavanja.");
                    }
                    console.log("Praćenje lajkova je uključeno.");
                });
            });
        }
    });
});
