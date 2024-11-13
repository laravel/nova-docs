! function(e, t, n) {
    function a() {
        var e = t.getElementsByTagName("script")[0],
            n = t.createElement("script");
        n.type = "text/javascript", n.async = !0, n.src = "https://beacon-v2.helpscout.net", e.parentNode.insertBefore(n, e)
    }
    if (e.Beacon = n = function(t, n, a) {
        e.Beacon.readyQueue.push({
            method: t,
            options: n,
            data: a
        })
    }, n.readyQueue = [], "complete" === t.readyState) return a();
    e.attachEvent ? e.attachEvent("onload", a) : e.addEventListener("load", a, !1)

    window.Beacon('init', '5b427e2b-94ba-4614-8bc3-9f33ca6cbfc6')

    document.querySelector("#navbar ul a[href='mailto:vapor@laravel.com']").onclick = function (e) {
        if (typeof window.Beacon !== 'undefined') {
            e.preventDefault();
            Beacon('open')
        }
    }
}(window, document, window.Beacon || function() {});
