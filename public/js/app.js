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
    document.getElementById("informations").addEventListener("click", function () {
        alert("Verzija: " + app.getVersion() + "\n" +
            "Kodno ime: " + app.getCodeName() + "\n" +
            "Datum izgradnje: " + app.getBuildDate() + "\n");
    });
});
