import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		save: function() {
			var controller = this;
			this.model.save().then(function( newModel){
				Ember.get(controller, 'flashes').success('Success!', 2000);	
				controller.transitionToRoute('stories');
			});
		},
		cancel: function() {
			this.model.rollback();
			this.transitionToRoute('stories');
		}
	}
});