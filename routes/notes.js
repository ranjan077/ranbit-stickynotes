var Note = require('../models/note');
var User = require('../models/user');
var mongoose = require('mongoose');


module.exports = function(app) {
	app.post('/note', function(req, res, next) {
		var newNote = new Note();
		var id = mongoose.Types.ObjectId(req.body.note_id);
		Note.findById(id, function(err, note) {
			if (err) {
				throw err;
			}

			if (!note) {
				newNote.note = req.body.note;
				newNote.position.top = req.body.position.top;
				newNote.position.left = req.body.position.left;
				newNote.dimension.height = req.body.dimension.height;
				newNote.dimension.width = req.body.dimension.width;
				newNote.zindex = req.body.zindex;
				newNote.noteTheme = req.body.noteTheme;
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

				// reseting zindex of other notes
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
		process.nextTick(function() {
			Note.findById(req.params.id, function(err, note){
			
				if(err) {
					res.json({'error': err});
				}
				if (note) {
					User.findByIdAndUpdate(req.user._id, {$pull: {note: note._id}}, {}, function(err, user) {
						if(err)
						res.json({'error': err});
						note.remove();
						res.send({'status': 'Removed note'});
					});
				}
				else {
					res.send({'status': ''});
				}
			})
		});
		
	})
}