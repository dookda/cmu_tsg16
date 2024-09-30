const colorPalette = require("get-image-colors");

axios.get("/tsg16/api/getcolor").then(res => {
    // console.log(res);
    res.data.forEach(i => {
        console.log(i._rgb[0]);
        var color_ = ` <div style='background-color:${i.color}'>${i.color} </div>`
        document.getElementById("showcolor").innerHTML += color_

    });

})

