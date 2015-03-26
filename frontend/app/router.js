import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('plot-points', function(){
      this.route('add');
      this.resource('plot-point', { path: '/:id' }, function() {
          this.route('edit');
          this.resource('characters', function(){
            this.route('add');
          });
      });
  });
  this.resource("characters", function() {
    this.resource('character', { path: '/:characterId'}, function(){
      this.route('edit');
    });
  });

  this.resource("stories", function() {
    this.route("add");
    this.resource('story', { path: '/:id'}, function(){
      this.route('edit');
    });
  });
  
  this.resource("standard-archetypes", function() {
      this.route("add");
      this.resource('standard-archetype', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-beasts", function() {
      this.route("add");
      this.resource('standard-beast', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-characters", function() {
      this.route("add");
      this.resource('standard-character', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-edges", function() {
      this.route("add");
      this.resource('standard-edge', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-extras", function() {
      this.route("add");
      this.resource('standard-extra', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-gears", function() {
      this.route("add");
      this.resource('standard-gear', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-hindrances", function() {
      this.route("add");
      this.resource('standard-hindrance', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-places", function() {
      this.route("add");
      this.resource('standard-place', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-powers", function() {
      this.route("add");
      this.resource('standard-power', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-races", function() {
      this.route("add");
      this.resource('standard-race', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
  this.resource("standard-skills", function() {
      this.route("add");
      this.resource('standard-skill', { path: '/:id'}, function(){
          this.route('edit');
      });
	});
});

export default Router;
