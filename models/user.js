const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
      default: "hash", // Default value to avoid undefined errors during hashing
    },

    password: {
      type: String,
      required: true,
    },

    profileImageURL: {
        type: String,
        default: "/images/blog.jpeg"
    }, 

    role: {
        type: String,
        enum : ["USER", "ADMIN"],
        default: "USER",
    }
  },
  {
    timestamps: true,
  },

);

  userSchema.pre('save', async function () { // Removed next parameter
    const user = this;

    if (!user.isModified("password")) return; // Just return, no next() needed

    try {
        const salt = randomBytes(16).toString('hex');
        const hashedpassword = createHmac('sha256', salt)
            .update(user.password)
            .digest('hex');

        user.salt = salt;
        user.password = hashedpassword;
        // No next() call needed here for async functions
    } catch (error) {
        throw error; // Mongoose will catch this and handle it
    }
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("user not found")
  
  console.log('user in model', user.salt, user.email, user.password)
  const salt = user.salt;
  const hashedpassword = user.password;

  const userProvidedhash = createHmac('sha256', salt)
            .update(password)
            .digest('hex');

  if (userProvidedhash !== hashedpassword) throw new Error("invalid password")

  const token = createTokenForUser(user);
  return token; 
}) 

const User = model("user", userSchema); 

module.exports = User; 