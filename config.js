var express = require('express');

module.exports = function(app){
	app.configure(function(){
		app.use(express.bodyParser());
		app.use(app.router); 
	});
}