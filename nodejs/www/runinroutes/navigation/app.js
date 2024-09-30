// นาฬิกาจับเวลา
var startTime, elapsedTime = 0, intervalId;
var isPaused = false;

document.getElementById("startButton").addEventListener("click", function () {
    if (isPaused) {
        startTime = new Date().getTime() - elapsedTime;
    } else {
        startTime = new Date().getTime();
    }
    intervalId = setInterval(updateTime, 1000); // อัปเดตทุก 1 วินาที
    isPaused = false;
});

document.getElementById("pauseButton").addEventListener("click", function () {
    clearInterval(intervalId);
    elapsedTime = new Date().getTime() - startTime;
    isPaused = true;
});

document.getElementById("clearButton").addEventListener("click", function () {
    clearInterval(intervalId);
    elapsedTime = 0;
    isPaused = false;
    document.getElementById("timeDisplay").textContent = "เวลาที่ผ่านไป: 00:00:00";
});

function updateTime() {
    var currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;

    var hours = Math.floor(elapsedTime / 3600000); // 3600000 มาจาก 1000 * 60 * 60 (1000 มิลลิวินาที * 60 นาที * 60 นาที)
    var minutes = Math.floor((elapsedTime % 3600000) / 60000); // 60000 มาจาก 1000 * 60 (1000 มิลลิวินาที * 60 นาที)
    var seconds = Math.floor((elapsedTime % 60000) / 1000); // 1000 มาจาก 1000 มิลลิวินาที

    var formattedTime = padNumber(hours) + ":" + padNumber(minutes) + ":" + padNumber(seconds);
    document.getElementById("timeDisplay").textContent = "เวลาที่ผ่านไป: " + formattedTime;
}

function padNumber(number) {
    return (number < 10 ? "0" : "") + number;
}


const map = L.map("map", {
    center: [18.789735993315354, 98.98515632359728],
    zoom: 4
})

// เรียกให้มันดึงข้อมูลแมพตามลิ้ง
var Stadia_StamenTerrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
});

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var Googlemap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 17,
    attribution: 'Google'
});


// wms เรียกเลเยอร์
var amphoe = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/CM/wms?", {
    layers: "CM:amphoe_cm",
    format: "image/png",
    transparent: true

})

var aspect_std = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/raster/wms?", {
    layers: "raster:aspect_std",
    format: "image/png",
    transparent: true

})

var dem_std = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/raster/wms?", {
    layers: "raster:dem_std",
    format: "image/png",
    transparent: true

})

var slope_std = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/raster/wms?", {
    layers: "raster:slope_std",
    format: "image/png",
    transparent: true

})



//addmap
// osm.addTo(map)
// Esri_WorldImagery.addTo(map)
// OpenTopoMap.addTo(map)
// addmapจากGeoserver
// amphoe.addTo(map)
// village.addTo(map)


// เพิ่มปุ่มเลือกเลเยอร์แผนที่
var basemap = {
    "แผนที่ Stadia_StamenTerrain ": Stadia_StamenTerrain,
    "แผนที่ WorldImagery": Esri_WorldImagery,
    "แผนที่ OpenTopoMap": OpenTopoMap,
    "แผนที่ osm": osm,
    "แผนที่ Google Map": Googlemap.addTo(map)
}


var lyrGroup = L.layerGroup([])

var overlayMaps = {
    "<b>ขอบเขตอำเภอ</b>": amphoe.addTo(map),
    "<img src='./geodem.png' alt='Image' height='40' width='50'>  <b>ความสูงภูมิประเทศ </b>": dem_std,
    "<img src='./geoslope.png' alt='Image' height='40' width='50'>  <b>ความลาดชัน</b>": slope_std,
    "<img src='./geoaspect.png' alt='Image' height='60' width='25'>  <b>ทิศรับแสง</b>": aspect_std
}


L.control.layers(basemap, overlayMaps).addTo(map)

map.locate({ setView: true, maxZoom: 15 })


var iconlocation = L.icon({
    iconUrl: './body.png',
    iconSize: [50, 50]
})

var startLat;
var startLng;
const onLocstionFound = (e) => {
    startLat = e.latitude;
    startLng = e.longitude;


    L.marker([e.latitude, e.longitude], { icon: iconlocation })
        .addTo(map)
        .bindPopup("<b>คุณอยู่ที่นี่</b>");
    // L.circle(e.latlng, {
    //     radius: e.accuracy,
    //     color: "orange",
    //     fillcolor: "rad",
    //     fillopacity: 0.5,
    //     dashArray: "10 10"
    // }).addTo(map)
}

map.on("locationfound", onLocstionFound)


// การนำทาง เมื่อคลิ้ก
// map.on("click", (e) => {
//     removeLayer();

//     L.marker(e.latlng, { mkName: "marker" })
//         .addTo(map)
//         .bindPopup(`<button onclick='navigate(${e.latlng.lat},${e.latlng.lng})'>ปลายทาง</button>`)


// })

// const removeLayer = () => {
//     map.eachLayer((i) => {

//         if (i.options.mkName) {
//             map.removeLayer(i)
//         }
//     })
// }



const navigate = (endLat, endLng) => {
    let url = `https://www.google.com/maps/dir/${startLat},${startLng}/${endLat},${endLng}`
    window.open(url, "_blank")
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')
console.log(id);


axios.get(`/tsg16/runinroutes/routesid/${id}`).then(res => {

    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.8
    };

    res.data.forEach(i => {

        let myLines = JSON.parse(i.json)

        let route = L.geoJSON(myLines, {
            style: myStyle
        }).addTo(map);

        map.fitBounds(route.getBounds())

        let point = JSON.parse(i.ct)
        let latlng = point.coordinates

        L.geoJSON(point, {})
            .addTo(map)
            .bindPopup(`<h4><strong>${i.name}</strong></h4>
            <img src="./distance.png" alt="width="50" height="20"> <b> ระยะทาง :</b> ${i.length} km
            <br>
            <img src="./wide.png" alt="width="55" height="25"> <b>ความกว้าง :</b> ${i.wide} m
            <br>
            <img src="./surface.png" alt="width="50" height="20"> <b> สภาพพื้นผิว:</b> ${i.surface} 
            <br>
            <img src="./sun.png" alt="width="50" height="20"> <b> ทิศรับแสงเฉลี่ย:</b> ${i.asmean}
            <br>
            <img src="./slope1.png" alt="width="50" height="20">
            <b> ความลาดชัน:</b> <img src="./up-right-arrow.png" alt="width="35" height="15">   ${i.slopemax}°
                                <img src="./bottom-right.png" alt="width="50" height="20">  ${i.slopemin}°
            <br>
            <img src="./mountains.png" alt="width="50" height="20">
            <b> ความสูงภูมิประเทศ:</b> <img src="./up-arrow.png" alt="width="50" height="20">  ${i.demmax} m
                                    <img src="./down-arrow.png" alt="width="50" height="20">  ${i.demmin} m
            <br> 
            <br> 
            <div class="container" >                       
            <button type="button" class="btn btn-success btn-sm" onclick='navigate(${latlng[1]},${latlng[0]})'>นำทางโดย Google Map</button>
            </div>
            `)



        axios.get(`https://www-old.cmuccdc.org/api2/dustboy/near/${latlng[1]}/${latlng[0]}/10`)
            .then(data => {
                data.data.forEach(k => {
                    L.circleMarker([k.dustboy_lat, k.dustboy_lon], {
                        radius: 30,
                        color: `rgb(${k.daily_th_color})`,
                        opacity: 0.7

                    }).addTo(map)
                    console.log(k)

                })
            })

    })


})
