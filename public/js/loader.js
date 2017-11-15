var gifffer = null;

chrome.storage.local.get("mcm-settings", function(result) {
    if (chrome.runtime.lastError) {
        console.log(console.runtime.lastError);
    }
    var settings = result["mcm-settings"];
    gifffer = settings["gifffer"];

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
    }
});