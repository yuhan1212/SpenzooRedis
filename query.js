const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { createClient } = require("redis");

sqlite3.verbose();

async function connect() {
  return open({
    filename: "db/spenzoo2.db",
    driver: sqlite3.Database,
  });
}

async function getDataFromSQL() {
  let db, data, rclient;
  try {
    db = await connect();
    const stmt = "SELECT * FROM expenses";

    data = await db.all(stmt);

    let rclient = createClient();
    rclient.on("error", (err) => console.log("Redis Client Error", err));
    await rclient.connect();

    await Promise.all(
      data.map(async (entry) => {
        const expenseId = await rclient.incr("expenseId");
        const key = `expense:${expenseId}`;
        const value = {
          id: expenseId,
          userId: `${entry["field1"]}`,
          amount: `${entry["field2"]}`,
          category: `${entry["field3"]}`,
        };
        await rclient.SADD(
          `${entry["field1"]}`,
          key
        );
        await rclient.hSet(key, value);
        await rclient.rPush("expenses", key);
      })
    );
    console.log("Data successfully logged to Redis");
  } finally {
    db.close();
  }
}

module.exports.getDataFromSQL = getDataFromSQL;
getDataFromSQL();

// async function getDataFromSQL() {
//   let db, d;
//   try {
//     db = await connect();
//     const st =
//       "SELECT field1, field3, sum(field2) AS category_sum FROM expenses GROUP by field1, field3";

//     d = await db.all(st);

//     let rclient = createClient();
//     rclient.on("error", (err) => console.log("Redis Client Error", err));
//     await rclient.connect();

//     console.log("redis connected");

//     await Promise.all(
//       d.map(async (entry) => {
//         console.log(entry);
//         const user = "user:" + entry["field1"];
//         const amount = entry["category_sum"];
//         const category = entry["field3"];
//         console.log(user);
//         console.log(amount);
//         console.log(category);
//         await rclient.zAdd(user, {
//           score: JSON.stringify(amount),
//           value: category,
//         });
//       })
//     );

//     console.log(d);
//   } finally {
//     // db.close();
//   }
// }
