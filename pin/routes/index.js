const express = require('express');
const router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const upload = require('./multer')
const postModel = require('./post')
passport.use(new localStrategy(userModel.authenticate()));


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}
router.get('/', (req, res) => {
    res.render('index', {nav:false});
});

router.get('/register', (req, res) => {
  res.render('register' , {nav:false});
});

router.get('/profile', isLoggedIn,async  (req, res) => {
  console.log("Hiii")
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts');

  res.render('profile' , {user , nav:true});
});


router.get('/show/posts', isLoggedIn,async  (req, res) => {
  const user = await userModel
  .findOne({username:req.session.passport.user})
  .populate('posts');
  res.render('show' , {user , nav:true});
});

router.get('/feed',isLoggedIn , async function(req,res){
  // const user = await userModel.findOne({username:req.session.passport.user});
 const posts = await  postModel.find();
 res.render('feed' , {posts ,nav:true});
})

router.get('/add', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({username:req.session.passport.user});

  res.render('add' , {user ,nav:true});
});

router.post('/createpost', isLoggedIn, upload.single('postimage'), async (req, res) => {
  
    const user = await userModel.findOne({ username: req.session.passport.user });
    const post1 = await postModel.create({
      user: user._id,
      title: req.body.title,
      postimage: req.file.filename,
      description: req.body.description,
    });

    user.posts.push(post1._id);
    await user.save();

    res.redirect('/profile');
});


router.post('/fileupload', isLoggedIn,upload.single("image"), async function(req, res){
 const user = await userModel.findOne({username:req.session.passport.user})
  user.profileImage = req.file.filename;
  await user.save();
});


router.post('/register', (req, res, next) => {
  const { username, email, contact, password } = req.body;
  const newUser = new userModel({ username, email, contact });
  userModel.register(newUser, password)
    .then(() => {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/profile');
      });
    })
    .catch(err => {
      console.error('Error registering user:', err);
      res.redirect('/register'); // Redirecting to register page in case of error
    });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/profile',
}));


router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


module.exports = router;