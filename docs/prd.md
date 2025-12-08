# Zento AI System Requirements Document (Updated)

## 1. Project Overview

### 1.1 Application Name\nZento AI

### 1.2 Application Description
A medium-level Artificial Intelligence system that functions as an intelligent assistant capable of natural conversation, multi-language understanding, code assistance, image/file analysis, with a modern ChatGPT-like interface.

### 1.3 Core Objectives
- Provide natural chat interactions with users
- Support automatic detection and understanding of multiple languages (Uzbek, English, Russian, etc.)
- Offer comprehensive coding assistance capabilities
- Deliver logical, accurate responses without hallucinations\n- Enable image and file upload with analysis
- Ensure fast and stable performance
- Present a modern, user-friendly interface
- Provide comprehensive user account management
- Enable efficient chat history management

## 2. Functional Requirements

### 2.1 AI Core Capabilities

#### 2.1.1 Multi-language Support
- Automatic language detection
- Support for Uzbek, English, Russian, and other major languages
- Natural language understanding and generation

#### 2.1.2 Coding Assistant Features
- Bug detection and fixing
- Code generation based on requirements
- Code explanation and documentation
- Project structure creation and recommendations

#### 2.1.3 Chat Modes\n- Normal chatbot conversation mode\n- Thinking mode with internal reasoning (hidden from user)
- Context-aware responses

#### 2.1.4 File Processing
- Image upload and analysis
- File upload and understanding\n- Multi-format support

#### 2.1.5 Response Quality
- Clean and accurate answers
- Non-hallucinating responses
- Logical reasoning
- Fast response generation

### 2.2 Chat System Features
\n#### 2.2.1 Chat Interface
- Full-featured chat interface
- Message input area with multi-line support
- Message display area with proper formatting\n- Code syntax highlighting in responses\n- Sticky input bar at bottom
- Scrollable long code blocks
- Message fade-in animation
- Improved spacing between messages

#### 2.2.2 Chat Management
- Saved chat history per user\n- Editable chat titles\n- New chat creation button
- Chat list in sidebar
- Delete individual chat functionality with confirmation popup
- Clear all chats option with confirmation
- Live UI update after deletion
- Database synchronization on deletion

#### 2.2.3 Interactive Features
- Typing animation indicator
- Streaming AI responses (real-time token display)
- Smart auto-scroll to latest message:\n  * Auto-scroll to bottom on new message
  * Pause auto-scroll when user manually scrolls up
  * Resume auto-scroll when AI finishes responding
  * Smooth scrolling behavior like ChatGPT
  * Works on desktop and mobile
- Message copy functionality
- Regenerate response option

#### 2.2.4 Theme Support
- Light mode
- Dark mode
- Theme toggle switch

### 2.3 Authentication System
\n#### 2.3.1 Login Methods
- Google OAuth
- Apple Sign-In\n- Microsoft Account
- Phone number with SMS verification
- Email and password

#### 2.3.2 User Management
- Individual user accounts
- User profile management
- Personal chat history storage
- Session management
- Secure token-based authentication
- JWT refresh token system
- Logout on current device
- Logout on all devices (invalidate all refresh tokens)

### 2.4 Dashboard Page

#### 2.4.1 Dashboard Components
- User profile information display
- Avatar display with update option
- Account creation date
- Total chats count
- Edit Profile button
- Change Password button (for email login users)
- Logout button (current device)
- Logout Everywhere button (all devices)
- Clear All Chats button with confirmation
\n#### 2.4.2 Dashboard Design
- Clean and modern layout
- Similar aesthetic to ChatGPT sidebar account panel
- Organized sections with clear visual hierarchy
- Responsive design for all screen sizes
\n### 2.5 User Interface Components

#### 2.5.1 Layout Structure
- Sidebar with chat list and delete options
- Main chat area\n- Top navigation bar
- Model selection dropdown
- User profile menu
- Dashboard page\n
#### 2.5.2 Responsive Design
- Mobile phone optimization
- Tablet adaptation
- Desktop full-screen layout
- Collapsible sidebar for mobile

## 3. Technical Architecture

### 3.1 Technology Stack

#### 3.1.1 Frontend\n- Framework: React or Next.js
- State Management: Context API or Redux
- Styling: Tailwind CSS or styled-components
- HTTP Client: Axios or Fetch API
\n#### 3.1.2 Backend
- Server: Node.js with Express OR Python FastAPI
- API Architecture: RESTful
- Real-time: WebSocket or Server-Sent Events for streaming

#### 3.1.3 Database\n- Primary Database: PostgreSQL or MongoDB
- Schema: Users, Chats, Messages, Files, Sessions

#### 3.1.4 Authentication
- Method: JWT tokens with refresh token system
- OAuth integration for social logins
- SMS service integration for phone verification
- Session tracking for multi-device logout

#### 3.1.5 AI Engine
- API Provider: OpenAI API or Groq API
- Model selection capability
- Streaming response support

### 3.2 Database Schema

#### 3.2.1 Users Table
- user_id (primary key)
- email
- phone_number\n- auth_provider
- profile_data
- avatar_url
- created_at
- updated_at

#### 3.2.2 Chats Table
- chat_id (primary key)\n- user_id (foreign key)
- title
- created_at
- updated_at

#### 3.2.3 Messages Table
- message_id (primary key)\n- chat_id (foreign key)
- role (user/assistant)
- content
- timestamp

#### 3.2.4 Files Table
- file_id (primary key)\n- user_id (foreign key)
- message_id (foreign key)
- file_path\n- file_type
- uploaded_at

#### 3.2.5 Sessions Table
- session_id (primary key)
- user_id (foreign key)
- refresh_token
- device_info
- created_at
- expires_at

### 3.3 API Routes

#### 3.3.1 Authentication Endpoints\n- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/logout-all
- POST /api/auth/google
- POST /api/auth/apple
- POST /api/auth/microsoft
- POST /api/auth/phone
- POST /api/auth/verify-sms
- POST /api/auth/refresh-token

#### 3.3.2 Chat Endpoints\n- GET /api/chats (get user's chat list)
- POST /api/chats (create new chat)
- GET /api/chats/:id (get specific chat)
- PUT /api/chats/:id (update chat title)
- DELETE /api/chats/:id (delete chat)\n- DELETE /api/chats (clear all chats)
\n#### 3.3.3 Message Endpoints
- GET /api/chats/:id/messages (get chat messages)
- POST /api/chats/:id/messages (send message)
- POST /api/chats/:id/stream (streaming response)
\n#### 3.3.4 File Endpoints
- POST /api/files/upload (upload file)
- GET /api/files/:id (get file)
- DELETE /api/files/:id (delete file)

#### 3.3.5 User Endpoints
- GET /api/user/profile (get user profile)
- PUT /api/user/profile (update profile)
- PUT /api/user/avatar (update avatar)
- PUT /api/user/password (change password)
- GET /api/user/stats (get user statistics)

## 4. Design Specifications

### 4.1 Visual Style\n- Modern and clean aesthetic inspired by ChatGPT 5
- Smooth animations and transitions
- Rounded corners on all interactive elements
- Gradient accents using purple and blue tones
- Ample white space for readability
- Message fade-in animations
- Improved spacing between UI elements

### 4.2 Color Scheme
- Primary: Purple-blue gradient (#6366f1 to #8b5cf6)
- Background Light: #ffffff and #f9fafb
- Background Dark: #1a1a1a and #2d2d2d
- Text Light: #111827
- Text Dark: #f9fafb
- Accent: #8b5cf6

### 4.3 Typography
- Font Family: Inter or SF Pro Display\n- Heading sizes: 24px, 20px, 18px
- Body text: 14px to 16px
- Code font: Fira Code or JetBrains Mono

### 4.4 Component Styling
- Border radius: 12px for cards, 8px for buttons
- Shadow: Subtle elevation with soft shadows
- Hover effects: Scale and color transitions
- Button style: Filled primary, outlined secondary
- Input fields: Bordered with focus state highlighting
- Confirmation popups: Modal with backdrop blur

### 4.5 Animation Details
- Page transitions: 200-300ms ease-in-out\n- Typing indicator: Pulsing dots animation
- Message appearance: Fade-in with slight slide
- Sidebar toggle: Smooth slide transition
- Theme switch: Fade transition between modes\n- Scroll behavior: Smooth with intelligent auto-scroll logic

## 5. Deliverables

### 5.1 Updated Code Structure
1. Updated dashboard page with all required features
2. Updated sidebar with delete chat functionality
3. Fixed chat scroll logic implementation
4. Delete chat confirmation popup component
5. Clear all chats functionality
6. Logout system (single device and all devices)
7. Updated API routes for new features
8. Updated database schema with Sessions table
9. UI improvements (fade-in, spacing, sticky input, scrollable code blocks)

### 5.2 Documentation
10. Updated installation and setup guide
11. Updated API documentation\n12. Feature implementation notes
\n### 5.3 Code Quality Standards
- Clean and readable code\n- Optimized performance
- Bug-free implementation
- Professional coding standards
- Production-ready deployment configuration
- Proper error handling
- Security best practices
- Code comments and documentation

## 6. Additional Requirements

### 6.1 Performance\n- Fast initial load time
- Optimized API response times
- Efficient database queries\n- Lazy loading for chat history
- Smooth scrolling performance

### 6.2 Security
- Secure authentication flow
- Encrypted password storage
- Protected API endpoints
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Secure session management
- Refresh token rotation

### 6.3 Scalability
- Modular code architecture
- Stateless backend design
- Database indexing\n- Caching strategy for frequent queries
\n## 7. Implementation Notes

### 7.1 Preservation Requirements
- Keep existing AI logic unchanged
- Maintain current UI theme and color scheme
- Preserve all existing API routes\n- Keep current database structure (only add new fields/tables as needed)
- Do not rebuild from scratch

### 7.2 Critical Fixes
- Chat scroll bug must be completely resolved
- Auto-scroll should work during AI generation
- Manual scroll should temporarily disable auto-scroll
- Smooth scrolling like ChatGPT on all devices
\n### 7.3 New Features Priority
1. Dashboard page with full functionality
2. Chat history management (delete individual/all)
3. Fixed scroll behavior
4. UI smoothness improvements
5. Multi-device logout system