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
  },
  focusTime: {
    total: {
      type: Number, // Total time focused in minutes
      default: 0,
    },
    pastYear: {
      type: Number, // Time focused in the past year
      default: 0,
    },
    pastMonth: {
      type: Number, // Time focused in the past month
      default: 0,
    },
    pastWeek: {
      type: Number, // Time focused in the past week
      default: 0,
    },
    pastDay: {
      type: Number, // Time focused in the past day
      default: 0,
    },
  },
  currency: {
    type: Number,
    default: 1000,
  },
  speciesOwned: [
    {
      type: String,
    }
  ],
  dayTank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'dayTank', // Reference to the day tank schema
  },
  weekTank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'weekTank', // Reference to the week tank schema
  },
  monthTank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'monthTank', // Reference to the month tank schema
  },
  yearTank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'yearTank', // Reference to the year tank schema
  },
  achievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement', // Reference to Achievement Schema
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// static signup method
userSchema.statics.signup = async function(email, password) {


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

// function: build a hash map, mapping a tank schema to an array of corresponding session schemas
// this will come in handy when the data is needed to build a UI, for the tank, graph, etc.


module.exports = mongoose.model('User', userSchema);
