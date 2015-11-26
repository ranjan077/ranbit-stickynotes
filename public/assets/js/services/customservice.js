var customService = angular.module('customService',[]);

customService.factory('noteService', ['$http', '$q', function($http, $q){

	function saveNote(element, theme) {
		
		var req = {
		 method: 'POST',
		 url: '/note',
		 headers: {
		   'Content-Type': 'application/json'
		 },
		 data: { note: element.innerText,
		 		 position : {
		 		 	top: element.style.top,
		 		 	left: element.style.left
		 		 },
		 		 dimension : {
		 		 	height: element.clientHeight,
		 		 	width: element.clientWidth
		 		 },
		 		 zindex: element.style.zIndex,
		 		 note_id: element.id,
		 		 noteTheme: theme || 'yellow'
		  }
		}
		var deferred = $q.defer();
		$http(req).then(function(data) {
			deferred.resolve('Note is saved.');
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	function addNote() {
		var req = {
		 method: 'POST',
		 url: '/note',
		 headers: {
		   'Content-Type': 'application/json'
		 },
		 data: { note: '',
		 		 position : {
		 		 	top: '10%',
		 		 	left: '10%'
		 		 },
		 		 dimension : {
		 		 	height: '25%',
		 		 	width: '14%'
		 		 },
		 		 zindex: '0',
		 		 noteTheme: 'yellow'
		 	}
		}
		var deferred = $q.defer();

		$http(req).then(function(data) {
			deferred.resolve();
		}, function(error) {
			deferred.reject(error);
		})
		return deferred.promise;
	}

	function getNotes() {
		var deferred = $q.defer();
		$http({
		  method: 'GET',
		  url: '/notes'
		}).then(function success(notes) {
		    deferred.resolve(notes.data);

		  }, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	function deleteNote(note_id) {
		var deferred = $q.defer();
		$http({
		  method: 'DELETE',
		  url: '/note/' +  note_id
		}).then(function success(response) {
		    deferred.resolve(response);

		  }, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	return {
		saveNote: saveNote,
		addNote: addNote,
		getNotes: getNotes,
		deleteNote: deleteNote
	}
}])
