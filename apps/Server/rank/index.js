const http = require("http");
const { MongoClient } = require("mongodb");
const Redis = require("ioredis");
const redis = new Redis();

const port = parseInt(process.argv[2]);
const url = process.env.MONGO_DB_URL;

const server = http.createServer(async (req, res) => {
  const rank = await redis.get("rank");
  console.log("rank.length", rank);
  if (rank) {
    returnRes(res, {
      data: JSON.parse(rank),
      code: 200,
    });
    return;
  }
  MongoClient.connect(url, function (err, client) {
    if (err) {
      res.writeHead(500, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({ error: "could not connect to ratings database" })
      );
      console.log(err);
    } else {
      const db = client.db("test");
      db.collection("ratings")
        .find({})
        .toArray(async function (err, data) {
          if (err) {
            res.writeHead(500, { "Content-type": "application/json" });
            res.end(
              JSON.stringify({
                error: "could not load ratings from database",
              })
            );
            console.log(err);
          } else {
            await redis.set("rank", JSON.stringify(data));
            returnRes(res, {
              data: data,
              code: 200,
            });
          }
          client.close();
        });
    }
  });
});

function returnRes(res, result) {
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(JSON.stringify(result));
}

server.listen(port, function () {
  console.log("Server listening on: http://0.0.0.0:%s", port);
});