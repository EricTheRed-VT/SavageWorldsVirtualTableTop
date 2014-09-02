import Ember from 'ember';

export default Ember.Controller.extend({
    settingRules: [],
    skillDescriptions:[],
    hindrances:[],
    actions:{
	save:function(){
	    var setting = this.get('model');
	    setting.set('userId', this.get('session.userId'));
	    var self = this;
	    setting.save().then(
		function( post){
		    self.transitionToRoute("/settings", post);
		});
	}
    }
});
