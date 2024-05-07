const express = require('express');

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const path = require('path');
const app = express();

// Configure Mongoose and connect to your MongoDB database
mongoose.connect('mongodb+srv://efobikings:5jP5uiSFH4nSSbcz@cluster0.rledo98.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB using Mongoose');
  });



const User = mongoose.model('User', {
  username: String,
  password: String,
  question: String,
  answer: String,
  card_No: String,
});

// Configure sessions
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use the local strategy for user authentication
    
passport.use( 

  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.set('view engine', 'ejs');

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('homepage', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('loginpage');
});

app.post(
  '/login',
  
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/register', (req, res) => {
  res.render('registrationpage');
});
app.get('/logout', (req, res) => {
    res.render('loginpage');
  });

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password')
})

// 


app.post('/forgot-password', async (req, res) => {
  const { username, password, question, answer } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect username.' });
    }

   // Simulating password reset logic (uncomment and modify as needed)
    const newPass = await bcrypt.hash(password, 10);
    user.password = newPass;
    await user.save();
    return res.send("Password reset successfully.");

    // For demonstration purposes, log the user details
    console.log(user);

    // For demonstration purposes, send a response to the client
    return res.status(200).json({ message: 'User found. Proceed with password reset.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/quiz', ( req, res)=>{
  res.render('quiz')
})



// app.post('/register', async (req, res) => {



//   let  { username, password, question, answer, cardNo} = req.body;
//   cardNo = cardNo.toString();
//   // search for card
//   const card = await Code.findOne({ sn:cardNo });
//   const card_No = card.sn
//   if (card) {
//       console.log(card)

//   } else {
//       res.status(404).json({ error: 'Card not found' });
//   }

//   // Hash the user's password before storing it
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = new User({
//     username,
//     password: hashedPassword,
//     question,
//     answer,
//     card_No,

//   });

//   try {
//     await user.save();
//     res.redirect('/login');
//   } catch (error) {
//     res.render('registrationpage', { error: 'Registration failed. Please try again.' });
//   }

//   // go back and update the available status is taken
//   const updatedCard = await Code.findOneAndUpdate(
//     { cardNo: { $regex: new RegExp('^' + cardNo + '$', 'i') } }, // Filter by card number
//     { availability: 'taken' }, // Update availability to 'taken'
//     { new: true } // Return the updated document
//   );
//   if (updatedCard) {
//     const updatedCardNumber = updatedCard.sn; // Access the updated card number
//     console.log('Updated Card Number:', updatedCardNumber);
//     res.json({ sn: updatedCardNumber, availability: updatedCard.availability });
//   } else {
//     res.status(404).json({ error: 'Card not found' });
//   }



// });
app.post('/register', async (req, res) => {
  try {
      let { username, password, question, answer, cardNo } = req.body;
      cardNo = cardNo.toString();

      // Search for the card
      const card = await Code.findOne({ sn: cardNo });

      if (!card) {
          return res.status(404).json({ error: 'Card not found' });
      }
      
        // Check if the card is already used
        if (card.availability === 'taken') {
          return res.status(400).json({ error: 'Card already used' });
      }

      // Hash the user's password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user instance
      const user = new User({
          username,
          password: hashedPassword,
          question,
          answer,
          card_No: cardNo, // Assuming this is the correct field for the card number in your User schema
      });

      // Save the user to the database
      await user.save();

      // Update the card's availability status to 'taken'
      const updatedCard = await Code.findOneAndUpdate(
          { sn: cardNo }, // Filter by card number
          { availability: 'taken' }, // Update availability to 'taken'
          { new: true } // Return the updated document
      );

      if (updatedCard) {
          const updatedCardNumber = updatedCard.sn; // Access the updated card number
          console.log('Updated Card Number:', updatedCardNumber);
          return res.json({ sn: updatedCardNumber, availability: updatedCard.availability });
      } else {
          return res.status(404).json({ error: 'Error updating card availability' });
      }
  } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});



// Define the schema for the code object
const codeSchema = new mongoose.Schema({
    sn: String,
    availability: { type: String, default: 'yes' }
});

// Create a mongoose model based on the schema
const Code = mongoose.model('Code', codeSchema);

// Function to generate codes and store them in MongoDB
async function generateAndStoreCodes() {
      try {
    //     await mongoose.connect('mongodb+srv://efobikings:5jP5uiSFH4nSSbcz@cluster0.rledo98.mongodb.net/?retryWrites=true&w=majority', {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     });

        // Generate codes and store them
        const generatedCodes = generateCodes();
        const codesToStore = generatedCodes.map(code => ({ sn: code, availability: 'yes' }));
        await Code.insertMany(codesToStore);

        console.log('Codes stored successfully.');
    } catch (error) {
        console.error('Error storing codes:', error);
    } finally {
       // mongoose.disconnect();
    }
}

function generateCodes() {
    const codes = [];
    const usedCodes = new Set();

    while (codes.length < 100) {
        const code = generateCode(12);
        if (!usedCodes.has(code)) {
            usedCodes.add(code);
            codes.push(code);
        }
    }

    return codes;
}

function generateCode(length) {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
}

// Call the function to generate and store codes
//generateAndStoreCodes();



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
