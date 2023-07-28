let ref = document.referrer;
console.log(ref)


const url = "./count_access";
let data = new FormData();
data.set("url", ref);
fetch(url, {
        method: "POST",
        cache: "no-cache",
        body: data
})
