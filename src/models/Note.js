import { Schema, model } from 'mongoose'


// Create Schema
// 
// One to Many relationship between users and notes
// Rather than storing an array fo Note references in User, it is 
// preferable to store a User reference in each Note
// 
// https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/
const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// Compile Schema into Model and export
export default model('Note', NoteSchema)

/* --> NOTE:
https://mongoosejs.com/docs/models.html
The first argument to mongoose.model() is the _singular_ name of the collection the model is for. ** Mongoose automatically looks for the plural, lowercased version of this model name. ** In this case, the model 'Note' is for the 'notes' collection in the database:

> show dbs
admin            0.000GB
config           0.000GB
forgetmenot-dev  0.000GB
local            0.000GB

> use forgetmenot-dev
switched to db forgetmenot-dev

> show collections
notes

> db.notes.find()
{ "_id" : ObjectId("5d7d73ac8016d87a289eca4a"), "title" : "A note", "details" : "ssdsdsdsd", "date" : ISODate("2019-09-14T23:11:40.132Z"), "__v" : 0 }
{ "_id" : ObjectId("5d7d7d0aa6a07a08eb7fead1"), "title" : "note 2", "details" : "note 2 Details", "date" : ISODate("2019-09-14T23:51:38.198Z"), "__v" : 0 }
{ "_id" : ObjectId("5d7d806dc772580d46ea3168"), "title" : "note 3", "details" : "its the third note!", "date" : ISODate("2019-09-15T00:06:05.356Z"), "__v" : 0 }

*/