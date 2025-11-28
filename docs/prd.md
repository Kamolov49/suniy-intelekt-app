# Zento AI System Requirements Document

## 1. Project Overview

### 1.1 Application Name
Zento AI

### 1.2 Application Description
A medium-level Artificial Intelligence system that functions as an intelligent assistant capable of natural conversation, multi-language understanding, code assistance, image/file analysis, with a modern ChatGPT-like interface.

### 1.3 Core Objectives
- Provide natural chat interactions with users
- Support automatic detection and understanding of multiple languages (Uzbek, English, Russian, etc.)
- Offer comprehensive coding assistance capabilities
- Deliver logical, accurate responses without hallucinations
- Enable image and file upload with analysis
- Ensure fast and stable performance
- Present a modern, user-friendly interface\n
## 2. Functional Requirements

### 2.1 AI Core Capabilities

#### 2.1.1 Multi-language Support
- Automatic language detection\n- Support for Uzbek, English, Russian, and other major languages
- Natural language understanding and generation

#### 2.1.2 Coding Assistant Features
- Bug detection and fixing
- Code generation based on requirements
- Code explanation and documentation\n- Project structure creation and recommendations

#### 2.1.3 Chat Modes
- Normal chatbot conversation mode
- Thinking mode with internal reasoning (hidden from user)
- Context-aware responses
\n#### 2.1.4 File Processing
- Image upload and analysis
- File upload and understanding
- Multi-format support\n
#### 2.1.5 Response Quality
- Clean and accurate answers
- Non-hallucinating responses
- Logical reasoning\n- Fast response generation

### 2.2 Chat System Features

#### 2.2.1 Chat Interface
- Full-featured chat interface
- Message input area with multi-line support
- Message display area with proper formatting
- Code syntax highlighting in responses
\n#### 2.2.2 Chat Management
- Saved chat history per user
- Editable chat titles
- New chat creation button
- Chat list in sidebar
- Chat deletion functionality

#### 2.2.3 Interactive Features
- Typing animation indicator
- Streaming AI responses (real-time token display)
- Auto-scroll to latest message
- Message copy functionality
- Regenerate response option

#### 2.2.4 Theme Support
- Light mode\n- Dark mode
- Theme toggle switch
\n### 2.3 Authentication System

#### 2.3.1 Login Methods
- Google OAuth\n- Apple Sign-In
- Microsoft Account
- Phone number with SMS verification
- Email and password

#### 2.3.2 User Management\n- Individual user accounts
- User profile management
- Personal chat history storage
- Session management
- Secure token-based authentication

### 2.4 User Interface Components

#### 2.4.1 Layout Structure
- Sidebar with chat list
- Main chat area\n- Top navigation bar
- Model selection dropdown
- User profile menu
\n#### 2.4.2Responsive Design
- Mobile phone optimization
- Tablet adaptation
- Desktop full-screen layout
- Collapsible sidebar for mobile

## 3. Technical Architecture
\n### 3.1 Technology Stack

#### 3.1.1 Frontend
- Framework: React or Next.js
- State Management: Context API or Redux
- Styling: Tailwind CSS or styled-components
- HTTP Client: Axios or Fetch API

#### 3.1.2 Backend
- Server: Node.js with Express OR Python FastAPI
- API Architecture: RESTful\n- Real-time: WebSocket or Server-Sent Events for streaming
\n#### 3.1.3 Database
- Primary Database: PostgreSQL or MongoDB
- Schema: Users, Chats, Messages, Files
\n#### 3.1.4 Authentication
- Method: JWT tokens OR Clerk/Auth0
- OAuth integration for social logins
- SMS service integration for phone verification

#### 3.1.5 AI Engine
- API Provider: OpenAI API or Groq API
- Model selection capability
- Streaming response support
\n### 3.2 Database Schema

#### 3.2.1 Users Table\n- user_id (primary key)
- email
- phone_number
- auth_provider
- profile_data
- created_at
- updated_at

#### 3.2.2 Chats Table
- chat_id (primary key)
- user_id (foreign key)
- title
- created_at
- updated_at
\n#### 3.2.3 Messages Table
- message_id (primary key)
- chat_id (foreign key)
- role (user/assistant)
- content
- timestamp
\n#### 3.2.4 Files Table
- file_id (primary key)
- user_id (foreign key)
- message_id (foreign key)
- file_path
- file_type
- uploaded_at

### 3.3 API Routes

#### 3.3.1 Authentication Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/google
- POST /api/auth/apple
- POST /api/auth/microsoft
- POST /api/auth/phone
- POST /api/auth/verify-sms
\n#### 3.3.2 Chat Endpoints
- GET /api/chats (get user's chat list)
- POST /api/chats (create new chat)
- GET /api/chats/:id (get specific chat)
- PUT /api/chats/:id (update chat title)
- DELETE /api/chats/:id (delete chat)
\n#### 3.3.3 Message Endpoints
- GET /api/chats/:id/messages (get chat messages)
- POST /api/chats/:id/messages (send message)
- POST /api/chats/:id/stream (streaming response)

#### 3.3.4 File Endpoints
- POST /api/files/upload (upload file)
- GET /api/files/:id (get file)\n- DELETE /api/files/:id (delete file)

#### 3.3.5 User Endpoints
- GET /api/user/profile (get user profile)
- PUT /api/user/profile (update profile)
\n## 4. Design Specifications

### 4.1 Visual Style
- Modern and clean aesthetic inspired by ChatGPT 5
- Smooth animations and transitions
- Rounded corners on all interactive elements
- Gradient accents using purple and blue tones
- Ample white space for readability
\n### 4.2 Color Scheme
- Primary: Purple-blue gradient (#6366f1 to #8b5cf6)\n- Background Light: #ffffff and #f9fafb
- Background Dark: #1a1a1a and #2d2d2d
- Text Light: #111827\n- Text Dark: #f9fafb
- Accent: #8b5cf6

### 4.3 Typography\n- Font Family: Inter or SF Pro Display
- Heading sizes: 24px, 20px, 18px
- Body text: 14px to 16px
- Code font: Fira Code or JetBrains Mono

### 4.4 Component Styling
- Border radius: 12px for cards, 8px for buttons
- Shadow: Subtle elevation with soft shadows
- Hover effects: Scale and color transitions
- Button style: Filled primary, outlined secondary
- Input fields: Bordered with focus state highlighting

### 4.5 Animation Details
- Page transitions:200-300ms ease-in-out
- Typing indicator: Pulsing dots animation
- Message appearance: Fade-in with slight slide\n- Sidebar toggle: Smooth slide transition
- Theme switch: Fade transition between modes

## 5. Deliverables

### 5.1 Code Structure
1. Complete project folder with organized structure
2. Frontend application code
3. Backend server code
4. Database schema and migration files
5. API route implementations
6. Authentication system setup
7. All UI pages and components
\n### 5.2 Documentation
8. Installation and setup guide
9. Example .env configuration files
10. API documentation
\n### 5.3 Features Implementation
11. File upload system with storage
12. Streaming response endpoint
13. WebSocket or SSE implementation
\n### 5.4 Code Quality Standards
- Clean and readable code
- Optimized performance
- Bug-free implementation
- Professional coding standards
- Production-ready deployment configuration
- Proper error handling
- Security best practices
- Code comments and documentation

## 6. Additional Requirements

### 6.1 Performance\n- Fast initial load time
- Optimized API response times
- Efficient database queries
- Lazy loading for chat history

### 6.2 Security
- Secure authentication flow
- Encrypted password storage
- Protected API endpoints
- Input validation and sanitization
- CORS configuration
- Rate limiting

### 6.3 Scalability
- Modular code architecture
- Stateless backend design
- Database indexing
- Caching strategy for frequent queries