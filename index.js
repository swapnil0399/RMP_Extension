var express = require('express'); 
var app = express();
var exec = require("child_process").exec; 

app.listen(3000, function() { 
	console.log('server running on port 3000'); 
}) 

app.get('/', (req, res) => { 
	
	console.log(req.query.university);
	console.log(req.query.prof);

 	(async () => {
		try {
			var result = await run(req.query.university, req.query.prof);
			console.log(result.toString());
			res.send(result.toString());
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
	return exec('python',["./scraper.py", univ, prof], (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		} else {
			return new Promise((resolve, reject) => {
				if(stderr){
					reject(`${stderr}`);
				} else {
					resolve(`${stdout}`);
				}
			})
		}
	}); 
	// var result, error;

	// process.stdout.on('data', function(data) {
	// 	result = data.toString();
	// 	error = false;
	// }); 

	// process.stderr.on('data', function(error) {
	// 	result = error.toString();
	// 	error = true;
	// }); 

	// process.on('exit', function(code) {
	// 	console.log("Exited with code " + code);
	// });

	// if(error){
	// 	return new Promise((resolve, reject) => {
	// 		console.log(result);
	// 		reject(result);
	// 	});
	// } else {
	// 	return new Promise((resolve, reject) => {
	// 		console.log(result);
	// 		resolve(result);
	// 	});
	// }
}
