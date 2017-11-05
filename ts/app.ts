let app = (function () {
    let version   = "1.0.0",
        codeName  = "Nikozija",
        buildDate = "05.11.2017.",

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

    document.getElementById("informations").addEventListener("click", function() {
        alert(
            "Verzija: " + app.getVersion() + "\n" +
            "Kodno ime: " + app.getCodeName() + "\n" +
            "Datum izgradnje: " + app.getBuildDate() + "\n"
        );
    });
});