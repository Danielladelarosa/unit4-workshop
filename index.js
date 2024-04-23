
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'supertopjsonwebtokensecret'; // Change this 

app.use(bodyParser.json());

// JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' })
    req.userId = decoded.userId;
    next()
  })
};

// Register endpoint
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET)
    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(401).json({ error: 'Invalid username/password' })

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid username/password' })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET)
    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// Get all posts


// Get a post by ID
app.get('/api/posts/:id', verifyToken, async (req, res) => {
  const postId = parseInt(req.params.id)

 // TRY CATCH
});

// Create a new post
app.post('/api/posts', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: req.userId,
      },
    })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// Update a post by ID
app.put('/api/posts/:id', verifyToken, async (req, res) => {
  const postId = parseInt(req.params.id)
  const { title, content } = req.body

  // TRY, AWAIT, CATCH
});

// Delete a post
app.delete('/api/posts/:id', verifyToken, async (req, res) => {
  const postId = parseInt(req.params.id)

  // TRY CATCH
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
