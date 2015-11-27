var myapp = angular.module('myapp', ['ngRoute', 'customService']);

myapp.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/notes', {
		templateUrl: 'assets/templates/notes.ejs',
		controller: 'notesController'
	})
	.when('/todo', {
		templateUrl: 'assets/templates/todo.ejs'
	})
}]);

myapp.controller('mainController', ['$scope', '$location', function($scope, $location){
	$location.path('/notes');
}]);

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

	$scope.updateNoteContent = function(event) {
		noteService.updateNoteContent(event.target).then(function(response) {
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
}]);

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

	function getCoordinatesOfElement (element) {
		var pointA = { x:element.offsetLeft , y:element.offsetTop + element.offsetHeight };
		var pointB = { x:element.offsetLeft + element.offsetWidth, y:element.offsetTop + element.offsetHeight };
		var pointC = { x:element.offsetLeft + element.offsetWidth, y:element.offsetTop};
		var pointD = { x:element.offsetLeft, y:element.offsetTop };

		return {
			'A': pointA,
			'B': pointB,
			'C': pointC,
			'D': pointD
		}
	}

	function getMaxZindexElement(elements) {
		return _.max(elements, function (element) {
		 	return parseInt(element[0].style.zIndex);
		});
	}

	return {
		restrict: 'A',
		priority: 1,
		link: function($scope, element, iAttrs, controller) {
			
			var noteMainElelemnt,
				noteContentElelemnt,
				$elements;
			
			element.draggable({ cancel: '.note-content', containment: 'parent'}).resizable();

			element.on('dragstart', function(event) {
                $(element).addClass('active');
                element[0].style.zIndex = 9999;
            });

			/*element.on('dragstop', function(event) {
			
				var point = getCoordinatesOfElement(element[0]);
				// Get all stickynotes which are stacked on or below the selected note.
				$elements = GetAllElementsAt(point['A'], point['B'], point['C'], point['D']);
				var maxZindexElement = getMaxZindexElement($elements);
				
				element[0].style.zIndex = maxZindexElement == '-Infinity' ? 0 : parseInt(maxZindexElement[0].style.zIndex) + 1;
				$(element).removeClass('active');
								
				noteService.saveNote(element[0], $(element).attr('theme')).then(function(response) {
					console.log(response);
				}, function(error) {
					console.log(error);
				});
				
			});*/

			element.on('mouseup', function(event) {
				if ($(event.target).hasClass('note-delete')) {
					return;
				}
				$(element).addClass('active');
				var point = getCoordinatesOfElement(element[0]);
				// Get all stickynotes which are stacked on or below the selected note.
				$elements = GetAllElementsAt(point['A'], point['B'], point['C'], point['D']);
				var maxZindexElement = getMaxZindexElement($elements);
				element[0].style.zIndex = maxZindexElement == '-Infinity' ? 0 : parseInt(maxZindexElement[0].style.zIndex) + 1;
				$(element).removeClass('active');

				noteService.saveNote(element[0], $(element).attr('theme')).then(function(response) {
					console.log(response);
				}, function(error) {
					console.log(error);
				});

			})
		}
	};
}]);