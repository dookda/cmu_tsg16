const express = require('express')
const app = express()
const getColors = require('get-image-colors')

const { Pool } = require("pg");
const bodyParser = require("body-parser");

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));


const pg = new Pool({
    host: "tsg_postgis",
    user: 'postgres',
    password: "1234",
    database: "geodb",
    port: 5432
});
app.use(express.json());

app.use('/', express.static('www'))

app.listen(3000, () => {
    console.log("Running on http://localhost:3000")
})

// guitar area
function calExg(r, g, b) {
    var r = r / (r + g + b);
    var g = g / (r + g + b);
    var b = b / (r + g + b);
    var ExG = (2 * g) - r - b;
    var txt = "";
    if (ExG <= 0) {
        txt = "ข้าวที่ตายหรือข้าวเกิดความเครียดมากหรือเป็นวัตถุอื่นๆ"
    } else if (ExG <= 0.3) {
        txt = "ข้าวมีสุขภาพไม่ดีหรือเกิดความเครียด"
    } else if (ExG <= 0.6) {
        txt = "ข้าวมีสุขภาพปานกลาง"
    } else {
        txt = "ข้าวสุขภาพดีมาก"
    };

    return { ExG, txt }
}

function calNDVI(r, g) {
    var NDVI = (g - r) / (g + r);
    return { NDVI }
}

app.get("/api/getcolor", (req, res) => {
    const options = {
        count: 4,
        // type: 'image/jpg'
    }

    getColors(img, options).then(colors => {
        const data = colors.map(color => ({
            color: color.hex(),
            exg: calExg(color._rgb[0], color._rgb[1], color._rgb[2]).ExG,
            ndvi: 0.5 * calExg(color._rgb[0], color._rgb[1], color._rgb[2]).ExG,
            txt: calExg(color._rgb[0], color._rgb[1], color._rgb[2]).txt
        }))
        // console.log(Color.hex);
        // var r = colors[0]._rgb[0];
        // var g = colors[0]._rgb[1];
        // var b = colors[0]._rgb[2];
        // var hex = colors[0].hex()

        // var exg = calExg(r, g, b)

        res.status(200).json({ data })
    })
})

app.post("/api/postcolor", (req, res) => {
    const { img } = req.body;

    const options = { count: 1 }
    // var img = "";
    getColors(img, options).then(colors => {
        const data = colors.map(color => ({
            color: color.hex(),
            exg: calExg(color._rgb[0], color._rgb[1], color._rgb[2]).ExG,
            ndvi: 0.5 * calExg(color._rgb[0], color._rgb[1], color._rgb[2]).ExG,
            txt: calExg(color._rgb[0], color._rgb[1], color._rgb[2]).txt
        }))

        res.status(200).json({ data })
    })
})

// ponpan area
app.get("/items", (req, res) => {
    let sql = "SELECT * FROM items";

    pg.query(sql).then((data) => {
        res.json(data.rows)
    })
})

app.get("/items/:id", (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM items WHERE id=" + id;
    console.log(sql);
    pg.query(sql).then((data) => {
        res.json(data.rows)
    })
})

app.post('/postgeojson', (req, res) => {
    const { data } = req.body;
    console.log(data);

})

// ค้นหาเส้นทางวิ่งตามปัจจัย
app.get("/routegeom620/:length/:wide/:dem/:slope", (req, res) => {
    const { length, wide, dem, slope } = req.params;
    let sql = `SELECT *, ST_AsGeoJSON(geom) as json FROM public.routegeom620
                WHERE length<=${length} and wide<= ${wide}  and demx<=${dem} and slopex<=${slope}`

    console.log(sql);
    pg.query(sql).then((data) => {
        res.json(data.rows)
    })
})

// ค้นหาเส้นทางตามid
app.get("/routesid/:id", (req, res) => {
    const { id } = req.params;
    let sql = `SELECT id, name,length,wide,demmin, demmax, slopemin, slopemax, asmean, surface, ct, ST_AsGeoJSON(geom) as json FROM public.routegeom620
                WHERE id= ${id}`

    console.log(sql);
    pg.query(sql).then((data) => {
        res.json(data.rows)
    })
})

app.get("/nifoid/:id", (req, res) => {
    const { id } = req.params;
    let sql = `SELECT id, name,length,wide,demmin, demmax, slopemin, slopemax, asmean, surface, ct, ST_AsGeoJSON(geom) as json FROM public.routegeom620
                WHERE id= ${id}`

    console.log(sql);
    pg.query(sql).then((data) => {
        res.json(data.rows)
    })
})

// ค้นหาเส้นทางรอบตัว
app.get("/selectbyGPS/:lat/:lng/:radius", (req, res) => {
    const { lat, lng, radius } = req.params;
    let sql = `SELECT *, ST_AsGeoJSON(r.geom) as json
                FROM routegeom620 r, 
                st_geomfromtext('POINT(${lng} ${lat})',4326) me
                WHERE  st_dwithin(st_transform(r.geom, 32647), st_transform(me, 32647), ${radius}) = true`

    console.log(sql);
    pg.query(sql).then((data) => {
        res.json(data.rows)
    })
})








