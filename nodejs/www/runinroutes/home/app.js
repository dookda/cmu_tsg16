// var url = "https://fee2-202-28-251-57.ngrok-free.app/"

// สร้างแมพ ตั้งค่าตามกรอบที่สร้าง
const map = L.map("map", {
    center: [18.789735993315354, 98.98515632359728],
    zoom: 4
})

// เรียกให้มันดึงข้อมูลแมพตามลิ้ง
// var CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
//     maxZoom: 20,
//     attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// });
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

const onLocstionFound = (e) => {
    console.log(e)
    L.marker([e.latitude, e.longitude], { icon: iconlocation })
        .addTo(map)
        .bindPopup("<b>คุณอยู่ที่นี่</b>");
    L.circle(e.latlng, {
        radius: e.accuracy,
        color: "orange",
        fillcolor: "rad",
        fillopacity: 0.05,
        dashArray: "10 10",

    })
        .addTo(map)
}

map.on("locationfound", onLocstionFound)

// เลือกปัจจัย
function sendData() {
    let length = document.getElementById('length').value

    let wide = document.getElementById('wide').value

    let dem = document.getElementById('dem').value

    let slope = document.getElementById('slope').value

    // console.log(length, wide, dem, slope)

    axios.get(`/tsg16/runinroutes/routegeom620/${length}/${wide}/${dem}/${slope}`).then(res => {

        var myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        };

        var iconroute = L.icon({
            iconUrl: './pin.png',
            iconSize: [50, 50]
        })

        res.data.forEach(i => {
            console.log(i)
            document.getElementById('rlist').innerHTML += `
            <div class="card text-white bg-warning">
                <div class="card-header">เส้นทางวิ่งที่แนะนำ</div>
                <div class="card-body">
                    <h4 class="card-title"><strong>${i.name}</strong></h4>
                    <p class="card-text"> 
                    <img src="./distance.png" alt="width="50" height="20"> <b> ระยะทาง :</b> ${i.length} กิโลเมตร
                    <br>
                    <img src="./wide.png" alt="width="55" height="25"> <b>ความกว้างเส้นทาง :</b> ${i.wide} เมตร
                    <br>
                    <img src="./surface.png" alt="width="50" height="20"> <b> สภาพพื้นผิว:</b> ${i.surface}
                    <br>
                    <img src="./sun.png" alt="width="50" height="20"> <b> ทิศรับแสงเฉลี่ย:</b> ${i.asmean}
                    <br>
                    <img src="./slope1.png" alt="width="50" height="20">
                    <b> ความลาดชัน :</b> <img src="./up-right-arrow.png" alt="width="40" height="15">  ${i.slopemax} องศา
                                        <img src="./bottom-right.png" alt="width="50" height="20">  ${i.slopemin} องศา
                    <br>
                    <img src="./mountains.png" alt="width="50" height="20">
                    <b> ความสูงของภูมิประเทศ :</b> <img src="./up-arrow.png" alt="width="50" height="20">  ${i.demmax} เมตร
                                            <img src="./down-arrow.png" alt="width="50" height="20">  ${i.demmin} เมตร
                    </p>
                        <a href="./../../navigation/index.html?id=${i.id}" type="button" class="btn btn-light">ไปยังเส้นทาง</a>
                </div>
            </div>`

            let myLines = JSON.parse(i.json)

            L.geoJSON(myLines, {
                style: myStyle
            }).addTo(map);

            let point = JSON.parse(i.ct)

            L.geoJSON(point, {
                icon: iconroute
            }).addTo(map);

        })


    })
}


