var customService = angular.module('customService',[]);

customService.factory('noteService', ['$http', '$q', function($http, $q){

	function saveNote(event) {
		var req = {
		 method: 'POST',
		 url: '/note',
		 headers: {
		   'Content-Type': 'application/json'
		 },
		 data: { note: event.target.innerText,
		 		 position : {
		 		 	top: event.target.offsetParent.style.top,
		 		 	left: event.target.offsetParent.style.left
		 		 },
		 		 dimension : {
		 		 	height: event.target.offsetParent.clientHeight,
		 		 	width: event.target.offsetParent.clientWidth
		 		 },
		 		 note_id: event.target.offsetParent.id
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
		 		 	top: '50px',
		 		 	left: '50px'
		 		 },
		 		 dimension : {
		 		 	height: '200px',
		 		 	width: '200px'
		 		 }
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
		}).then(function success(notes) {
		    deferred.resolve(notes.data);

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
