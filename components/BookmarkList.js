'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookmarkList({ user }) {
    const [bookmarks, setBookmarks] = useState([])
  
    useEffect(() => {
      fetchBookmarks()
  
      const channel = supabase
        .channel('realtime-bookmarks')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchBookmarks()
          }
        )
        .subscribe()
  
      return () => {
        supabase.removeChannel(channel)
      }
    }, [])
  
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
  
      setBookmarks(data || [])
    }
  
    const handleDelete = async (id) => {
      await supabase.from('bookmarks').delete().eq('id', id)
    }
  
    return (
      <div>
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="border p-3 mb-2 flex justify-between"
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
    )
  }