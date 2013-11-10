var geolib = require('./../node_modules/geolib/geolib.js');


exports.remove_all = function(db,cb){
	console.log('Inside remove all!');
	db.collection('users').remove({},function(err,count){
		if(err) cb(err,null);
		else cb(null,200);
	});
};

exports.get_all = function(db,cb){
	console.log('Inside get_all');
	db.collection('users').find({},{},{},function(err,users){
		if(err) cb(err,null);
		else{
			console.log('Inside get_all -  no error');
			if(users){
				users.toArray(function(err,docs){
					if(err) cb(err,null);
					else {
						console.log('Inside get_all -  users toArray');
						cb(null,docs);
					}
				});
			}
		}
	});
};

exports.get_info = function(db,params,cb){
	db.collection('users').findOne({'user_id':params.user_id},function(err,user_doc){
		if(err) cb(err,null);
		else{
			if(user_doc) cb(null,user_doc);
			else cb(404,null);
		}
	});
};

exports.get_homes = function(db,params,cb){
	db.collection('users').findOne({'user_id':params.user_id},function(err,user_doc){
		if(err) cb(err,null);
		else cb(null,user_doc.homes);
	});
};

exports.remove_home = function(db,params,cb){
	db.collection('users').update({'user_id':params.user_id},{$pull:{'homes':{'home_id':params.home_id}}},{safe:true},function(err,user_doc){
		if(err) cb(err,null);
		else cb(null,user_doc);
	});
};



exports.register = function (db,params,cb){
	console.log('Inside model_user.register');
	db.collection('users').findOne({'user_id':params.user_id},function(err,user_doc){
		if(err) cb(err,null);
		else{
			console.log('Inside model_user.register - no error, moving on...');
			if(user_doc) cb('User already exists!',null);
			else {
				console.log('No existing user ... everything is fine...');
				db.collection('users').insert(params,{},function(err,user_doc){
					if(err) cb(err,null);
					else cb(null,200);
				});
			}
		}
	});
};
exports.remove = function(db, params, cb){
	db.collection('users').findAndModify({'user_id':params.user_id},{},{},{remove:true}, function(err, res){
		if(err){
			cb(err, null);
		}else{
			cb(null, res);
		}
	});
};
exports.login = function (db,params,cb){
	db.collection('users').findOne({'user_id':params.user_id,'user_pass':params.user_pass},function(err,user_doc){
		if(err) cb(err,null);
		else cb(null,200);
	});
};

exports.user_house_stats = function (db,params, cb){
	db.collection('users').findOne({'user_id': params.user_id}, function(err, user){
		if(err) {
			cb(err, null);
		}else{
			db.collection('homes').findOne({'home_id':user.home_id}, function(err, home){
				cb(null, home);
			});
		}
	});
};

//time after the heating should be switched off when the user has exited the house
exports.user_gps_delay = function (db,params, cb){
  db.collection("users").findOne({'user_id':user_id}, function(err, user_doc){
    if(err){
      cb(err,null);
    }else{
	  var delay = user_doc.gps_delay;
      cb(null,delay);
    }
  });
};

//params = {user_id, location, home_id}
//binds a home to a user
exports.set_home = function (db, params, cb){
	
	var room_nr = req.body.nr_rooms;
	var lr_bool = req.body.lr_bool;
	var home_type = req.body.home_type;
	ht(room_nr,lr_bool,home_type,function(heat_time){
		var home = {
			'home_id':params.home_id,
			'location':params.location,
			'heat_time':heat_time
		}
		db.collection('homes').insert(home, function(err, home_doc){
			db.collection('users').update({'user_id':params.user_id}, {$set: {'house_id': home_doc[0].house_id}}, function(err, count){
				if(err){
					cb(err, null);
				}else{
					cb(null, 200);
				}
			});
		});
	});
};


exports.check_user_at_home = function(db, params, cb){
	db.collection('users').findOne({'user_id':params.user_id}, function(err, user){
		db.collection('homes').findOne({'home_id':user.home_id}, function(err, home){
			var current_location = {
				lattitude: params.lattitude,
				longitude: params.longitude
			};
			var distance_to_home = geolib.getDistance(home.location, current_location);
			var maximum_home_distance = 30; //radius, in which the user is considered to be at home
			 
			cb(null, distance_to_home < maximum_home_distance);
		});
	});
}


function ht(nr_rooms,lr_bool,home_type,cb){	
	
	//0-detached, 1-semi-detached, 2-terrace, 3-flat
	
	var roof_uval = [0.41,0.41,0.41,0];
	var	windows_uval=[4.8,3.1,3.1,4.8];
	var	door_uval=[3.7,3.7,3.7,0];
	var	walls_uval=[0.6,1.37,1.37,0.6];
	var	roof_area=[90,36,36,0];
	var	windows_area=[nr_rooms*1.5,nr_rooms*1.5+3];
	var	wall_area=[154,93,48,45.8];
	
	
	var heat_time = 15*(roof_uval[home_type] * roof_area[home_type] + windows_uval[home_type]*windows_area[lr_bool] + door_uval[home_type]*2 + walls_uval[home_type]*wall_area[home_type]);
	cb(heat_time);
}

