const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, 'Email not valid'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: [validator.isStrongPassword],
      minlength: [8, 'Min 8 characters'],
    },
    gender: { type: String, enum: ['hombre', 'mujer'], required: true },
    rol: { type: String, enum: ['admin', 'user'], required: true },
    image: { type: String },
    confirmationCode: { type: Number, required: true },
    check: { type: Boolean, default: false },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }],
  },
  {
    timestamps: true,
  }
);

/// Antes de guardar el modelo tenemos que hacer un presave para convertir la contraseña en encrictada
UserSchema.pre('save', async function (next) {
  try {
    // vamos a encryctar la contraseña  con 10 veces la encryctacion
    this.password = await bcrypt.hash(this.password, 10);
    // metemos el next vacio para que continue
    next();
  } catch (error) {
    next('Error hashing password', error);
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
