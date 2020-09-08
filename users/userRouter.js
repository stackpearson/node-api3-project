const express = require('express');
const Users = require('../users/userDb.js');
const Posts = require('../posts/postDb.js')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: 'Error Adding User'})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postInfo = {...req.body, user_id: req.params.id};

  Posts.insert(postInfo)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(error => {
    res.status(500).json({message: 'Server error'})
  })
});

router.get('/', (req, res) => {
  Users.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: 'Error retrieving users'})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(error => {
    res.status(404).json({message: 'User ID not found'})
    res.status(500).json({message: 'Server Error, Try again'})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(error => {
    res.status(404).json({message: 'user not found'})
    res.status(500).json({message: 'server error'})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(user => {
    res.status(200).json({message: 'user deleted'})
  })
  .catch(error => {
    res.status(404).json({message: 'user id not valid'})
    res.status(500).json({message: 'server error'})
  })
});

router.put('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  Users.update(id, req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(error => {
    res.status(500).json({message: 'server error'})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;
  Users.getById(id)
  .then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({message: "User does not exist"})
    }
  })
  .catch(error => {
    error.code = 500;
    error.message = 'database error, try again';
    next(error)
  });
}

function validateUser(req, res, next) {
  
   if (req.body && req.body.name.length > 0) {
     next();
   } else {
     res.status(400).json({message: "missing required name field"})
   }
}

function validatePost(req, res, next) {
  if (req.body && req.body.text.length > 0) {
    next();
  } else {
    res.status(400).json({message: "missing required text field"})
  }
}

module.exports = router;
