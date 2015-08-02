module.exports = function(db) {
	var express = require('express');
	var router = express.Router();
	var sequelize = require('sequelize');

	var Gear = db.define('Gear', {
		name: {
			type: sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		description: {
			type: sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		era: {
			type: sequelize.STRING,
			allowNull: false
		},
		weight:{
			type: sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		cost:{
			type: sequelize.INTEGER,
			defaultValue: 1
		},
		subType:{
			type: sequelize.STRING,
			allowNull: false
		},
		notes:{
			type: sequelize.STRING,
			allowNull: false
		}

	}, {
		freezeTableName: true // Model tableName will be the same as the model name
	});

	router.get('/', function(req, res) {
		Gear.findAll({order: 'name ASC'}).then(function(data) {
			res.send({
				'gear': data
			});
		})
		.catch( function(error){
			console.log("error: " + error);
			res.status(400).send( {"errors": error}).end();
		});
	});

	router.post('/', function(req, res) {
		var newRec = req.body.gear;
		Gear.create(newRec)
		.then( function(data) {
			res.status(201).send({ gear: data}).end();	
		})
		.catch( function(error){
			console.log("error: " + error);
			res.status(400).send( {"errors": error}).end();
		});
	});

	router.get('/:id', function(req, res) {
		Gear.findById( req.params.id).then(function(data){
			res.send({
				'gear':data
			});	
		})
		.catch( function(error){
			console.log("error: " + error);
			res.status(400).send( {error: error}).end();
		});
	});

	router.put('/:id', function(req, res) {
		Gear.findById( req.params.id)
			.then(function(data){
				data.updateAttributes(req.body.gear)
					.then(function(data) {
						res.send({
							'gear': data
						});
					});
			})
			.catch( function(error){
				console.log("error: " + error);
				res.status(400).send( {"errors": error}).end();
			});
	});

	router.delete('/:id', function(req, res) {
		Gear.findById( req.params.id).then(function(data) {
			data.destroy().then(function(){
				res.status(204).end();	
			});
		})
		.catch( function(error){
			console.log("error: " + error);
			res.status(400).send( {"errors": error}).end();
		});
	});

	return router;
}