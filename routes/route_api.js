
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
				Home.remove_all(db,function(err,status){
					if(err){
						console.log(err);
						res.send(err);
					}
					else{
						console.log(status);
						res.send(status);
					}
				});
			}
		});
	});
	  /*-------------------*/
	 /*-Delete user by id-*/
	/*-------------------*/	
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
			'user_id' : req.params.user_id
		}
		User.get_info(db,params,function(err,user_doc){
			if(err) console.log(err);
			else{
				console.log(user_doc);
				res.send(user_doc);
			}
		});
	});

	
	  /*------------------*/
	 /*-Check user creds-*/
	/*------------------*/
	app.post('/user/login',function(req,res){
		console.log('--- POST /user/login ...');
		
		var params = { 
			'user_id' : req.body.user_id,
			'user_pass' : req.body.user_pass
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
			'user_id':req.body.user_id,
			'user_pass':req.body.user_pass,
			'user_mail':req.body.user_mail
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
	app.get('/user/:user_id/home_stats', function(req,res){
		console.log('---GET user/:user_id/home_stats ...');
		var params = {
			'user_id': req.params.user_id
		}
		User.user_home_stats(db,params, function (err, home_info){
			if(err){
				console.log('>>>>>User.user_home_stats : FAILURE!');
				console.log(err);
				res.send(500,err);
			}
			else{
				console.log('>>>>>User.user_home_stats : SUCCESS!');
				res.send(home_info);
			}
		});
	});
	
	  /*---------------*/
	 /*-Set user home-*/
	/*---------------*/
	app.post('/user/set_home', function(req,res){
		console.log('---POST user/set_home');
		var params = {
			'user_id':req.body.user_id,      //user id (owner of the home)
			'home_id':req.body.home_id,	     //home_id (product key from thermostat
			'home_lat':parseFloat(req.body.home_lat),    //home GPS latitute
			'home_long':parseFloat(req.body.home_long),  //home GPS longitude
			'nr_rooms':parseInt(req.body.nr_rooms),    //Number of rooms
			'lr_bool':parseInt(req.body.lr_bool),      //Boolean indicating wether it has a living room or not
			'home_type':parseInt(req.body.home_type)   //Home type (0,1,2,3) -> (detached,semi-detached,terrace,flat)
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
	app.get('/homes/delete',function(req,res){
		Home.remove_all(db,function(err,status){
			if(err){
				console.log(err);
				res.send(err);
			}
			else 
				res.send(status);
		});
	});
	  /*---------------*/
	 /*-Get all homes-*/
	/*---------------*/
	app.get('/homes',function(req,res){
		console.log('--- GET /homes ...');
		Home.get_all(db,function(err,homes){
			if(err){
				console.log('>>>>>FAILURE');
				console.log(err);
				res.send(500,err);
			}else{
				console.log('<<<<<SUCCESS');
				res.send(homes);
			}
		});
	});
	
	  /*------------------------*/
	 /*-Remove home by home_id-*/
	/*------------------------*/
	app.post('/home/remove_by_home_id',function(req,res){
		var params = {
			'home_id' : req.body.home_id
		};	
		Home.remove_by_home_id(db,params,function(err,status){
			if(err){
				console.log('>>>>>FAILURE!');
				console.log(err);
				res.send(500,err);
			}
			else{
				console.log('<<<<<SUCCESS');
				res.send(status);
			}
		});
	});
	
	  /*------------------------*/
	 /*-Remove home by user_id-*/
	/*------------------------*/
	app.post('/home/remove_by_user_id',function(req,res){
		var params = {
			'user_id' : req.params.user_id
		};	
		Home.remove_by_user_id(db,params,function(err,status){
			if(err){
				console.log('>>>>>FAILURE!');
				console.log(err);
				res.send(500,err);
			}
			else{
				console.log('<<<<<SUCCESS');
				res.send(status);
			}
		});
	});
	
	  /*-------------------------*/
	 /*-Get home heating status-*/
	/*-------------------------*/	
	app.get('/home/:home_id/heating_status',function(req,res){
		console.log('---GET /home/:home_id/heating_status');
		var params = {
			'home_id' : req.params.home_id
		}
		Home.get_heating_status(db,params,function(err,heating_status){
			if(err){
				console.log('Error: ' + err);
				res.send(err);
			}else{
				console.log('Heating status: ' + heating_status);
				res.send(heating_status);
			}
		});
	});	
	
	  /*---------------*/
	 /*-Get home info-*/
	/*---------------*/
	app.get('/home/:home_id/info',function(req,res){
		console.log('---GET home/:home_id/info');
		var params = {
			'home_id' : req.params.home_id
		};	
		console.log(params);
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
	app.get('/home/:home_id/location', function(req, res){
		console.log('--- GET /home/location ...');
		var params = {
			'home_id':req.params.home_id
		}
		Home.get_location(db,params,function(err,location){
			if(err){
				console.log(err);
				res.send(err);
			}else{
				res.send(location);
			}
		});
	});
	
	  /*-----------------*/
	 /*-Turn on heating-*/
	/*-----------------*/
	app.post('/home/turn_on', function(req,res){
		console.log('--- POST /home/turn_on ...');
		//Home.turn_on(params);

		var params = {
			'home_id': req.body.home_id,
 			'heating_status': true
		};

		Home.switch_heating(db, params, function(err, response){
			if(err){
				console.log(err);
				res.send(err);
			}else{
				console.log(response)
				res.send(response);
			}
		});
	});

	  /*-----------------*/
	 /*-Log temperature-*/
	/*-----------------*/
	app.post('/home/log_temp',function(req,res){
		console.log('--- POST /home/log_temp ...');
		
		var params = {
			'home_id':req.body.home_id,
			'temp':req.body.temp
		}
		
		Home.log_temp(db,params,function(err,status){
			if(err) {
				console.log(err);
				res.send(err);
			}else{
				console.log(status);
				res.send(status);
			}
		});
	});
	
	  /*------------------*/
	 /*-Turn off heating-*/
	/*------------------*/
	app.post('/home/turn_off',function(req,res){
		console.log('--- POST /home/turn_off ...');
		

		var params = {
			'home_id': req.body.home_id,
			'heating_status': false
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