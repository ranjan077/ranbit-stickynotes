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
		var element, theme;

		if(event.target.className == 'note-header') {
			element = event.currentTarget.children[1];
		}
		else {
			element = event.target;
		}
		
		theme = $(event.target.offsetParent).attr('theme');

		noteService.saveNote(element, theme).then(function(response) {
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
		noteService.deleteNote(event.target.offsetParent.id).then(function(response) {
			if (response.data.status == 'Removed note') {
				noteService.getNotes().then(function(notes) {
					$scope.notes = notes;
				}, function(error) {
					console.log(error);
				});
			}
		}, function(error) {
			console.log(error);
		});
	}

	$scope.changeTheme = function(event, theme) {
		var element = event.target.offsetParent;
		if (theme == 'blue') {
			$(element).attr('theme', 'blue');
		}
		else if (theme == 'red') {
			$(element).attr('theme', 'red');
		}
		else if (theme == 'gray') {
			$(element).attr('theme', 'gray');
		}
		else if (theme == 'yellow') {
			$(element).attr('theme', 'yellow');
		}
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

	function GetAllElementsAt(a, b, c, d) {
	    var $elements = $("body .sticky").map(function() {
	        var $this = $(this);
	        var offset = $this.offset();
	        var l = this.offsetLeft;
	        var t = this.offsetTop;
	        var h = $this.height();
	        var w = $this.width();

	        var maxx = l + w;
	        var maxy = t + h;

	        return ((a.y <= maxy && a.y >= t) && (a.x <= maxx && a.x >= l) || (b.y <= maxy && b.y >= t) && (b.x <= maxx && b.x >= l) || (c.y <= maxy && c.y >= t) && (c.x <= maxx && c.x >= l) || (d.y <= maxy && d.y >= t) && (d.x <= maxx && d.x >= l))  &&  $this.hasClass('sticky') && !$this.hasClass('active')? $this : null;
	    });

	    return $elements;
	}

	return {
		restrict: 'A',
		priority: 0,
		link: function($scope, element, iAttrs, controller) {
			
			var noteMainElelemnt,
				noteContentElelemnt,
				$elements;
			
			element.draggable({ cancel: '.note-content', containment: 'parent'}).resizable();
			element.on('dragstart', function(event) {
                $(event.target).addClass('active');
            });
			element.on('mouseup', function(event) {
				var pointA = { x:event.target.offsetParent.offsetLeft , y:event.target.offsetParent.offsetTop + event.target.offsetParent.offsetHeight };
				var pointB = { x:event.target.offsetParent.offsetLeft + event.target.offsetParent.offsetWidth, y:event.target.offsetParent.offsetTop + event.target.offsetParent.offsetHeight };
				var pointC = { x:event.target.offsetParent.offsetLeft + event.target.offsetParent.offsetWidth, y:event.target.offsetParent.offsetTop};
				var pointD = { x:event.target.offsetParent.offsetLeft, y:event.target.offsetParent.offsetTop };
				
				// Get all stickynotes which are stacked on or below the selected note.
				$elements = GetAllElementsAt(pointA, pointB, pointC, pointD);
				var maxZindex = _.max($elements, function (element) {
				  return parseInt(element[0].style.zIndex);
				});
				
				if (event.target.className == 'note-delete') {
					return;
				}
				else {
					noteMainElelemnt = event.target.offsetParent;
					noteContentElelemnt = noteMainElelemnt.children[1];
				}

				noteMainElelemnt.style.zIndex = maxZindex == '-Infinity' ? noteMainElelemnt.style.zIndex : parseInt(maxZindex[0].style.zIndex) + 1;
				$(noteMainElelemnt).removeClass('active');
								
				noteService.saveNote(noteContentElelemnt, $(noteMainElelemnt).attr('theme')).then(function(response) {
					console.log(response);
				}, function(error) {
					console.log(error);
				});
				
			});
		}
	};
}]);