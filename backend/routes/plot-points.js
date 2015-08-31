var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
var _ = require('underscore');
var bluebird = require('bluebird');

var db = require("../models");
var Character = db.Character;
var Edge = db.Edge;
var Gear = db.Gear;
var Hindrance = db.Hindrance;
var PlotPoint = db.PlotPoint;
var Power = db.Power;
var Race = db.Race;
var RacialAbility = db.RacialAbility;
var SkillDescription = db.SkillDescription;
var Story = db.Story;
	
console.log("Building plot-point routes.");

router.get('/', function(req, res) {
	PlotPoint.findAll({
		include: [{
			model: SkillDescription
		}, {
			model: Hindrance
		},{
			model: Edge
		},{
			model: Power
		},{
			model: Gear
		},{ 
			model: Race,
			include: [{
				model: RacialAbility
			}]
		},{
			model: Story
		}]
	})
	.then(function(plotPointList) {
		res.send(buildSideLoadedResponse(plotPointList));
	})
	.catch( function(error){
		console.log("Error getting plot point. " + error)
		res.status(400).send( {"errors": error}).end();
	});
});

router.post('/', function(req, res) {
	var plotPointJson = req.body.plotPoint;
	PlotPoint.create(plotPointJson)
			.then( function(plotPointRecord) {
				addPlotPointIdsToAllChildren( plotPointJson, plotPointRecord);
				res.status(201).send(plotPointRecordToJson( plotPointRecord)).end();	
			})
			.catch( function(error){
				console.log("Error creating new plot point: " + error);
				res.status(400).send( {"errors": error}).end();
			});
});

router.get('/:id', function(req, res) {
	console.log("getting id " + req.params.id);
	PlotPoint.findById( req.params.id, {
			include: [{
				model: SkillDescription
			}, {
				model: Hindrance
			},{
				model: Edge
			},{
				model: Power
			},{
				model: Gear
			},{ 
				model: Race,
					include: [{
						model: RacialAbility
					}]
			}]
		})
		.then(function(plotPoint){
			console.log("found record");
			res.send(buildSideLoadedResponse( [plotPoint]));	
		})
		.catch( function(error){
			console.log("Error getting plot point" + error);
			res.status(400).send( {"errors": error}).end();
		});
});

router.put('/:id', function(req, res) {
	var plotPointId = req.params.id;
	var plotPointJson = req.body.plotPoint;

	PlotPoint.findById( plotPointId)
		.then(function( plotPointRecord){
			addPlotPointIdsToAllChildren( plotPointJson, plotPointRecord);
			plotPointRecord.updateAttributes( plotPointJson)
				.then(function( modifiedPlotPointRecord) {
					res.send({
						'PlotPoint': modifiedPlotPointRecord
					});
				})
				.catch( function(error){
					console.log("Error updating plot point.  " + error);
					res.status(400).send( {"errors": error}).end();
				});
		})
		.catch( function( error){
			console.log("Error finding plot point for updating.  " + error);
			res.status(400).send( {'errors':error}).end();
		});
});

router.delete('/:id', function(req, res) {
	PlotPoint.findById( req.params.id)
		.then(function(data) {
			data.destroy().then(function(){
				res.status(204).end();	
			});
		})
		.catch( function(error){
			console.log("Error deleting plot point" + error);
			res.status(400).send( {"errors": error}).end();
		});
});

var buildSideLoadedResponse = function( plotPointList) {
	var sideLoadedResponse = {
		'PlotPoint': [],
		'SkillDescriptions': [],
		'Hindrances' : [],
		'Edges' : [],
		'Powers' : [],
		'Gears' : [],
		'Races' : [],
		'RacialAbilities' : [],
		'Stories' : []
	}
	_.each(plotPointList, function(plotPoint) {

		var jsonPlotPoint = plotPointRecordToJson( plotPoint);

		addPlotPointIdsToAllChildren( jsonPlotPoint, plotPoint);
		jsonPlotPoint.skillDescriptions = extractIdList(plotPoint.SkillDescriptions);
		jsonPlotPoint.hindrances = extractIdList(plotPoint.Hindrances);
		jsonPlotPoint.edges = extractIdList(plotPoint.Edges);
		jsonPlotPoint.powers = extractIdList(plotPoint.Powers);
		jsonPlotPoint.gears = extractIdList(plotPoint.Gears);
		jsonPlotPoint.races = extractIdList(plotPoint.Races);
		jsonPlotPoint.stories = extractIdList(plotPoint.Stories);
		
		sideLoadedResponse.PlotPoint.push(jsonPlotPoint);
		sideLoadedResponse.SkillDescriptions = sideLoadedResponse.SkillDescriptions.concat( plotPoint.SkillDescriptions);
		sideLoadedResponse.Hindrances = sideLoadedResponse.Hindrances.concat( plotPoint.Hindrances);
		sideLoadedResponse.Edges = sideLoadedResponse.Edges.concat( plotPoint.Edges);
		sideLoadedResponse.Powers = sideLoadedResponse.Powers.concat( plotPoint.Powers);
		sideLoadedResponse.Gears = sideLoadedResponse.Gears.concat( plotPoint.Gears);
		sideLoadedResponse.Stories = sideLoadedResponse.Stories.concat( plotPoint.Stories);
		_.each( plotPoint.Races, function( race){			
			var jsonRace ={
				id: race.id,
				name: race.name,
				description: race.description,
				racialAbilities: extractIdList( race.RacialAbilities)
			};
			sideLoadedResponse.Races.push( jsonRace);
			sideLoadedResponse.RacialAbilities = sideLoadedResponse.RacialAbilities.concat( race.RacialAbilities);
		});
	});
	return sideLoadedResponse;
};

var addPlotPointIdsToAllChildren = function( toJsonRecord, fromDatabaseRecord) {
	addPlotPointIdToRecord( SkillDescription,		toJsonRecord.skillDescriptions, fromDatabaseRecord);
	addPlotPointIdToRecord( Hindrance,				toJsonRecord.hindrances,        fromDatabaseRecord);
	addPlotPointIdToRecord( Edge,					toJsonRecord.edges,             fromDatabaseRecord);
	addPlotPointIdToRecord( Power, 					toJsonRecord.powers,            fromDatabaseRecord);
	addPlotPointIdToRecord( Gear,  					toJsonRecord.gears,             fromDatabaseRecord);
	addPlotPointIdToRecord( Race, 					toJsonRecord.races, 			fromDatabaseRecord);
	addPlotPointIdToRecord( Story, 					toJsonRecord.stories, 			fromDatabaseRecord);
}

var addPlotPointIdToRecord = function( dbRecord, ids, plotPoint) {
	for( i=0; i< ids.length; i++) {
		dbRecord.findById( ids[i])
			.then( function( foundRecord){
				foundRecord.updateAttributes({
					PlotPointId: plotPoint.id
				})
			})
			.catch( function(error) {
				console.log("Error adding plot point id to record."+ error);
			})
	}
};

var plotPointRecordToJson = function( plotPoint) {
	return {
				"id": plotPoint.id,
				"name": plotPoint.name,
				"description": plotPoint.description,
				"bloodAndGuts": plotPoint.bloodAndGuts,
				"bornAHero": plotPoint.bornAHero,
				"criticalFailures": plotPoint.criticalFailures,
				"fanatics": plotPoint.fanatics,
				"grittyDamage": plotPoint.grittyDamage,
				"heroesNeverDie": plotPoint.heroesNeverDie,
				"highAdventure": plotPoint.highAdventure,
				"jokersWild": plotPoint.multipleLanguages,
				"multipleLanguages": plotPoint.multipleLanguages,
				"noPowerPoints": plotPoint.noPowerPoints,
				"skillSpecialization": plotPoint.skillSpecialization,
				"startingAttributePoints": plotPoint.startingAttributePoints,
				"startingSkillPoints": plotPoint.startingSkillPoints,
				"startingMajorHindrances": plotPoint.startingMajorHindrances,
				"startingMinorHindrances": plotPoint.startingMinorHindrances,
				"startingCash": plotPoint.startingCash,
				"skillDescriptions": [],
				"hindrances": [],
				"edges": [],
				"powers":[],
				"gears": [],
				"races":[]
			}
};

var extractIdList = function( record) {
	var idList = []
	_.each(record, function( rec){
		idList.push(rec.id);
	});
	return idList;
}
module.exports = router;
