const duckdb = require('duckdb-async');

const createDB = async () => {
  const csvFilePath = "Uniqlo.csv"
  try {
    // Create an instance of DuckDB using in-memory storage 
    const db = await duckdb.Database.create(":memory:");
    await db.all("INSTALL spatial;LOAD spatial;")
    await db.all("CREATE TABLE IF NOT EXISTS MYDB AS SELECT ST_GeomFromText(WKT) as geom, name, description FROM ST_Read('./Uniqlo.csv')")
    // const ret = await db.all(`
    //   SELECT *
    //   FROM read_csv_auto( '${csvFilePath}' )
    //   LIMIT 3;` );
    return db;
  } catch (err) {
    console.log("Uh oh! There's an error!");
    console.log(err);
  }
}

const db = await createDB();
// const ret = db.all("SELECT * from MYDB")
console.log(db.all("SELECT * from MYDB"))


// db.all("INSTALL spatial;LOAD spatial;")
// db.all("CREATE TABLE IF NOT EXISTS mydb AS SELECT ST_GeomFromText(WKT) as geom, name, description FROM ST_Read('./Uniqlo.csv')", (err, res) => {
//     if (err) {
//         console.warn(err);
//         return;
//     }
//     console.log(res)
// });
// db.all("SELECT * from mydb"), (err, res) => {
//     if (err) {
//         console.warn(err);
//         return;
//     }
//     console.log(res)
// }
