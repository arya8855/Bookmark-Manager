'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddBookmark({ user }) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
  
    const handleAdd = async () => {
      if (!title || !url) return
  
      await supabase.from('bookmarks').insert([
        {
          title,
          url,
          user_id: user.id
        }
      ])
  
      setTitle('')
      setUrl('')
    }
  
    return (
      <div className="mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>
    )
  }