# 📋 Task Manager – Full-Stack CRUD with Server Actions & Zod

A production-ready, fully-featured task management application built with **Next.js 16**, **Supabase**, **Server Actions**, and **Zod** validation. This project demonstrates modern full-stack development practices with secure data handling and multi-tenant RLS.

---

## ✨ Features

### Core Functionality
- ✅ **Full CRUD Operations** – Create, read, update, and delete tasks using Server Actions
- 🔐 **User Authentication** – Secure login/signup with Supabase Auth (GitHub OAuth support)
- 🛡️ **Row Level Security (RLS)** – Each user can only access their own tasks
- 📝 **Server-Side Validation** – Zod schemas validate all inputs before reaching the database

### Task Management
- 🎯 **Task Priority** – Set tasks as Low, Medium, or High priority
- 📅 **Due Dates** – Assign deadlines to tasks (with overdue indicators)
- ✔️ **Task Completion** – Mark tasks as complete/incomplete with visual feedback
- ✏️ **Edit Tasks** – Modify task details anytime
- 🗑️ **Delete Tasks** – Permanently remove tasks

### Dashboard Features
- 📊 **Task Statistics** – View total, completed, pending, and high-priority task counts
- 🔍 **Search & Filter** – Search tasks by title or filter by:
  - Status (All, Active, Completed)
  - Priority (All, High, Medium, Low)
- 🎯 **Smart Filtering** – Multiple filters work together seamlessly
- 📱 **Responsive Design** – Works perfectly on desktop, tablet, and mobile
- 🔔 **Toast Notifications** – Instant feedback for all actions (success/error)

### UI/UX
- 🎨 **Modern Design** – Beautiful Tailwind CSS styling with gradient backgrounds
- ⚡ **Loading States** – Visual feedback while operations are in progress
- 🚨 **Form Validation** – Client and server-side validation with error messages
- 🌈 **Color-Coded Priorities** – Easy visual identification of task urgency
- 📋 **Empty States** – Helpful messages when no tasks are found

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Validation** | Zod |
| **Server Logic** | Next.js Server Actions |
| **Notifications** | Sonner |
| **UI/UX** | React Components |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works great)
- GitHub OAuth app (optional, for GitHub login)

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd task-manager
npm install
```

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-ui-react zod sonner
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Supabase Database Setup

Run this SQL in your Supabase SQL Editor to create the tasks table with RLS:

```sql
-- Create tasks table
create table public.tasks (
  id uuid not null default gen_random_uuid() primary key,
  title text not null,
  is_completed boolean not null default false,
  priority text not null default 'medium',
  due_date timestamp with time zone,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Policy: Users can only read their own tasks
create policy "Users can read their own tasks"
  on public.tasks
  for select
  using (user_id = auth.uid());

-- Policy: Users can insert their own tasks
create policy "Users can insert their own tasks"
  on public.tasks
  for insert
  with check (user_id = auth.uid());

-- Policy: Users can update/delete their own tasks
create policy "Users can manage their own tasks"
  on public.tasks
  for update, delete
  using (user_id = auth.uid());
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start using the app!

---

## 📁 Project Structure

```
task-manager/
├── app/
│   ├── components/
│   │   ├── AuthPage.tsx          # Login/Signup UI
│   │   ├── DashboardClient.tsx   # Main dashboard (client-side logic)
│   │   ├── TaskForm.tsx          # Create/Edit task form
│   │   ├── TaskCard.tsx          # Individual task component
│   │   ├── TaskStats.tsx         # Statistics display
│   │   ├── SignOutButton.tsx     # User logout
│   │   └── ToastProvider.tsx     # Notification system
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard page (server component)
│   ├── _actions.ts               # Server actions (CRUD operations)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects to dashboard if logged in)
│   └── globals.css               # Global styles
├── lib/
│   └── supabaseClient.ts         # Client-side Supabase initialization
├── .env.local                    # Environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏗️ How It Works

### Authentication Flow
1. User visits homepage → sees Supabase Auth widget
2. Signs in with email/password or GitHub
3. `page.tsx` redirects authenticated users to `/dashboard`
4. Session is maintained server-side using cookies

### Task CRUD Flow
1. **Create**: Form submission → `createTask` Server Action → Zod validation → Database insert → `revalidatePath` → UI updates
2. **Read**: Server-side fetch from Supabase (RLS enforces user-specific data)
3. **Update**: Toggle completion or edit task → `toggleTask`/`editTask` Server Action → Database update → UI revalidates
4. **Delete**: Confirmation dialog → `deleteTask` Server Action → Database delete → Toast notification → UI updates

### Security
- **Server Actions**: All mutations happen on the server, never exposing database queries to the client
- **Zod Validation**: Strict input validation prevents malformed data
- **Row Level Security**: Database-level policies ensure users cannot access other users' data
- **Session Management**: Supabase handles secure session cookies

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy!

### Deploy to Other Platforms

The app works with any Node.js hosting that supports Next.js (Netlify, Railway, etc.). Just set the same environment variables.

---

## 🧪 Example Workflow

1. **Sign in** at `http://localhost:3000` with:
   - Email: `krishnamoorthyk.cse@gmail.com`
   - Password: `123456`
2. **View dashboard** with statistics and empty task list
3. **Create tasks**:
   - Title: "Complete Project"
   - Priority: "High"
   - Due Date: Pick a date
4. **Manage tasks**:
   - ✔️ Mark complete
   - ✏️ Edit
   - 🗑️ Delete
5. **Filter & Search**:
   - Search by keywords
   - Filter by status or priority
6. **Sign out** and verify RLS by trying to access another user's tasks (fails gracefully)

---

## 📚 Learning Outcomes

This project covers:
- ✅ Next.js Server Actions for secure backend logic
- ✅ Zod for runtime type validation
- ✅ Supabase Row Level Security for multi-tenant data isolation
- ✅ Supabase Auth integration in Next.js 16
- ✅ React hooks (useState, useEffect, useTransition)
- ✅ TypeScript best practices
- ✅ Tailwind CSS for responsive design
- ✅ Error handling and user feedback
- ✅ SEO and metadata management

---

## 🤝 Contributing

Feel free to fork, modify, and improve this project! Some ideas:
- Add task categories/tags
- Implement recurring tasks
- Add due date reminders
- Dark mode toggle
- Export/Import tasks
- Collaborative task sharing

---

## 📄 License

MIT – Use freely in personal and commercial projects.

---

## 🙏 Support

If you have questions or run into issues:
1. Check the [Next.js docs](https://nextjs.org/docs)
2. Check the [Supabase docs](https://supabase.com/docs)
3. Check the [Zod docs](https://zod.dev)
4. Open an issue in the repository

**Happy task managing! 🚀**
