var express = require("express");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


var app = express();
app.use(connectLiveReload());

app.get("/", function (req, res) {
  res.send("Hello World! ... pp j a3");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
