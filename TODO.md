# Task: Build Zento AI - ChatGPT-like AI Assistant System

## Plan
- [x] 1. Initialize Supabase and setup database
  - [x] 1.1 Initialize Supabase project
  - [x] 1.2 Create database schema (profiles, chats, messages, files)
  - [x] 1.3 Setup image storage bucket
  - [x] 1.4 Configure RLS policies
  - [x] 1.5 Create auth trigger for profile sync
- [x] 2. Setup project dependencies
  - [x] 2.1 Install required packages (marked, browser-image-compression)
  - [x] 2.2 Create type definitions
  - [x] 2.3 Setup API utilities
- [x] 3. Design system and theming
  - [x] 3.1 Update index.css with purple-blue gradient theme
  - [x] 3.2 Configure tailwind.config.js
- [x] 4. Implement authentication system
  - [x] 4.1 Create login page with multiple auth methods
  - [x] 4.2 Setup route guards
  - [x] 4.3 Add logout functionality
  - [x] 4.4 Create admin management page
- [x] 5. Build chat interface
  - [x] 5.1 Create main chat layout with sidebar
  - [x] 5.2 Implement chat list component
  - [x] 5.3 Build message display with markdown rendering
  - [x] 5.4 Add file upload with compression
  - [x] 5.5 Implement streaming responses
- [x] 6. Integrate AI API
  - [x] 6.1 Create Gemini API service
  - [x] 6.2 Implement EventSource for streaming
  - [x] 6.3 Handle multimodal inputs (text + images)
- [x] 7. Add chat management features
  - [x] 7.1 Create new chat
  - [x] 7.2 Edit chat title
  - [x] 7.3 Delete chat
  - [x] 7.4 Copy message
  - [x] 7.5 Regenerate response
- [x] 8. Implement theme toggle
- [x] 9. Test and validate
  - [x] 9.1 Run lint
  - [x] 9.2 Test all features
- [x] 10. Final review and cleanup

## Notes
- Using Gemini 2.5 Flash API for AI responses
- Supabase for auth, database, and file storage
- Purple-blue gradient color scheme (#6366f1 to #8b5cf6)
- Desktop-first responsive design
- First user becomes admin automatically
- All features implemented and lint passed successfully!
