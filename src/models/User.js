// 'require' means the previously loaded 'mongoose' instance is
// re-used - it behaves like a singleton
// https://nodejs.org/api/modules.html#modules_caching
// https://medium.com/@lazlojuly/are-node-js-modules-singletons-764ae97519af
import { Schema, model } from 'mongoose'

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

// Compile Schema into Model and export
export default model('User', UserSchema)

/* --> NOTE:
The first argument to mongoose.model() is the _singular_ name of the collection the model is for. ** Mongoose automatically looks for the plural, lowercased version of this model name. ** In this case, the model 'User' is for the 'users' collection in the database:

> show dbs
admin            0.000GB
config           0.000GB
forgetmenot-dev  0.000GB
local            0.000GB

> use forgetmenot-dev
switched to db forgetmenot-dev

> show collections
notes
users

> db.users.find()

*/