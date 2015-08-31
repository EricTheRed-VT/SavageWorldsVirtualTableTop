var express = require('express');
var router = express.Router();

var standardSkill = require("../models").StandardSkill;

console.log("Building standard skills routes.");

router.get('/', function(req, res) {
	standardSkill.findAll({order: 'name ASC'}).then(function(data) {
		res.send({
			'standardSkillDescription': data
		});
	})
	.catch( function(error){
		console.log("error: " + error);
		res.status(400).send( {"errors": error}).end();
	});
});

router.post('/', function(req, res) {
	var newRec = req.body.standardSkillDescription;
	standardSkill.create(newRec)
	.then( function(data) {
		res.status(201).send({ standardSkillDescription: data}).end();	
	})
	.catch( function(error){
		res.status(400).send( {"errors": error}).end();
	});
});

router.get('/:id', function(req, res) {
	standardSkill.findById( req.params.id).then(function(data){
		res.send({
			'standardSkillDescription':data
		});	
	})
	.catch( function(error){
		console.log("error: " + error);
		res.status(400).send( {error: error}).end();
	});
});

router.put('/:id', function(req, res) {
	standardSkill.findById( req.params.id).then(function(data){
		data.updateAttributes(req.body.standardSkillDescription).then(function(data) {
			res.send({
				'standardSkillDescription': data
			});
		});
	})
	.catch( function(error){
		console.log("error: " + error);
		res.status(400).send( {"errors": error}).end();
	});
});

router.delete('/:id', function(req, res) {
	standardSkill.findById( req.params.id).then(function(data) {
		data.destroy().then(function(){
			res.status(204).end();	
		});
	})
	.catch( function(error){
		console.log("error: " + error);
		res.status(400).send( {"errors": error}).end();
	});
});

module.exports = router;
