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
// https://mongoosejs.com/docs/models.html
// 'users' will be the name of the collection in the database - not bothering
// with supplying uppercased singular model name 'User' which would result in
// the same ('users') colelction name
export default model('users', UserSchema)
