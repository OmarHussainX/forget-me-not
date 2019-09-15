// 'require' means the previously loaded 'mongoose' instance is
// re-used - it behaves like a singleton
// https://nodejs.org/api/modules.html#modules_caching
// https://medium.com/@lazlojuly/are-node-js-modules-singletons-764ae97519af
const mongoose = require('mongoose')

// Create Schema
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// Compile Schema into Model and export
module.exports = mongoose.model('Note', NoteSchema)

/* --> NOTE:
The first argument to mongoose.model() is the _singular_ name of the collection the model is for. ** Mongoose automatically looks for the plural, lowercased version of this model name. ** In this case, the model 'Note' is for the 'notes' collection in the database:

> show dbs
admin            0.000GB
config           0.000GB
forgetmenot-dev  0.000GB
local            0.000GB

> show collections
notes

> use forgetmenot-dev
switched to db forgetmenot-dev

> show collections
notes

> db.notes.find()
{ "_id" : ObjectId("5d7d73ac8016d87a289eca4a"), "title" : "A note", "details" : "ssdsdsdsd", "date" : ISODate("2019-09-14T23:11:40.132Z"), "__v" : 0 }
{ "_id" : ObjectId("5d7d7d0aa6a07a08eb7fead1"), "title" : "note 2", "details" : "note 2 Details", "date" : ISODate("2019-09-14T23:51:38.198Z"), "__v" : 0 }
{ "_id" : ObjectId("5d7d806dc772580d46ea3168"), "title" : "note 3", "details" : "its the third note!", "date" : ISODate("2019-09-15T00:06:05.356Z"), "__v" : 0 }

*/