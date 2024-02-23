
var map = L.map("Map", {
    center: [18.80692817000724, 99.09731707818469],
    zoom: 15
});
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var amphoe = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/CM/wms?", {
    layers: "CM:amphoe_cm",
    format: 'image/png',
    transparent: true
});



//marker มีใส่ popup ด้วยนะอย่างลืมไปดู
var mkObject = [{
    name: "พื้นที่ศึกษาที่ 1 ",
    latlng: [18.808580752734876, 99.0980606398538]
}, {
    name: "พื้นที่ศึกษาที่ 2 ",
    latlng: [18.806983518532384, 99.0967458035818]

}, {
    name: "พื้นที่ศึกษาที่ 3 ",
    latlng: [18.804962692779977, 99.09891044607635]

}];

mkObject.forEach((i) => {
    console.log(i)
    L.marker(i.latlng).bindPopup(i.name).addTo(map);
})

var mk = L.marker([18.808024335884653, 99.09617026664871]).bindPopup("บ้านนักศึกษา <br> ที่อยู่ : บ้านเลขที่ 19 หมู่4 ต.สำราญราฏษร์ อ.ดอยสะเก็ด จ.เชียงใหม่");

var polygon = L.polygon([
    [18.809610984997377, 99.09746595052484],
    [18.80906732747532, 99.09713527652042],
    [18.80875431174134, 99.09758777778963],
    [18.808482481815616, 99.09736152715503],
    [18.8082930243349, 99.09766609531701],
    [18.807988244461704, 99.09752686415725],
    [18.807765837178714, 99.09789234595159],
    [18.808045905561148, 99.0980663849013],
    [18.807856447588758, 99.09860590564536],
    [18.808194176868962, 99.09881475238501],
    [18.808128278526073, 99.09896268549224],
    [18.808260075186038, 99.09902359912464],
    [18.80854838001977, 99.09908451275703],
    [18.809610984997377, 99.09746595052484]
]).addTo(map);

var polygon = L.polygon([
    [18.807647769758464, 99.09710556377497],
    [18.807539731683885, 99.097312692169],
    [18.807121583666074, 99.09700622668971],
    [18.80676145535461, 99.0967082154289],
    [18.80685548893252, 99.0965644936861],
    [18.80720961491386, 99.09682446095616],
    [18.807647769758464, 99.09710556377497]
]).addTo(map)


var polygon = L.polygon([
    [18.805871245200674, 99.09826655366088],
    [18.805724131702863, 99.09823165119236],
    [18.80571635662049, 99.09814130219567],
    [18.80559584279773, 99.09806943367558],
    [18.80559778656974, 99.09796676436115],
    [18.805457834926916, 99.09790926954508],
    [18.805354814885057, 99.09782508070258],
    [18.805174043730098, 99.09773473170588],
    [18.805037979291814, 99.09764643609547],
    [18.804161329131574, 99.09964014115579],
    [18.804152962382446, 99.09962246416409],
    [18.80424220768501, 99.09983458806457],
    [18.80435934207279, 99.09976388009773],
    [18.804345854874366, 99.09976454614394],
    [18.804384442288132, 99.09974620310604],
    [18.804515507240108, 99.09981592204336],
    [18.80451552112965, 99.09979334175057],
    [18.80460755514885, 99.09961362566824],
    [18.804618122605106, 99.09961974036987],
    [18.80484444318626, 99.09975263061148],
    [18.804978564003374, 99.09983476607069],
    [18.805016597722584, 99.09987025351718],
    [18.805348983555863, 99.10008996585005],
    [18.80556169675445, 99.09962737402873],
    [18.805673593660853, 99.09916183523357],
    [18.805514204352466, 99.09912487428038],
    [18.80543256586774, 99.09898935078535],
    [18.805586123937807, 99.09869571651359],
    [18.80561722428924, 99.09868750296843],
    [18.805728019244448, 99.09822959782612],
    [18.805871245200674, 99.09826655366088]
]).addTo(map);

var baseMap = {
    // key : value
    //key ชื่อ value ชั้นข้อมูล
    "เเผนที่ Esri": Esri_WorldStreetMap,
    "เเผนที่ Esri TopoMap ": Esri_WorldTopoMap,
    "เเผนที่ Esri Imagery": Esri_WorldImagery.addTo(map)
}
var overlayMap = {
    "อำเภอ": amphoe.addTo(map),
    "marker": mk
}

L.control.layers(baseMap, overlayMap, {
    collapsed: true,
    position: 'topright'
}).addTo(map)

//Esri_WorldStreetMap.addTo(map);
//Esri_WorldTopoMap.addTo(map);
//Esri_WorldImagery.addTo(map);
