var express = require('express'); 
var app = express();
var spawn = require("child_process").spawn; 

app.listen(3000, function() { 
	console.log('server running on port 3000'); 
}) 

app.get('/', (req, res) => { 
	
	console.log(req.query.university);
	console.log(req.query.prof);

 	( async () => {
		try {
			result = await run(req.query.university, req.query.prof);
			result.then((data) => {
				res.send(data);
			})
		} catch (exp) {
			console.error(exp.stack);
			res.send("Something has gone bad.")
			process.exit(1);
		}
	})();
});

function run(univ, prof) {
	var process = spawn('python',["./scraper.py", univ, prof]); 
	
	process.stdout.on('data', function(error) {
		console.log(error.toString());
		return new Promise((resolve, reject) => {
			reject(error.toString());
		});
	}); 

	process.stdout.on('data', function(data) {
		console.log(data.toString());
		return new Promise((resolve, reject) => {
			resolve(data.toString());
		});
	});

	process.on('exit', function(code) {
		console.log("Exited with code " + code);
		return null;
	});
}
