var express = require('express'); 
var app = express();
var spawn = require("child_process").spawn;
var mysql = require('mysql');
var fs = require('fs');
var conn, rowCount;

app.listen(3000, function() { 
	console.log('server running on port 3000');
	var contents = JSON.parse(fs.readFileSync("rds_config.json"));
	rowCount = contents.rowCount;
	conn = mysql.createConnection({
		host: contents.host,
  		user: contents.user,
		password: contents.password,
		database: contents.database
	});

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
			var selectQuery = 'SELECT * FROM RECORDS WHERE LOWER(UNIVERSITY) = LOWER("' + req.query.university + '") && LOWER(NAME) = LOWER("' + req.query.prof + '");'
			conn.query(selectQuery, (error, results) => {
				if (error){
					throw error;
				} else if(results.length > 0){
					console.log(results[0]);
					res.send(results[0]);
				} else {
					(async () => {
						var result = await run(req.query.university, req.query.prof);
						res.send(result);
						insertIntoSQL(result);
					})();
				}
			});
		} catch (exp) {
			console.error(exp.stack);
			res.send("Something has gone bad.")
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

function insertIntoSQL(result){
	result = JSON.parse(result.toString());
	if(result){
		var univ = String(result.University).toUpperCase();
		var prof = String(result.Professor_Name).toUpperCase();
		var quality = result.Quality;
		var level = result.Level_of_Diff;
		var url = result.URL;

		console.log(univ, prof, quality, level, url);

		var query = 'INSERT INTO RECORDS VALUES(' + (++rowCount) + ',"' + univ + '","' + prof + '",' + quality + ',' + level + ',"' + url + '");'
		conn.query(query, (error, results) => {
			if(error) throw error;
			console.log("Successfully added ", prof);
		});
	}
}