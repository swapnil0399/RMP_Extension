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
			run();
		} catch (exp) {
			console.error(exp.stack);
			process.exit(1);
		}
	})();
	
});

function run() {
	var process = spawn('python',["./test.py", req.query.university, req.query.prof]); 
	
	process.stdout.on('data', function(error) {
		console.log(error.toString());
		res.send(error.toString());
	}); 

	process.stdout.on('data', function(data) {
		console.log(data.toString());
		res.send(data.toString());
	}); 

	process.on('exit', function(code) {
		console.log("Exited with code " + code);
	});
}
