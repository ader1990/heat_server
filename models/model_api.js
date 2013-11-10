module.exports = function(){

	app.get('/', function(req, res){
	  res.send('hello world');
	});
	app.post('/', function(req,res){
		res.send(req.body.foo);
	});
	
};