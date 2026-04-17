# IoT4ALL ISSATM - Complete Documentation

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [Getting Started](#getting-started)
3. [Authentication & Accounts](#authentication--accounts)
4. [Members Directory](#members-directory)
5. [Projects Management](#projects-management)
6. [Meeting Room & Communication](#meeting-room--communication)
7. [Recruitment System](#recruitment-system)
8. [Technical Architecture](#technical-architecture)
9. [Features & Capabilities](#features--capabilities)
10. [User Guide](#user-guide)
11. [Troubleshooting](#troubleshooting)
12. [Support](#support)

---

## Platform Overview

**IoT4ALL ISSATM** is a comprehensive collaborative platform designed for the Internet of Things community at ISSATM. It provides a centralized hub for members to connect, collaborate on projects, share knowledge, and participate in recruitment activities.

### Core Features

- ✅ Real-time messaging and video/voice communication
- ✅ Project management and collaboration tools
- ✅ Member directory and networking
- ✅ Automated recruitment system
- ✅ Multi-channel discussion forums
- ✅ WebRTC-based video conferencing
- ✅ Admin dashboard and user management
- ✅ Role-based access control

---

## Getting Started

### System Requirements

- **Browser:** Chrome 60+, Firefox 55+, Safari 11+, or Edge 79+
- **Internet:** Stable connection (minimum 2 Mbps)
- **Hardware:** Webcam and microphone for video/voice calls (optional but recommended)
- **JavaScript:** Must be enabled in your browser

### Accessing the Platform

1. Navigate to `http://localhost:3000` in your web browser
2. You'll see the IoT4ALL homepage with login and registration options
3. Sign in with your credentials or apply to join

### Initial Setup

On first visit, you'll see:
- **Navigation Bar:** Links to all main sections
- **Home Page:** Welcome screen with platform overview
- **Sign In Button:** For existing members
- **Apply Now Button:** For new applicants

---

## Authentication & Accounts

### Creating an Account

#### Application Process (New Members)

1. Click **"Apply Now"** button on the homepage
2. Fill out the registration form with:
   - **Full Name:** Your complete name
   - **Email:** Valid email address
   - **Field of Study:** Select your specialization (Computer Science, Embedded Systems, AI/ML, Networking, etc.)
   - **Skills:** List relevant skills (comma-separated, e.g., "Python, Arduino, IoT, Web Dev")
   - **Motivation:** Explain why you want to join IoT4ALL
3. Submit the application
4. Wait for admin review and approval
5. Receive email notification when account is created
6. Sign in with your email and temporary password

#### Signing In

1. Click **"Sign In"** button
2. Enter your email address
3. Enter your password
4. Click **"Sign In"**
5. You'll be redirected to the home page

### Account Types & Roles

| Role | Permissions | Capabilities |
|------|------------|--------------|
| **Member** | Basic user | View projects, participate in chat, join video calls |
| **Supervisor** | Project management | Create projects, manage team members |
| **Founder Member** | Leadership | Contribute to platform decisions |
| **Founder Supervisor** | Full admin access | Manage users, projects, and settings |
| **Admin** | Platform control | All permissions, system administration |

### Password & Security

- Passwords are hashed and encrypted
- Never share your login credentials
- JWT tokens expire after 7 days
- Always sign out when using shared computers

---

## Members Directory

### Accessing the Members Page

1. Click **"Members"** in the navigation bar
2. View all active IoT4ALL members
3. Click on any member to view their profile

### Member Profile Information

Each member profile displays:
- **Name & Avatar:** Profile picture and full name
- **Field of Study:** Main area of specialization
- **Skills:** List of expertise and capabilities
- **Role:** Position within IoT4ALL
- **Status:** Active/Inactive/Pending
- **Bio:** Additional information about the member
- **Active Projects:** Current projects they're involved in

### Using the Members Directory

- **Search:** Find members by name or field
- **Filter:** Filter by skills or field of study
- **Connect:** See what projects members are working on
- **Collaborate:** Identify potential team members
- **Network:** Build connections across the community

---

## Projects Management

### Accessing Projects

1. Click **"Projects"** in the navigation bar
2. Browse all active IoT initiatives
3. Click on a project to view details

### Project Information Structure

Each project includes:
- **Title & Description:** Project name and overview
- **Technology Stack:** Tools and technologies used
- **Team Members:** List of people working on the project
- **Status:** Active, Completed, or On Hold
- **Timeline:** Start date and expected completion
- **Objectives:** Key goals and deliverables
- **Documentation:** Resources and related files
- **Progress:** Current status and updates

### Project Operations

#### For Members

- **Browse Projects:** View all available projects
- **View Details:** Learn about project goals and requirements
- **Request to Join:** Express interest in participating
- **Collaborate:** Work with team members on tasks

#### For Supervisors

- **Create Project:** Start new IoT initiatives
- **Manage Team:** Add or remove members
- **Update Status:** Track progress and milestones
- **Upload Documentation:** Share files and resources
- **Monitor Progress:** Review project activities

#### For Admins

- **Full Control:** Create, edit, delete any project
- **User Management:** Assign roles and permissions
- **Resource Allocation:** Manage hardware and budget
- **Archive Projects:** Store completed projects

### Project Collaboration Workflow

1. **Create** - Project lead creates new project
2. **Define** - Set goals, timeline, and requirements
3. **Recruit** - Add team members with needed skills
4. **Execute** - Team works on tasks and objectives
5. **Monitor** - Track progress and update status
6. **Complete** - Archive and document learnings

---

## Meeting Room & Communication

### Accessing the Meeting Room

1. Click **"Meeting Room"** in the navigation bar
2. Sign in if prompted
3. Select a channel from the left sidebar

### Channels Overview

The Meeting Room has four pre-configured channels:

#### #general
- **Purpose:** Main discussion for all members
- **Usage:** General announcements, community discussions
- **Audience:** Everyone
- **Best For:** Asking questions, sharing ideas

#### #iot-projects
- **Purpose:** Technical discussions about IoT projects
- **Usage:** Project updates, technical questions, code reviews
- **Audience:** Project members and developers
- **Best For:** Technical collaboration and problem-solving

#### #announcements
- **Purpose:** Important updates and news
- **Usage:** Official announcements from leadership
- **Audience:** All members (read-mostly)
- **Best For:** Staying informed about platform updates

#### #off-topic
- **Purpose:** Casual conversations
- **Usage:** Non-technical discussions, socializing
- **Audience:** Everyone
- **Best For:** Building community, informal networking

### Chat Features

#### Sending Messages

1. Click on a channel
2. Type your message in the input field at the bottom
3. Press **Enter** to send (or click Send button)
4. Message appears instantly to all channel members

#### Message Features

- **Real-time Delivery:** Instant message delivery to all online members
- **Message History:** See past messages when you join a channel
- **Timestamps:** Each message shows when it was sent
- **User Information:** See who sent each message
- **Member Presence:** Visual indicator shows who's online

#### Communication Best Practices

- ✅ Use appropriate channels for your topic
- ✅ Keep messages respectful and professional
- ✅ Avoid spam or duplicate messages
- ✅ Use @mentions for important messages
- ✅ Search history before asking questions
- ❌ Don't share passwords or sensitive data
- ❌ Avoid excessive emojis or caps
- ❌ Don't ping entire channels unnecessarily

### Video & Voice Calling

#### Starting a Video Call

1. Go to the desired channel in Meeting Room
2. Click the **Video Camera icon** 📹 in the channel header (top right)
3. Allow browser permission for camera and microphone
4. Wait for participants to accept your call

#### Receiving an Incoming Call

1. You'll see an **"Incoming Call"** notification popup
2. Shows who is calling you
3. Click **"Accept"** to join the call
4. Click **"Decline"** to reject

#### During a Video Call

**Video Display:**
- Your video appears on one side (smaller)
- Caller's video appears on the other side (larger)
- Both videos show name labels

**Call Controls (at bottom):**

| Button | Function | Icon |
|--------|----------|------|
| Mic Toggle | Mute/Unmute microphone | 🎤 / 🔇 |
| Video Toggle | Turn camera on/off | 📹 / ❌ |
| Hang Up | End the call | ☎️ (Red) |

#### Ending a Video Call

1. Click the **RED HANG UP BUTTON** (phone icon)
2. Connection closes immediately
3. Both participants are disconnected
4. You return to the chat

#### Call Quality & Troubleshooting

**For Best Quality:**
- Use wired internet when possible
- Close unnecessary applications
- Ensure good lighting for video
- Position camera at eye level
- Minimize background noise

**If You Can't See Video:**
- Check camera permissions in browser settings
- Restart your browser
- Ensure other apps aren't using the camera
- Try a different browser

**If Audio Isn't Working:**
- Check microphone is not muted (system level)
- Check browser microphone permissions
- Test microphone in system settings
- Try a different microphone

### Technical Details

**Technology Used:**
- **Protocol:** WebRTC (peer-to-peer)
- **Encryption:** DTLS-SRTP (encrypted connection)
- **Codec:** VP8/VP9 for video, Opus for audio
- **STUN Servers:** Google STUN for NAT traversal
- **Bandwidth:** 1-4 Mbps for HD video

**Privacy & Security:**
- Direct peer-to-peer connection (encrypted)
- Server doesn't store video or audio
- No third-party involvement
- Secure signaling via Socket.IO

---

## Recruitment System

### Applying to IoT4ALL

#### Step-by-Step Application

1. Click **"Apply Now"** button on homepage
2. Click on **"Recruitment"** in navigation (if already signed in)
3. Fill out the application form:

   | Field | Required | Tips |
   |-------|----------|------|
   | Full Name | Yes | Use your legal name |
   | Email | Yes | Use active email you check regularly |
   | Field of Study | Yes | Select your primary specialization |
   | Skills | Optional | List relevant technical skills |
   | Motivation | Yes | Write 2-3 sentences about your interests |

4. Review your information
5. Click **"Submit Application"**
6. See confirmation message

#### After Submission

- Your application enters the **pending** state
- Admins review your information
- You receive an email when approved or rejected
- Once approved, an account is created automatically
- Sign in with provided credentials

### Application Status

**Pending**
- Application submitted
- Under admin review
- Check email for updates

**Approved**
- Application accepted
- Account created successfully
- Credentials sent via email
- Can now sign in and access platform

**Rejected**
- Application not accepted
- May apply again in the future
- Check email for feedback

### Member Information Used

Your application data is used for:
- Creating your user account
- Determining skill-based team assignments
- Building the member directory
- Matching you with relevant projects

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────┐
│         Browser Client (Frontend)           │
│  Next.js 16 + TypeScript + React 19         │
│  - Pages: Home, Login, Members, Projects    │
│  - Components: Navbar, Chat, Video          │
│  - State: Auth Context, User Data           │
└────────────────┬────────────────────────────┘
                 │ HTTPS/WebSocket
┌────────────────▼────────────────────────────┐
│      Node.js API Server (Backend)           │
│  Express.js + Socket.IO                     │
│  - REST API: /api/auth, /api/members, etc   │
│  - Real-time: Socket.IO for messaging       │
│  - WebRTC Signaling: Call setup & ICE       │
└────────────────┬────────────────────────────┘
                 │ MongoDB Driver
┌────────────────▼────────────────────────────┐
│       MongoDB Database                      │
│  Collections: users, projects, messages     │
│  - Stores profiles, projects, chat history  │
└─────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- `Next.js 16.2.3` - React meta-framework
- `React 19.2.4` - UI library
- `TypeScript` - Type safety
- `Tailwind CSS` - Styling
- `Socket.IO Client` - Real-time communication
- `Lucide React` - Icons

**Backend:**
- `Node.js` - JavaScript runtime
- `Express.js` - Web framework
- `Socket.IO` - WebSocket layer
- `MongoDB` - NoSQL database
- `Mongoose` - Database ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT auth
- `CORS` - Cross-origin support

**Communication:**
- `WebRTC` - Peer-to-peer video/audio
- `Socket.IO` - Text messaging & call signaling
- `STUN Servers` - NAT traversal (Google public STUN)

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Member|Supervisor|Admin),
  field: String (CS|Embedded|AI|etc),
  skills: [String],
  status: String (Active|Inactive|Pending),
  avatar: String (URL),
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Projects Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  lead: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  status: String (Active|Completed|OnHold),
  technology: [String],
  startDate: Date,
  endDate: Date,
  objectives: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Messages Collection
```javascript
{
  _id: ObjectId,
  channel: String,
  user: ObjectId (ref: User),
  content: String,
  createdAt: Date
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Sign in user
- `GET /api/auth/me` - Get current user

#### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member details

#### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Messages
- `GET /api/messages/:channel` - Get channel history

#### Recruitment
- `POST /api/recruitment` - Submit application

### Security Architecture

**Authentication Flow:**
1. User provides email/password
2. Backend hashes password with bcrypt
3. Compares with stored hash
4. Generates JWT token (valid 7 days)
5. Token sent to frontend
6. Token included in subsequent requests
7. Backend validates token on protected routes

**Encryption:**
- Passwords: bcrypt hashing (10 rounds)
- Data in transit: HTTPS/TLS
- WebRTC calls: DTLS-SRTP encryption
- JWT: Signed with secret key

**Access Control:**
- Role-based permissions (RBAC)
- Middleware checks user role
- Routes protected by auth middleware
- Admin-only operations verified server-side

---

## Features & Capabilities

### For Members

✅ **Community Access**
- View all members and their profiles
- Browse active projects
- Access meeting rooms and channels
- Participate in discussions

✅ **Communication**
- Send messages in channels
- Video/voice calls with other members
- Real-time notifications
- Message history access

✅ **Project Participation**
- Browse available projects
- Request to join projects
- Collaborate with team members
- View project documentation

✅ **Personal Profile**
- Set profile picture
- Add bio and skills
- Update field of study
- View your project history

### For Supervisors

✅ **Everything in Member level**

✅ **Project Management**
- Create new projects
- Edit project details
- Add/remove team members
- Define project goals and timeline
- Upload documentation

✅ **Team Leadership**
- Assign project roles
- Monitor team progress
- Communicate with team
- Approve member requests

### For Admins

✅ **Everything in Supervisor level**

✅ **User Management**
- Approve/reject applications
- Create user accounts
- Modify user roles
- Deactivate users
- View user activity logs

✅ **Platform Control**
- Create channels
- Manage permissions
- View system status
- Monitor all activities
- Manage database

---

## User Guide

### First-Time User Checklist

- [ ] Create account via "Apply Now" or sign in if approved
- [ ] Complete your profile (add avatar, bio, skills)
- [ ] Explore Members directory
- [ ] Browse active projects
- [ ] Join the #general channel
- [ ] Send first message
- [ ] Test video call feature
- [ ] Read Documentation page

### Daily Tasks

**For Members:**
1. Check Meeting Room for updates
2. Review assigned projects
3. Communicate with team members
4. Update project progress
5. Participate in discussions

**For Supervisors:**
1. Review pending member requests
2. Update project status
3. Monitor team activities
4. Approve member changes
5. Plan upcoming meetings

**For Admins:**
1. Review system status
2. Process applications
3. Manage user accounts
4. Monitor platform security
5. Perform backups

### Best Practices

#### For Effective Communication

1. **Use the Right Channel**
   - #general - General topics
   - #iot-projects - Technical discussions
   - #announcements - Official updates
   - #off-topic - Non-technical chat

2. **Be Clear and Concise**
   - Write clear subject lines
   - Use proper grammar
   - Avoid all-caps text
   - Include relevant details

3. **Respect Others**
   - Be professional and courteous
   - Avoid offensive language
   - Don't spam or flood chat
   - Respect different time zones

#### For Successful Projects

1. **Planning**
   - Define clear objectives
   - Set realistic timelines
   - Identify required skills
   - Document requirements

2. **Execution**
   - Assign clear responsibilities
   - Regular progress updates
   - Team communication
   - Risk management

3. **Completion**
   - Document learnings
   - Celebrate achievements
   - Archive properly
   - Share knowledge

#### For Networking

1. **Profile Optimization**
   - Use professional photo
   - Write compelling bio
   - List accurate skills
   - Show your interests

2. **Active Participation**
   - Join relevant projects
   - Contribute to discussions
   - Help other members
   - Attend meetings

3. **Building Relationships**
   - Connect with peers
   - Find mentors
   - Share expertise
   - Collaborate frequently

---

## Troubleshooting

### Account & Login Issues

**"Invalid credentials" error**
- Check email spelling
- Verify CAPS LOCK is off
- Ensure password is correct
- Try resetting password (email support)

**"Account not approved yet"**
- Application is still pending
- Check email for approval notification
- Wait for admin review
- Contact admin if delayed

**Can't sign in after approval**
- Clear browser cache
- Try incognito/private mode
- Use different browser
- Check internet connection

### Chat & Messaging Issues

**Messages not sending**
- Check internet connection
- Verify you're in a channel
- Refresh the page
- Check browser console for errors

**Not seeing messages from others**
- Refresh the page
- Scroll up to see history
- Check if you're in the correct channel
- Verify Socket.IO connection (green dot)

**Connection indicator shows "Connecting"**
- Wait 5-10 seconds
- Check internet speed
- Disable VPN if using one
- Try different network

### Video/Voice Call Issues

**Camera/Microphone not working**
- Check browser permissions (top right icon)
- Ensure other apps aren't using devices
- Restart browser
- Check system device settings
- Try different browser

**No video/audio from other person**
- Verify they have camera/mic enabled
- Check their connection quality
- Ask them if they can see/hear you
- Try ending and restarting call

**Call drops or disconnects**
- Check internet connection strength
- Close other bandwidth-using apps
- Move closer to WiFi router
- Try using wired connection

**Echo or feedback during call**
- Check if speaker/headphone volume is too loud
- Move microphone away from speaker
- Use headphones/earbuds instead
- Ensure only one person is speaking

### Performance Issues

**Site is slow or laggy**
- Check internet speed
- Close unused browser tabs
- Disable browser extensions
- Clear browser cache
- Try different browser

**Video is pixelated or blurry**
- Improve internet connection
- Reduce video resolution (if option available)
- Reduce background lighting
- Close other applications

**Messages are delayed**
- Check internet connection
- Reduce network load
- Refresh page
- Try different network (WiFi vs cellular)

### General Troubleshooting Steps

1. **Check Internet Connection**
   - Open speedtest.net
   - Verify minimum 2 Mbps
   - Try reconnecting to WiFi

2. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "All time"
   - Check cache and cookies
   - Click Clear

3. **Try Incognito/Private Mode**
   - Open new incognito window
   - Navigate to site
   - Test if issue persists
   - If works, clear regular cache

4. **Update Browser**
   - Check for browser updates
   - Install latest version
   - Restart browser and retry

5. **Try Different Browser**
   - Chrome, Firefox, Safari, or Edge
   - Test if issue is browser-specific
   - Report if specific browser affected

6. **Disable Extensions**
   - Turn off all browser extensions
   - Test functionality
   - Re-enable one by one to find culprit

### When to Contact Support

Contact admins if you experience:
- Persistent login failures
- Unable to join any channels
- All videos/calls fail
- Data loss or corruption
- Unusual errors or crashes
- Security concerns

---

## Support

### Getting Help

**For General Questions:**
- Ask in #general channel
- Check documentation first
- Search past messages

**For Technical Issues:**
- Describe the problem in detail
- Note your browser and OS
- Provide error messages
- Include time issue occurred

**For Account Issues:**
- Email iot4all@issatm.tn
- Include your email address
- Describe the issue
- Mention when it started

**For Security Concerns:**
- Contact admin immediately
- Don't share details publicly
- Report suspicious activity
- Avoid discussing in chat

### Documentation Resources

- **This Guide:** Complete platform documentation
- **In-App Docs:** Accessible from "Documentation" link
- **Video Tutorials:** Available in announcements channel
- **FAQ:** Common questions and answers

### Feedback & Feature Requests

We welcome your feedback!

- Suggest improvements in #general
- Request new features via admin
- Share ideas for projects
- Help us improve the platform

### Reporting Bugs

If you find a bug:
1. Note exact steps to reproduce
2. Screenshot or screen recording
3. Describe expected vs actual behavior
4. Report to admin/supervisor
5. Include any error messages

---

## Version Information

- **Platform Version:** 1.0.0
- **Last Updated:** April 2026
- **Frontend Framework:** Next.js 16.2.3
- **Backend Framework:** Express.js
- **Database:** MongoDB

---

## License & Attribution

**IoT4ALL ISSATM** - All Rights Reserved © 2024

This platform is maintained by the IoT4ALL community at ISSATM.

---

## FAQ

### General

**Q: How much does it cost to use IoT4ALL?**
A: IoT4ALL is free for all ISSATM members.

**Q: Can I use IoT4ALL on mobile?**
A: Yes, it works on mobile browsers, though some features work best on desktop.

**Q: Who owns my project data?**
A: You retain ownership. Data is stored securely on our servers.

**Q: Can I export my data?**
A: Contact an admin for data export requests.

### Accounts

**Q: Can I have multiple accounts?**
A: No, one account per person to maintain community integrity.

**Q: How do I reset my password?**
A: Click "Forgot Password" on login page or contact admin.

**Q: Can I change my email?**
A: Contact an admin to update your email address.

### Projects

**Q: How do I create a project?**
A: Only Supervisors and Admins can create projects. Submit a request to admin.

**Q: Can I work on multiple projects?**
A: Yes, join as many projects as you have time for.

**Q: How do I leave a project?**
A: Contact project lead or admin to remove yourself.

### Communication

**Q: Can I make calls outside the platform?**
A: Calls only work within the IoT4ALL platform using our system.

**Q: Why does my call keep dropping?**
A: Check your internet connection. Try wired connection if possible.

**Q: Are my calls private?**
A: Yes, calls are encrypted peer-to-peer. Server doesn't record them.

### Help & Support

**Q: Where can I get more help?**
A: Post in #general or contact an admin directly.

**Q: How are bugs reported?**
A: Report bugs to admins with reproduction steps.

**Q: Can I request new features?**
A: Yes, suggest in #general channel or directly to admin.

---

## Contact & Support Information

**Platform Administrator:** [Admin Contact Info]

**Email:** iot4all@issatm.tn (when available)

**Support Channel:** #general in Meeting Room

**Headquarters:** ISSATM, Tunisia

---

**Thank you for being part of the IoT4ALL community! Happy collaborating! 🚀**
