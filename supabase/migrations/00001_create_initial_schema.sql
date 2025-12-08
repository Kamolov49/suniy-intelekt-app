/*
# Create Initial Schema for Zento AI

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `phone` (text, unique)
- `username` (text, unique)
- `role` (user_role enum: 'user', 'admin')
- `created_at` (timestamptz, default: now())

### chats
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `title` (text, default: 'New Chat')
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### messages
- `id` (uuid, primary key)
- `chat_id` (uuid, references chats)
- `role` (text: 'user' or 'assistant')
- `content` (text)
- `image_data` (text, nullable - for base64 image data)
- `created_at` (timestamptz, default: now())

### files
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `message_id` (uuid, references messages, nullable)
- `file_path` (text)
- `file_type` (text)
- `file_size` (integer)
- `created_at` (timestamptz, default: now())

## 2. Storage Bucket
- Create `app-83hdwq5lhuyp_chat_images` bucket for image uploads

## 3. Security
- Enable RLS on all tables
- Create `is_admin` helper function
- Admins have full access to all data
- Users can only access their own chats and messages
- Public read access for profiles view

## 4. Triggers
- Auto-sync new users to profiles table
- First user becomes admin
- Update chat updated_at on message insert
*/

-- Create user role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  phone text UNIQUE,
  username text UNIQUE,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'New Chat' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  image_data text,
  created_at timestamptz DEFAULT now()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-83hdwq5lhuyp_chat_images',
  'app-83hdwq5lhuyp_chat_images',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create admin helper function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile without changing role" ON profiles
  FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Chats policies
CREATE POLICY "Admins have full access to chats" ON chats
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Admins have full access to messages" ON messages
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view messages in own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats c
      WHERE c.id = messages.chat_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats c
      WHERE c.id = messages.chat_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in own chats" ON messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chats c
      WHERE c.id = messages.chat_id AND c.user_id = auth.uid()
    )
  );

-- Files policies
CREATE POLICY "Admins have full access to files" ON files
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'app-83hdwq5lhuyp_chat_images');

CREATE POLICY "Users can view all images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'app-83hdwq5lhuyp_chat_images');

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'app-83hdwq5lhuyp_chat_images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create trigger function to sync new users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO profiles (id, email, phone, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(
      NULLIF(SPLIT_PART(NEW.email, '@', 1), ''),
      'user_' || SUBSTRING(NEW.id::text, 1, 8)
    ),
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-sync users
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create trigger to update chat updated_at
CREATE OR REPLACE FUNCTION update_chat_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE chats SET updated_at = now() WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_timestamp();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_message_id ON files(message_id);
