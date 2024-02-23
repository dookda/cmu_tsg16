
var map = L.map('map', {
    center: [18.80692817000724, 99.09731707818469],
    zoom: 15
})

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

const baseMap = {
    Esri_WorldImagery: Esri_WorldImagery.addTo(map),
    Esri_WorldStreetMap: Esri_WorldStreetMap,
    Esri_WorldTopoMap: Esri_WorldTopoMap
}


map.locate({ setView: true, maxZoom: 16 });
function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("จุดถ่ายภาพของฉัน ").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);


const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

var base64;
const uploadImage = async (e) => {
    const file = e.target.files[0];
    base64 = await convertBase64(file);
};

const sendToServer = () => {
    axios.post("/api/postcolor", { img: base64 })
        .then(res => {
            console.log(res.data.data[0]);
            let data = res.data.data[0]
            document.getElementById("NDVI").innerHTML = data.ndvi
            document.getElementById("ExG").innerHTML = data.exg
            document.getElementById("Text").innerHTML = data.txt
            document.getElementById("Color").innerHTML = data.color
        })
}

const file = document.getElementById("file");
file.addEventListener("change", (e) => {
    console.log(e);
    uploadImage(e);
});


