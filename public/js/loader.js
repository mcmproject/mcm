var gifffer = null;
var ytBlock = null;
var autoFill = null;

chrome.storage.local.get("mcm-settings", function(result) {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        throw new Error(chrome.runtime.lastError);
    }
    var settings = result["mcm-settings"];
    gifffer = settings["gifffer"];
    ytBlock = settings["yt_block"];
    autoFill = settings["auto_fill"];

    window.onload = function() {
        if (gifffer) {
            var images = document.getElementsByTagName("img");
            for (var i = 0; i < images.length; i++) {
                var srcAttribute = images[i].getAttribute("src");
                var classAttribute = images[i].getAttribute("class");
                if (srcAttribute.indexOf(".gif") > -1 && classAttribute === "post_slika") {
                    images[i].removeAttribute("src");
                    images[i].setAttribute("data-gifffer", srcAttribute);
                }
            }
            Gifffer();
        }
        if (ytBlock) {
            var ytVideos = document.getElementsByClassName("youtube");
            while (ytVideos[0]) {
                ytVideos[0].parentNode.removeChild(ytVideos[0]);
            }
        }
        if (autoFill) {
            if (document.getElementById("reply")) {
                var submitButton = document.getElementsByName("post")[1];

                submitButton.addEventListener("click", function handler(e) {
                    e.preventDefault();

                    var postField = document.getElementById("reply");

                    if (postField.value.length < 10) {
                        postField.value = postField.value + "[b][/b][b][/b]";
                    }

                    submitButton.removeEventListener("click", handler);
                    submitButton.click();
                });
            }
        }
    }
});