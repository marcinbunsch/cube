
var database = require('./database');



module.exports = function(options) {
  var start = function() {
    var repl = require("repl");

    database.open(options, function (error, db) {
      if (error) throw error;
      var started = repl.start({
        prompt: "cube> ",
        input: process.stdin,
        output: process.stdout
      });
      started.context.db = db;
    })
  }

  return {
    start: start
  }
};

