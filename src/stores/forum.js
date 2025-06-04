import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/utils/axios'

export const useForumStore = defineStore('forum', () => {
  const posts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Fetch all posts
  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('forum')
      posts.value = response.data.map(post => ({
        id: post.id,
        title: post.content.substring(0, 100) + '...', // Use first 100 chars as title
        content: post.content,
        image: post.image,
        date: post.created_at,
        author: {
          email: post.author_email,
          firstName: post.author_first_name,
          lastName: post.author_last_name
        },
        likes: post.reaction_count,
        comments: post.comments || [],
        commentCount: post.comment_count,
        reactions: post.reactions || {},
        isLiked: false,
        isBookmarked: false
      }))
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch posts'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Fetch a specific post with details
  const fetchPostDetails = async (postId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`forum/${postId}/`)
      const post = response.data
      return {
        id: post.id,
        title: post.content.substring(0, 100) + '...',
        content: post.content,
        image: post.image,
        date: post.created_at,
        author: {
          email: post.author_email,
          firstName: post.author_first_name,
          lastName: post.author_last_name
        },
        likes: post.reaction_count,
        comments: post.comments || [],
        commentCount: post.comment_count,
        reactions: post.reactions || {},
        isLiked: false,
        isBookmarked: false
      }

    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch post details'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Create a new post
  const createPost = async (postData) => {
    loading.value = true
    error.value = null
    console.log(postData)
    try {
      const response = await api.post('forum/create/', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const newPost = {
        id: response.data.id,
        title: response.data.content.substring(0, 100) + '...',
        content: response.data.content,
        image: response.data.image,
        date: response.data.created_at,
        author: {
          email: response.data.author_email,
          firstName: response.data.author_first_name,
          lastName: response.data.author_last_name
        },
        likes: response.data.reaction_count,
        comments: response.data.comments || [],
        commentCount: response.data.comment_count,
        reactions: response.data.reactions || {},
        isLiked: false,
        isBookmarked: false
      }
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create post'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Update a post
  const updatePost = async (postId, postData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`forum/${postId}/`, {
        content: postData.content,
        image: postData.image || null
      })
      const updatedPost = {
        id: response.data.id,
        title: response.data.content.substring(0, 100) + '...',
        content: response.data.content,
        image: response.data.image,
        date: response.data.created_at,
        author: {
          email: response.data.author_email,
          firstName: response.data.author_first_name,
          lastName: response.data.author_last_name
        },
        likes: response.data.reaction_count,
        comments: response.data.comments || [],
        commentCount: response.data.comment_count,
        reactions: response.data.reactions || {},
        isLiked: false,
        isBookmarked: false
      }
      const index = posts.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      return updatedPost
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update post'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Delete a post
  const deletePost = async (postId) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`forum/${postId}/`)
      posts.value = posts.value.filter(post => post.id !== postId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete post'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Add a reaction to a post
  const addReaction = async (postId, reactionType) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`forum/${postId}/reactions/`, {
        type: reactionType
      })
      const index = posts.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        posts.value[index].reactions = response.data.reactions
        posts.value[index].likes = response.data.reaction_count
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add reaction'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Add a comment to a post
  const addComment = async (postId, commentData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`forum/${postId}/comments/`, commentData)
      const index = posts.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        posts.value[index].comments.push(response.data)
        posts.value[index].commentCount += 1
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add comment'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Fetch comments for a post with pagination
  const fetchComments = async (postId, page = 1, pageSize = 10) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`forum/${postId}/comments/all`, {
        params: {
          page,
          // page_size: pageSize
        }
      })
      const index = posts.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        posts.value[index].comments = response.data.results || []
        posts.value[index].commentCount = response.data.count || 0
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch comments'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPostDetails,
    createPost,
    updatePost,
    deletePost,
    addReaction,
    addComment,
    fetchComments
  }
}) 