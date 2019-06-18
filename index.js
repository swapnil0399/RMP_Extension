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
			result = await run(req.query.university, req.query.prof)
			.then((data) => {
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
	var result, error;

	process.stdout.on('data', function(data) {
		console.log(data.toString());
		result = data.toString();
		error = false;
	}); 

	process.stderr.on('data', function(error) {
		console.log(data.toString());
		result = error.toString();
		error = true;
	}); 

	process.on('exit', function(code) {
		console.log("Exited with code " + code);
	});

	if(error){
		return new Promise((resolve, reject) => {
			reject(result);
		});
	} else {
		return new Promise((resolve, reject) => {
			resolve(result);
		});
	}
}
