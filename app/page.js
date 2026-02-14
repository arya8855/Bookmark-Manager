'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AddBookmark from '@/components/AddBookmark'
import BookmarkList from '@/components/BookmarkList'


export default function Home() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        window.location.href = '/login'
      } else {
        setUser(data.user)
        fetchBookmarks(data.user.id)
        subscribeToBookmarks(data.user.id)
      }
    }

    init()
  }, [])

  const fetchBookmarks = async (userId) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

  const subscribeToBookmarks = (userId) => {
    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setBookmarks((prev) => [payload.new, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((bookmark) => bookmark.id !== payload.old.id)
          )
        }
      )
      .subscribe()
  
    return channel
  }

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

  const handleDelete = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto mt-10">
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
          className="bg-blue-500 text-white px-5 py-3 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <div>
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="border p-3 mb-2 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{bookmark.title}</h3>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => handleDelete(bookmark.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}