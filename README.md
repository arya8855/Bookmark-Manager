# 🔖 Bookmark Manager

A full-stack real-time Bookmark Manager built using **Next.js (App Router)**, **Supabase**, **Google OAuth**, and **Tailwind CSS v4**.

---

## 🚀 Live Demo
(After Vercel deploy, add your link here)

---

## ✨ Features

- 🔐 Google OAuth Authentication (No email/password)
- 🔒 Private bookmarks per user (Row Level Security)
- ➕ Add bookmarks (Title + URL)
- 🗑 Delete bookmarks
- ⚡ Real-time updates across tabs
- 🎨 Styled with Tailwind CSS v4
- 🌍 Deployed on Vercel

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Database & Auth:** Supabase
- **Authentication:** Google OAuth
- **Realtime:** Supabase Postgres Changes
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

---

## 🗄 Database Schema

```sql
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  url text not null,
  user_id uuid references auth.users not null,
  created_at timestamp default now()
);


Problems Faced during this Project:--
1️. Google OAuth – "Access Blocked" Error - Since Supabase callback URL was not added in Google Cloud Console
2. Realtime Delete Not Updating UI - Postgres was not sending full row data for DELETE events, solved it by adding alter table bookmarks replica identity full;