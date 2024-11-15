// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const validator = require('validator')

// const Schema = mongoose.Schema

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// })

// // static signup method
// userSchema.statics.signup = async function(email, password) {

//   // validation
//   if (!email || !password) {
//     throw Error('All fields must be filled')
//   }
//   if (!validator.isEmail(email)) {
//     throw Error('Email not valid')
//   }
//   if (!validator.isStrongPassword(password)) {
//     throw Error('Password not strong enough')
//   }

//   console.log("password strong enough")

//   const exists = await this.findOne({ email })

//   if (exists) {
//     throw Error('Email already in use')
//   }

//   const salt = await bcrypt.genSalt(10)
//   const hash = await bcrypt.hash(password, salt)


//   const user = await this.create({ email, password: hash })

//   return user
// }

// // static login method
// userSchema.statics.login = async function(email, password) {

//   if (!email || !password) {
//     throw Error('All fields must be filled')
//   }

//   const user = await this.findOne({ email })
//   if (!user) {
//     throw Error('Incorrect email')
//   }

//   const match = await bcrypt.compare(password, user.password)
//   if (!match) {
//     throw Error('Incorrect password')
//   }

//   return user
// }

// module.exports = mongoose.model('User', userSchema)

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "Email not valid"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8
  }
});

// static signup method
userSchema.statics.signup = async function(email, password) {
  // validation
  //db.collection.dropIndex("username_1")


  if (!email || !password) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password not strong enough');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log("hash created")

  // Create user with hashed password
  //const user = await this.create();
  const newUser = new this({ email, password: hash }); // Instantiate user model with hashed password
  await newUser.save(); // Save to the database
 
  console.log("user created")
  return newUser;
}

// static login method
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw new Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Incorrect password');
  }

  return user;
}

module.exports = mongoose.model('User', userSchema);
