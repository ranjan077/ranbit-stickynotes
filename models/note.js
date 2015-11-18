var mongoose =  require('mongoose');
/*var notePosition = new  mongoose.Schema({
   top    : String,
   left   : String
});
var noteDimension = new  mongoose.Schema({
   width    : String,
   height   : String
});*/
var noteSchema  = new  mongoose.Schema({
   note      : String,
   position  : {
   				top    : String,
   				left   : String
   },
   dimension : {
   				width    : String,
   				height   : String
   }
});

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;