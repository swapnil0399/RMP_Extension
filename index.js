var express = require('express'); 
var app = express();
var spawn = require("child_process").spawn;
var mysql = require('mysql');
var fs = require('fs');

app.listen(3000, function() { 
	console.log('server running on port 3000');
	var conn = mysql.createConnection(fs.readFileSync("rds_config.json"));
	conn.connect(function(err) {
		if (err) throw err;
		console.log("Connection to RDS succeeded...");
	  });
}) 

app.get('/', (req, res) => { 
	
	console.log(req.query.university);
	console.log(req.query.prof);

 	(async () => {
		try {
			var result = await run(req.query.university, req.query.prof);
			res.send(result);
		} catch (exp) {
			console.error(exp.stack);
			res.send("Something has gone bad.")
			process.exit(1);
		}
	})();
});

function run(univ, prof) {
	return new Promise ((resolve, reject) => {
		var process = spawn('python',["./scraper.py", univ, prof, timeout=20000]);
		
		process.stdout.on('data', function(data) {
			resolve(data.toString());
		}); 

		process.stderr.on('data', function(error) {
			reject(error.toString());
		}); 

		process.on('exit', function(code) {
			console.log("Exited with code " + code);
		});
	})
}

