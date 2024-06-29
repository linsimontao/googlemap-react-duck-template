const express = require('express')
const cors = require('cors')
const duckdb = require('duckdb');

const port = 3001

const app = express()
app.use(express.json())
app.use(cors())

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

const db = new duckdb.Database(':memory:');
db.all("INSTALL spatial;LOAD spatial;")
db.all("CREATE OR REPLACE TABLE MYDB AS SELECT * EXCLUDE (geom), ST_FlipCoordinates(ST_GeomFromText(WKT)) as geom FROM ST_Read('./Uniqlo.csv')", (err, res) => {
    if (err) {
        console.error("FAIL TO INIT DB", err);
        gracefulShutdown();
    }
})

app.get('/', (req, res) => {
    res.json('hello express')
})
app.get('/latlng', (req, res) => {
    const { lat, lng } = req.query
    console.log(lat, lng)
    if (lat && lng) {
        const sql = `
        SELECT * EXCLUDE (geom), ST_X(geom) as lat, ST_Y(geom) as lng from MYDB 
            WHERE ST_Within(
                ST_TRANSFORM(geom, 'EPSG:4326', 'EPSG:3857'),
                ST_Buffer(ST_TRANSFORM(ST_POINT('${lat}'::DOUBLE, '${lng}'::DOUBLE), 'EPSG:4326', 'EPSG:3857'), 1000));
        `
        db.all(sql, (err, dres) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(dres);
            }
        })
    } else {
        res.status(404).json({});
    }
})

app.get('/all', (req, res) => {
    db.all("SELECT * EXCLUDE (geom), ST_X(geom) as lat, ST_Y(geom) as lng from MYDB", (err, dres) => {
        if (err) {
            console.error(err);
            return res.sendStatus(404);
        } else {
            res.status(200).json(dres);
        }
    })
})

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

function gracefulShutdown(signal) {
    db.close()
    server.close((err) => {
        console.log('Http server closed.');
        process.exit(err ? 1 : 0);
    });
}