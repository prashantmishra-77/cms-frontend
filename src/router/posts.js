import express from 'express'
import Post from '../models/Post.js'

const router = express.Router()

// ============================================
// GET /api/posts — get all posts
// ============================================
router.get('/', async (req, res) => {
  try {
    const { status, category, search } = req.query

    // Build filter object dynamically
    const filter = {}
    if (status   && status   !== 'all') filter.status   = status
    if (category && category !== 'all') filter.category = category
    if (search) {
      filter.title = { $regex: search, $options: 'i' }  // case-insensitive search
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 })
    res.json(posts)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ============================================
// GET /api/posts/:id — get one post
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ============================================
// GET /api/posts/slug/:slug — get post by slug (for public blog)
// ============================================
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({
      slug:   req.params.slug,
      status: 'published',
    })
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ============================================
// POST /api/posts — create post
// ============================================
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body)
    const saved = await post.save()
    res.status(201).json(saved)
  } catch (err) {
    // Handle duplicate slug
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists' })
    }
    res.status(400).json({ message: err.message })
  }
})

// ============================================
// PUT /api/posts/:id — update post
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // return updated doc, run validations
    )
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists' })
    }
    res.status(400).json({ message: err.message })
  }
})

// ============================================
// DELETE /api/posts/:id — delete post
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router