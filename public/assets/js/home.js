var myapp = angular.module('myapp', ['ngRoute', 'customService']);

myapp.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/notes', {
		templateUrl: 'assets/templates/notes.ejs',
		controller: 'notesController'
	})
	.when('/todo', {
		templateUrl: 'assets/templates/todo.ejs'
	})
}])

myapp.controller('mainController', ['$scope', '$location', function($scope, $location){
	$location.path('/notes');
}])

myapp.controller('notesController', ['$scope','$http', 'noteService', function($scope, $http, noteService){
	$scope.notes = [];

	$scope.saveNote = function(event) {
		var element;
		if(event.target.className == 'note-header') {
			element = event.currentTarget.children[1];
		}
		else {
			element = event.target;
		}
		noteService.saveNote(element).then(function(response) {
		console.log(response);
		}, function(error) {
			console.log(error);
		});
	
	}
	$scope.addNote = function() {
		noteService.addNote().then(function() {
			noteService.getNotes().then(function(notes) {
				$scope.notes = notes;
			}, function(error) {
				console.log(error);
			});
		}, function(error) {
			console.log(error);
		});
	}
	$scope.deleteNote = function(event) {
		noteService.deleteNote(event.target.offsetParent.id).then(function() {
			noteService.getNotes().then(function(notes) {
				$scope.notes = notes;
			}, function(error) {
				console.log(error);
			});
		}, function(error) {
			console.log(error);
		});
	}
	function init() {
		noteService.getNotes().then(function(notes) {
			$scope.notes = notes;
		}, function(error) {
				console.log(error);
		});
	}

	init();
}])

myapp.directive('resizeDragable', ['noteService', function(noteService){
	return {
		restrict: 'A',
		priority: 0,
		link: function($scope, element, iAttrs, controller) {
			
			var element;
			
			element.draggable({ cancel: '.note-content', containment: 'parent'}).resizable();
			element.on('dragstart', function(event) {
                console.log('Drag strat event trigered');
            });
			element.on('mouseup', function(event) {
				if(event.target.className == 'note-header') {
					element = event.currentTarget.children[1];
				}
				else if (event.target.className == 'note-delete') {
					return;
				}
				else {
					element = event.target;
				}
				if (element.offsetParent.style.top != '' && element.offsetParent.style.left != '') {
					noteService.saveNote(element).then(function(response) {
						console.log(response);
					}, function(error) {
						console.log(error);
					});
				}
			});
		}
	};
}]);