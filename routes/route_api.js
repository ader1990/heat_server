
var User = require('./../models/model_user.js');
var Home = require('./../models/model_home.js');

module.exports = function(db,app){
	
      /*---------------*/
	 /*-Get all users-*/
	/*---------------*/	
	app.get('/users',function(req,res){
	    console.log('--- GET /users ...');
		User.get_all(db,function(err,users){
			if(err){
				console.log(err);
			}
			else{
				console.log(users);
				res.send(users);
			}
		});
	});
	
	  /*------------------*/
	 /*-Delete all users-*/
	/*------------------*/	
	app.post('/users/delete',function(req,res){
		User.remove_all(db,function(err,status){
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(status);
				res.send(status);
			}
		});
	});
	  /*---------------*/
	 /*-Get all users-*/
	/*---------------*/	
	app.get('/user/:user_id/delete', function (req, res){
		var user_id = req.params.user_id;
		var params  = {'user_id':user_id};
		User.remove(db, params, function(err, resp){
			if(err){
				console.log(err);
			}else{
				res.send(resp);
			}
		});
	});
	
      /*---------------*/
	 /*-Get user home-*/
	/*---------------*/
	/*
	app.get('/user/:user_id/home', function(req,res){
		console.log('--- GET /user/home ...');
		var params = {
			user_id : req.
		}
	});
	*/
	
	  /*---------------*/
	 /*-Get user info-*/
	/*---------------*/
	app.get('/user/:user_id/info', function(req,res){
		console.log('--- GET /user/:user_id/info ...');
		var params = {
			user_id : req.params.user_id
		}
		User.get_info(db,params,function(err,user_doc){
			if(err) console.log(err);
			else{
				console.log(user_doc);
				res.send(user_doc);
			}
		});
	});

	  /*-------------*/
	 /*-Log-in user-*/
	/*-------------*/
	app.post('/user/login',function(req,res){
		console.log('--- POST /user/login ...');
		
		var params = { 
			user_id : req.body.user_id,
			user_pass : req.body.user_pass
		}
		
		User.login(db,params,function(err,status){
			if(err){
				console.log('>>>>>User.login : FAILURE!');
				console.log(err);
				res.send(err);
			}else{
				console.log('>>>>>User.login : SUCCESS!');
				res.send(status);
			}
		});
	});
	
	  /*---------------*/
	 /*-Register user-*/
	/*---------------*/
	app.post('/user/register', function(req,res){
		console.log('--- POST /user/register ...');
	    var params = {
			user_id:req.body.user_id,
			user_pass:req.body.user_pass
		}
		User.register(db,params,function(err,status){
			if(err) {
				console.log('>>>>>User.register : FAILURE!');
				console.log(err);
				res.send(err);
			}
			else{
				console.log('>>>>>User.register : SUCCESS!');
				res.send(status);
			}
		});
	});
	
	  /*---------------------*/
	 /*-Get user home stats-*/
	/*---------------------*/	
	app.get('user/:user_id/home_stats', function(req,res){
		console.log('---GET user/:user_id/home_stats ...');
		var params = {
			'user_id': req.params.user_id
		}
		User.user_house_stats(db,params, function (err, home_info){
			if(err){
				console.log('>>>>>User.user_house_stats : FAILURE!');
				console.log(err);
				res.send(500,err);
			}
			else{
				console.log('>>>>>User.user_house_stats : SUCCESS!');
				res.send(home_info);
			}
		});
	});
	
	  /*---------------*/
	 /*-Set user home-*/
	/*---------------*/
	app.post('user/set_home', function(req,res){
		console.log('---POST user/add_home');
		var params = {
			'user_id':req.body.user_id,
			'home_id':req.body.user_id,
			'home_lat':req.body.latitude,
			'home_long':req.body.longitude
		}
		User.set_home(db,params,function(err,status){
			if(err){
				console.log('>>>>>FAILURE!');
				console.log(err);
				res.send(500,err);
			}
			else{
				console.log('<<<<<User.add_home : SUCCESS');
				res.send(status);
			}
		});
	});
/**************************************************************************************/	
/**************************************************************************************/
/*							     HOME ROUTES    									  */
/**************************************************************************************/
/**************************************************************************************/
	
	
	  /*---------------*/
	 /*-Get home info-*/
	/*---------------*/
	app.get('/home/:house_id/info',function(req,res){
		console.log('---GET home/:house_id/info');
		var params = {
			house_id : req.params.house_id
		};	
		Home.get_info(db,params,function(err,home_info){
			if(err){
				console.log('>>>>>FAILURE!');
				console.log(err);
				res.send(500,err);
			}
			else{
				console.log('<<<<<SUCCESS');
				res.send(home_info);
			}
		});
	});
	
	  /*-------------------*/
	 /*-Get home location-*/
	/*-------------------*/
	app.get('/home/location', function(req, res){
		console.log('--- GET /home/location ...');
		//Home.get_location;
	});
	
	  /*-----------------*/
	 /*-Turn on heating-*/
	/*-----------------*/
	app.post('/home/turn_on', function(req,res){
		console.log('--- POST /home/turn_on ...');
		//Home.turn_on(params);

			var params = {
			'user_id': req.body.user_id,
 			'heating_status': req.body.heating_status
		};

		Home.switch_heating(params, function(err, response){
			if(err){
				res.send(err);
			}else{
				res.send(response);
			}
		});
	});
	
	  /*------------------*/
	 /*-Turn off heating-*/
	/*------------------*/
	app.post('/home/turn_off',function(req,res){
		console.log('--- POST /home/turn_off ...');
		//Home.turn_on(params);

		var params = {
		'user_id': req.body.user_id,
 		'heating_status': req.body.heating_status
		};
		Home.switch_heating(db, params, function(err, response){
			if(err){
				console.log(err);
				res.send(err);
			}else{
				console.log(response)
;				res.send(response);
			}
		});
	});
	
	
}