const sharp = require("sharp")

const logos = [
    { w: 114, h: 114, f: "public/apple-touch-icon-precomposed.png" },
    { w: 114, h: 114, f: "public/apple-touch-icon.png" },
    { w: 16, h: 16, f: "public/favicon.ico" },
    { w: 828, h: 1792, f: "public/apple-launch.png" },
]


logos.map(e => {
    sharp("public/imgs/logo.svg")
        .resize(e.w, e.h, {
            fit: sharp.fit.inside,
        })
        .flatten({ background: '#252525' })
        .png()
        .toFile(e.f)
        .then(function (info) {
            console.log(info)
        })
        .catch(function (err) {
            console.log(err)
        });
});