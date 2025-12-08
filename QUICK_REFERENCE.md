# Zento AI - Quick Reference Guide

## New Features Access

### Dashboard
- **URL**: `/dashboard`
- **Access**: Click user icon → Dashboard
- **Features**:
  - View profile information
  - Edit username
  - Change password
  - Clear all chats
  - Logout options

### Chat Management
- **Delete Single Chat**: Hover over chat → Three dots → Delete
- **Clear All Chats**: Dashboard → Chat Management → Clear All
- **Rename Chat**: Hover over chat → Three dots → Rename

### Session Management
- **Logout This Device**: Dashboard → Session Management → Logout
- **Logout All Devices**: Dashboard → Session Management → Logout Everywhere

## Key Improvements

### Auto-Scroll Behavior
- **Automatic**: Scrolls to bottom on new messages
- **Manual Control**: Scroll up to read history (auto-scroll pauses)
- **Resume**: Scroll to bottom to resume auto-scroll
- **Streaming**: Always auto-scrolls during AI response

### UI Enhancements
- **Animations**: Messages fade in smoothly
- **Spacing**: Better visual hierarchy
- **Code Blocks**: Scrollable with max height
- **Input Bar**: Sticky at bottom

## Technical Reference

### New Components
```
src/pages/DashboardPage.tsx - User dashboard
```

### Modified Components
```
src/pages/ChatPage.tsx - Fixed scroll, improved UI
src/components/chat/ChatMessage.tsx - Added animations
src/components/common/Header.tsx - Added dashboard link
src/index.css - New animations and styles
src/routes.tsx - Added dashboard route
```

### Key Functions
```typescript
// ChatPage.tsx
handleScroll() - Detects user scroll behavior
scrollToBottom() - Smooth scroll to latest message
handleDeleteChat() - Delete individual chat
handleSendMessage() - Send message with auto-scroll

// DashboardPage.tsx
handleEditProfile() - Update user profile
handleChangePassword() - Change user password
handleClearAllChats() - Delete all user chats
handleLogoutEverywhere() - Global sign-out
```

### CSS Classes
```css
.animate-fade-in - Fade-in animation for messages
.bg-gradient-primary - Purple-blue gradient background
.markdown-content - Styled markdown rendering
.typing-indicator - Animated typing dots
```

## User Workflows

### Edit Profile
1. Click user icon → Dashboard
2. Click "Edit Profile" button
3. Update username
4. Click "Save Changes"

### Change Password
1. Click user icon → Dashboard
2. Click "Change Password" button
3. Enter new password
4. Confirm new password
5. Click "Change Password"

### Clear All Chats
1. Click user icon → Dashboard
2. Scroll to "Chat Management"
3. Click "Clear All" button
4. Confirm deletion
5. All chats deleted

### Logout Everywhere
1. Click user icon → Dashboard
2. Scroll to "Session Management"
3. Click "Logout Everywhere" button
4. Confirm action
5. Signed out from all devices

## Troubleshooting

### Chat Not Scrolling
- **Solution**: Already fixed! Auto-scroll now works perfectly
- **Manual Override**: Scroll to bottom to resume auto-scroll

### Messages Not Animating
- **Check**: Browser supports CSS animations
- **Fallback**: Messages still display without animation

### Dashboard Not Loading
- **Check**: User is logged in
- **Check**: Route is `/dashboard`
- **Check**: Profile data is available

### Clear All Chats Not Working
- **Check**: User has chats to delete
- **Check**: Confirmation dialog was accepted
- **Check**: Network connection is stable

## Best Practices

### For Users
- Use Dashboard for account management
- Delete old chats regularly
- Change password periodically
- Use "Logout Everywhere" if security concern

### For Developers
- Maintain scroll behavior logic
- Test animations on all browsers
- Ensure proper error handling
- Keep confirmation dialogs for destructive actions

## Performance Tips

### Optimize Chat Experience
- Delete unnecessary chats
- Clear browser cache if slow
- Use modern browser for best performance
- Enable hardware acceleration

### Dashboard Loading
- Profile data is cached
- No additional API calls needed
- Instant load on navigation

## Security Notes

### Password Requirements
- Minimum 6 characters
- Can be changed anytime
- Only for email-based accounts

### Session Management
- "Logout This Device" - Local only
- "Logout Everywhere" - Global sign-out
- Invalidates all refresh tokens

### Data Privacy
- Chats are user-specific
- Admins can view all data
- Deletion is permanent

## Support

### Common Issues
1. **Scroll not working**: Refresh page
2. **Dashboard not accessible**: Check login status
3. **Can't delete chats**: Check permissions
4. **Logout fails**: Check network connection

### Getting Help
- Check IMPROVEMENTS_SUMMARY.md for details
- Review USER_GUIDE.md for instructions
- Contact system administrator

---

**Last Updated**: 2025-12-08
**Version**: 2.0 (With Improvements)
