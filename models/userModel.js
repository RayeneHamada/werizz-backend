const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const GeoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
  }
});


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: "E-mail can\'t be empty"
  },
  fullName: {
    type: String,

  },
  password: {
    type: String,
    required: "E-mail can\'t be empty"
  },
  saltSecret: String,

  phoneNumber: {
    type: String,
    unique: true,
    required: false

  },
  profile_image: {
    type: String
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }],
  bio: {
    type: String 
  },
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories"
  }],
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stories"
  }],
  addresses: [{
    address_name: {
      type: String,
      default: "home"
    },
    street: {
      type: String
    },
    landmark: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String,
      default: 'United Kingdom'
    },
    geolocation: GeoSchema,
  }],
  business: {
    business_type: {
      type: String,
      enum: ['trader', 'private seller'],
    },
    trader: {
      company_name: {
        type: String
      },
      registration_number: {
        type: String
      },
      website: {
        type: String
      },
      tax_registration_number_image: {
        type: String
      },
      tax_registration_number_verified: {
        type: Boolean,
        default: false
      }
    },

    private_seller: {
      business_name: {
        type: String
      }
    },
  },
      activated: {
    type: Boolean,
    default: false
  },
  online: {
    type: Boolean,
    default:false
    },

  role: {
    type: String,
    enum: ['user', 'business', 'admin'],
    default: 'user'
  },
});

userSchema.index({ "addresses.geolocation": "2dsphere" });


// Custom validation for email
userSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');


userSchema.pre('save', function (next) {
  try {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        this.saltSecret = salt;
        next();
      });
    });
  }
  catch (error) {
    next(error);
  }

});

userSchema.methods.verifyPassword = function (password) {

  return bcrypt.compareSync(password, this.password);
};


userSchema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    });
}


userSchema.methods.usePasswordHashToMakeToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: 3600 // 1 hour
  })
  return token
}



mongoose.model('Users', userSchema);