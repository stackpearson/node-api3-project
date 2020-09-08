const express = require('express');
const Users = require('../users/userDb.js');
const Posts = require('../posts/postDb.js')

const router = express.Router();

router.post('/', (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: 'Error Adding User'})
  })
});

router.post('/:id/posts', (req, res) => {
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

router.get('/:id', (req, res) => {
  Users.getById(req.params.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(error => {
    res.status(404).json({message: 'User ID not found'})
    res.status(500).json({message: 'Server Error, Try again'})
  })
});

router.get('/:id/posts', (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(error => {
    res.status(404).json({message: 'user not found'})
    res.status(500).json({message: 'server error'})
  })
});

router.delete('/:id', (req, res) => {
  Users.remove(req.params.id)
  .then(user => {
    res.status(200).json({message: 'user deleted'})
  })
  .catch(error => {
    res.status(404).json({message: 'user id not valid'})
    res.status(500).json({message: 'server error'})
  })
});

router.put('/:id', (req, res) => {
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
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
