var cluster = require('cluster');

if (cluster.isMaster)
	{
	console.log('Master is online. Spawning workers.')
	
	var cpuNumber = require('os').cpus().length;
	for(var i = 0; i < cpuNumber; i++)
	
	{
		cluster.fork();
		console.log('Worker #' + i + ' spawned.');
	}

	cluster.on('exit', function(worker) {
		console.log('Worker #' + worker.id + ' died :(');
	});
}
else
{
	var express = require('express');
	var app = express();
	var MongoClient = require('mongodb').MongoClient;

	//Express configuration
	require('./config.js')(app);
	
	MongoClient.connect('mongodb://ec2-54-220-99-234.eu-west-1.compute.amazonaws.com:27017/test', function(err, db) {
		if(err) throw err;
		
		console.log('Worker #' + cluster.worker.id + ' listening on port: 3000');
		
		//API Routes
		require('./routes/route_api.js')(db,app);
		
		console.log('Server listening on port: 3000');
		app.listen(3000);
		
	});
	
}
