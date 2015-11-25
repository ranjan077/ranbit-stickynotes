var Note = require('../models/note');
var User = require('../models/user');

module.exports = function(app) {
	app.post('/note', function(req, res, next) {
		var newNote = new Note();
		
		Note.findById(req.body.note_id, function(err, note) {
			if (err) {
				throw err;
			}

			if (!note) {
				newNote.note = req.body.note;
				newNote.position.top = req.body.position.top;
				newNote.position.left = req.body.position.left;
				newNote.dimension.height = req.body.dimension.height;
				newNote.dimension.width = req.body.dimension.width;

				newNote.save(function (err, note) {
                    if (err)
                       throw err;
                   User.findByIdAndUpdate(req.user._id, {$addToSet: {note: note._id}}, {upsert: true}, function(err, user) {
					   if(err)
					   	throw err;
						console.log('Notes saved.');
                    	res.send(note);
					});
				});
			}
			else {
				Note.findByIdAndUpdate(req.body.note_id , req.body, {upsert: true}, function(err, note) {
					res.send(note);
				});
			}
		})
	});
	
	app.get('/notes', function(req, res) {
		User.findById(req.user._id, function(err, user) {
					Note.find({
			'_id': { $in: user.note}
		}, function(err, notes){
					res.send(notes);
				})
			})
	});
		

	app.del('/note/:id', function(req, res) {
		Note.findById(req.params.id, function(err, note){
			
			if(err) {
				res.json({'error': err});
			}
			User.findByIdAndUpdate(req.user._id, {$pull: {note: note._id}}, {}, function(err, user) {
				if(err)
				res.json({'error': err});
				note.remove("Removed Note.");
				res.send();
			});
		})
	})
}