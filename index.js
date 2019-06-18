var express = require('express'); 
var app = express();
var spawn = require("child_process").spawn; 

app.listen(3000, function() { 
	console.log('server running on port 3000'); 
}) 

app.get('/', (req, res) => { 
	
	console.log(req.query.university);
	console.log(req.query.prof);

 	(async () => {
		try {
			var result = await run(req.query.university, req.query.prof);
			console.log(result);
			res.send(result);
			// result.then((data) => {
			// 	console.log(data);
			// 	res.send(data);
			// }, (error) => {
			// 	console.log(error);
			// 	res.send(error);
			// })
		} catch (exp) {
			console.error(exp.stack);
			res.send("Something has gone bad.")
			process.exit(1);
		}
	})();
});

function run(univ, prof) {
	return new Promise ((resolve, reject) => {
		process = spawn('python',["./scraper.py", univ, prof]);
		
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

