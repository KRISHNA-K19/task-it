# Task Manager App

This repository contains a Next.js (App Router) project built for Week 12 of the Full-Stack CRUD curriculum. It demonstrates secure, user-specific task management using Supabase, Server Actions, and Zod.

## 📦 Features

- User authentication via Supabase Auth
- Protected dashboard showing only the current user's tasks
- Create, read, update, and delete (CRUD) tasks using Next.js **Server Actions**
- Input validation on the server with **Zod**
- Automatic UI revalidation using `revalidatePath`
- Row Level Security (RLS) in Supabase to enforce multi‑tenant data isolation

## 🔧 Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react @supabase/auth-ui-react zod
   ```

2. **Environment variables**
   Create a `.env.local` file at the root of the project and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   # optionally, if you run service-side processes that require elevated privileges:
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Supabase schema & RLS**
   - Create a table called `tasks` with columns:
     - `id` (uuid, primary key, default `uuid_generate_v4()`)
     - `title` (text)
     - `is_completed` (boolean, default `false`)
     - `user_id` (uuid, references `auth.users(id)`)
     - `created_at` (timestamp, default `now()`)
   - Enable Row Level Security on the `tasks` table.
   - Add the following policies:
     ```sql
     create policy "Users can read their own tasks"
       on public.tasks
       for select
       using (user_id = auth.uid());

     create policy "Users can insert their own tasks"
       on public.tasks
       for insert
       with check (user_id = auth.uid());

     create policy "Users can manage their tasks"
       on public.tasks
       for update, delete
       using (user_id = auth.uid());
     ```

4. **Run the app**
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000) and sign in.

## 🚀 Deploying

Set the same environment variables in your hosting provider (e.g., Vercel). The dashboard and authentication will work the same in production.

## 📁 Important Files

- `app/layout.tsx` – Supabase provider & session setup
- `app/page.tsx` – landing page with authentication
- `app/dashboard/page.tsx` – protected task dashboard
- `app/_actions.ts` – server actions for create/update/delete
- `lib/supabaseClient.ts` – client-side Supabase helper

## 🎯 Learning Objectives Covered

This project follows the Week 12 curriculum:

- **Server Actions**: co‑located backend logic
- **Zod validation**: ensures data integrity before hitting database
- **Supabase RLS**: enforces row-level security for a multitenant app
- **Full CRUD**: tasks can be created, read, updated, and deleted

Happy hacking!