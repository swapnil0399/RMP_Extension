var express = require('express'); 
var app = express();
var spawn = require("child_process").spawn; 

app.listen(3000, function() { 
	console.log('server running on port 3000'); 
}) 

app.get('/', (req, res) => { 
	
	console.log(req.query.university);
	console.log(req.query.prof);

	(() => {
		try {
			return run(req.query.university, req.query.prof);
		} catch (exp) {
			console.error(exp.stack);
			process.exit(1);
		}
	})().then((result) => res.send(result));
});

function run(univ, prof) {
	var process = spawn('python',["./scraper.py", univ, prof]); 
	
	process.stdout.on('data', function(error) {
		console.log(error.toString());
		return error.toString();
	}); 

	process.stdout.on('data', function(data) {
		console.log(data.toString());
		return data.toString();
	}); 

	process.on('exit', function(code) {
		console.log("Exited with code " + code);
		return null;
	});
}
