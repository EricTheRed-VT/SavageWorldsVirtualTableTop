Router.configure({
	layoutTemplate: 'SavageWorlds'
});

Router.onBeforeAction(function() {
	if (!Meteor.userId()) {
    	this.render('Marketing');
  	} else {
    	this.next();
	}
}, {
	except: ['home']
});

Router.route("/", {
	name: 'home',
	template: "Marketing"
});

Router.route('/stories', {
	name: 'story.list'
});

Router.route('/stories/add',{
	name: 'story.add',
	template: 'StoryForm'
});

Router.route('/stories/:_id/edit', {
	name: 'story.edit',
	template: 'StoryForm',
	data: function () {
    	return Stories.findOne({_id: this.params._id});
  	}
  });

Router.route('/stories/:_id', {
	name: 'story.view',
	template: 'Story',
	data: function () {
    	return Stories.findOne({_id: this.params._id});
  	}
  });

Router.route('/stories/scenes/:_id/edit', {
	name: 'scene.edit',
	template: 'SceneForm',
	data: function () {
    	return Scenes.findOne({_id: this.params._id});
  	}
  });

Router.route('/plotPoints',{
	name: 'plotPoint.list'
});

Router.route('/plotPoints/add',{
	name: 'plotPoint.add',
	template: 'PlotPointForm',
	data: function() {
		var skillList = [];
		var skillCollection = Skills.find({}, {
			sort: {
				name: 1
			}
		});
		skillCollection.forEach(function(skill){
			skillList.push({
				name: skill.name,
				attribute: skill.attribute,
				description: skill.description
			});
		});
		return {
			name: 'New Plot Point',
			description: 'Describe it here.',
			skills: skillList
		}
	}
});

Router.route('/plotPoints/:_id/edit',{
	name: 'plotPoint.edit',
	template: 'PlotPointForm',
	data: function () {
    	return PlotPoints.findOne({_id: this.params._id});
  	}
});

Router.route('/plotPoints/:_id/view',{
	name: 'plotPoint.view',
	template: 'PlotPointView',
	data: function() {
		return PlotPoints.findOne({_id: this.params._id});
	}
});

Router.route('/plotPoints/:plotPointId/races/add', {
	name: 'race.add',
	template: "RaceForm",
	data: function () {
    	return {
    		plotPoint: PlotPoints.findOne({
    			_id: this.params.plotPointId
    		})
    	}
  	}
});

Router.route("/admin/skills",{
	name: 'skill.list',
	template: 'SkillList'
});

Router.route("/admin/skills/add",{
	name: 'skill.add',
	template: 'SkillForm'
});

Router.route("/admin/skills/:_id/edit",{
	name: 'skill.edit',
	template: 'SkillForm',
	data: function () {
    	return Skills.findOne({
    		_id: this.params._id
    	});
    }
});