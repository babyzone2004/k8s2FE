import http from "http";
import dispatcher from "httpdispatcher";
import MongoClient from "mongodb";

let headers = {};
// console.log(process.argv, process.env);
var port = parseInt(process.argv[2]);
var rankUri = process.env.RANK || "http://localhost:9081";

var userAddedRatings = []; // used to demonstrate POST functionality

var unavailable = false;
var healthy = true;

if (process.env.SERVICE_VERSION === "v-unavailable") {
  // make the service unavailable once in 60 seconds
  setInterval(function () {
    unavailable = !unavailable;
  }, 60000);
}

if (process.env.SERVICE_VERSION === "v-unhealthy") {
  // make the service unavailable once in 15 minutes for 15 minutes.
  // 15 minutes is chosen since the Kubernetes's exponential back-off is reset after 10 minutes
  // of successful execution
  // see https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy
  // Kiali shows the last 10 or 30 minutes, so to show the error rate of 50%,
  // it will be required to run the service for 30 minutes, 15 minutes of each state (healthy/unhealthy)
  setInterval(function () {
    healthy = !healthy;
    unavailable = !unavailable;
  }, 900000);
}

/**
 * We default to using mongodb, if DB_TYPE is not set to mysql.
 */
if (process.env.SERVICE_VERSION === "v2") {
  var url = process.env.MONGO_DB_URL;
}

dispatcher.onPost(/^\/ratings\/[0-9]*/, function (req, res) {
  var productIdStr = req.url.split("/").pop();
  var productId = parseInt(productIdStr);
  var ratings = {};

  if (Number.isNaN(productId)) {
    res.writeHead(400, { "Content-type": "application/json" });
    res.end(JSON.stringify({ error: "please provide numeric product ID" }));
    return;
  }

  try {
    ratings = JSON.parse(req.body);
  } catch (error) {
    res.writeHead(400, { "Content-type": "application/json" });
    res.end(JSON.stringify({ error: "please provide valid ratings JSON" }));
    return;
  }

  if (process.env.SERVICE_VERSION === "v2") {
    // the version that is backed by a database
    res.writeHead(501, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Post not implemented for database backed ratings",
      })
    );
  } else {
    // the version that holds ratings in-memory
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(putLocalReviews(productId, ratings)));
  }
});

dispatcher.onGet(/^\/score\/[0-9]*/, function (req, res) {
  var userIdStr = req.url.split("/").pop();
  var userId = parseInt(userIdStr);
  console.log("process.env.SERVICE_VERSION", process.env.SERVICE_VERSION);
  if (Number.isNaN(userId)) {
    res.writeHead(400, { "Content-type": "application/json" });
    res.end(JSON.stringify({ error: "please provide numeric user ID" }));
  } else if (process.env.SERVICE_VERSION === "v2") {
    var firstRating = 0;
    var secondRating = 0;

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
          .toArray(function (err, data) {
            if (err) {
              res.writeHead(500, { "Content-type": "application/json" });
              res.end(
                JSON.stringify({
                  error: "could not load ratings from database",
                })
              );
              console.log(err);
            } else {
              var result = {
                data: {
                  id: "mongo",
                  value: data[0].rating,
                  userId: userId,
                },
                code: 200,
              };
              console.log("result", result);
              res.writeHead(200, { "Content-type": "application/json" });
              res.end(JSON.stringify(result));
            }
            // close client once done:
            client.close();
          });
      }
    });
  } else {
    if (process.env.SERVICE_VERSION === "v-faulty") {
      // in half of the cases return error,
      // in another half proceed as usual
      var random = Math.random(); // returns [0,1]
      if (random <= 0.5) {
        getLocalReviewsServiceUnavailable(res);
      } else {
        getLocalReviewsSuccessful(res, userId);
      }
    } else if (process.env.SERVICE_VERSION === "v-delayed") {
      // in half of the cases delay for 7 seconds,
      // in another half proceed as usual
      var random = Math.random(); // returns [0,1]
      if (random <= 0.5) {
        setTimeout(getLocalReviewsSuccessful, 7000, res, userId);
      } else {
        getLocalReviewsSuccessful(res, userId);
      }
    } else if (
      process.env.SERVICE_VERSION === "v-unavailable" ||
      process.env.SERVICE_VERSION === "v-unhealthy"
    ) {
      if (unavailable) {
        getLocalReviewsServiceUnavailable(res);
      } else {
        getLocalReviewsSuccessful(res, userId);
      }
    } else {
      getLocalReviewsSuccessful(res, userId);
    }
  }
});

dispatcher.onGet("/health", function (req, res) {
  if (healthy) {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify({ status: "Ratings is healthy" }));
  } else {
    res.writeHead(500, { "Content-type": "application/json" });
    res.end(JSON.stringify({ status: "Ratings is not healthy" }));
  }
});

function putLocalReviews(productId, ratings) {
  userAddedRatings[productId] = {
    id: productId,
    ratings: ratings,
  };
  return getLocalReviews(productId);
}

async function getLocalReviewsSuccessful(res, productId) {
  let res1 = await getLocalReviews(productId);
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(JSON.stringify(res1));
}

function getLocalReviewsServiceUnavailable(res) {
  res.writeHead(503, { "Content-type": "application/json" });
  res.end(JSON.stringify({ error: "Service unavailable" }));
}

async function getLocalReviews(userId) {
  let response = await fetch(rankUri, { headers });
  let res = await response.json();
  console.log("res", res);
  res = res.data[1];
  return {
    data: {
      id: "local",
      value: res.rating,
      userId: res._id,
    },
    code: 200,
  };
}

function handleRequest(request, response) {
  try {
    let inHeaders = request.headers;
    console.log(request.method + " " + request.url, inHeaders);
    let incoming_headers = [
      "x-request-id",
      "x-ot-span-context",
      "x-datadog-trace-id",
      "x-datadog-parent-id",
      "x-datadog-sampling-priority",
      "traceparent",
      "tracestate",
      "x-cloud-trace-context",
      "grpc-trace-bin",
      "sw8",
      "user-agent",
      "cookie",
      "authorization",
      "jwt",
    ];
    incoming_headers.forEach((elem) => {
      if (inHeaders[elem]) {
        headers[elem] = inHeaders[elem];
      }
    });

    dispatcher.dispatch(request, response);
  } catch (err) {
    console.log(err);
  }
}

var server = http.createServer(handleRequest);

process.on("SIGTERM", function () {
  console.log("SIGTERM received");
  server.close(function () {
    process.exit("0");
  });
});

server.listen(port, function () {
  console.log("Server listening on: http://0.0.0.0:%s", port);
});
