# Project Management Frontend

A modern React TypeScript frontend for the Project Management application with Tailwind CSS styling.

## 🚀 Features

- **Modern React with TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework for professional styling
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **User Authentication** - Login/Register with JWT tokens
- **Project Management** - Create, view, update, and delete projects
- **Task Management** - Full CRUD operations on tasks with status tracking
- **Real-time Updates** - Optimistic UI updates
- **Professional UI** - Clean, modern interface with proper component structure

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html           # Main HTML template
│   ├── manifest.json        # PWA manifest
│   └── favicon.ico         # App icon
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── index.ts
│   │   ├── ProjectCard.tsx  # Project display component
│   │   ├── TaskCard.tsx     # Task display component
│   │   ├── StatsCards.tsx   # Dashboard statistics
│   │   ├── CreateProjectModal.tsx
│   │   └── CreateTaskModal.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── pages/
│   │   ├── LoginPage.tsx    # Login form
│   │   ├── RegisterPage.tsx # Registration form
│   │   ├── DashboardPage.tsx # Main dashboard
│   │   └── ProjectDetailsPage.tsx # Project details view
│   ├── services/
│   │   ├── api.ts           # Axios configuration
│   │   ├── authService.ts   # Authentication API calls
│   │   ├── projectService.ts # Project API calls
│   │   ├── taskService.ts   # Task API calls
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   └── helpers.ts       # Utility functions
│   ├── hooks/               # Custom React hooks (future use)
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # App entry point
│   └── index.css            # Global styles and Tailwind
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.js       # PostCSS configuration
└── .env                    # Environment variables
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎨 Styling & Design

### Tailwind CSS Configuration
- **Professional Color Palette** - Primary blues, success greens, warning yellows, danger reds
- **Custom Components** - Pre-built button, input, badge styles
- **Responsive Design** - Mobile-first approach
- **Consistent Spacing** - Standardized margins and padding

### Component Design System
```css
/* Button Variants */
.btn-primary     /* Blue primary buttons */
.btn-secondary   /* Gray secondary buttons */
.btn-success     /* Green success buttons */
.btn-danger      /* Red danger buttons */
.btn-outline     /* Outlined buttons */

/* Status Badges */
.status-active       /* Green for active projects */
.status-completed    /* Gray for completed projects */
.status-todo         /* Blue for todo tasks */
.status-in-progress  /* Yellow for in-progress tasks */
.status-done         /* Green for done tasks */

/* Priority Badges */
.priority-high    /* Red for high priority */
.priority-medium  /* Yellow for medium priority */
.priority-low     /* Gray for low priority */
```

## 🔑 Authentication

### Login Process
1. User enters email and password
2. Frontend sends credentials to backend API
3. Backend returns JWT token and user data
4. Token stored in localStorage
5. User redirected to dashboard

### Demo Credentials
```
Email: test@example.com
Password: Test@123
```

### Protected Routes
- All routes except `/login` and `/register` require authentication
- Invalid tokens automatically redirect to login
- AuthContext manages authentication state globally

## 📱 Pages & Features

### Login Page (`/login`)
- Email/password authentication
- Demo credentials display
- Form validation
- Loading states
- Error handling

### Register Page (`/register`)
- User registration form
- Password confirmation
- Client-side validation
- Automatic login after registration

### Dashboard (`/dashboard`)
- **Statistics Cards** - Overview of task counts by status
- **Recent Projects** - Quick access to projects with progress bars
- **Recent Tasks** - Task list with filtering options
- **Quick Actions** - Create new projects and tasks

### Project Details (`/projects/:id`)
- **Project Information** - Title, description, status, dates
- **Progress Tracking** - Visual progress bar and completion stats
- **Task Management** - Full CRUD operations on project tasks
- **Task Filtering** - Filter by status (all, todo, in-progress, done)

## 🔧 API Integration

### Base Configuration
```typescript
// API base URL from environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Automatic JWT token attachment
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Service Layer
- **authService** - Login, register, logout, token management
- **projectService** - Project CRUD operations
- **taskService** - Task CRUD operations and statistics

### Error Handling
- Automatic token refresh handling
- User-friendly error messages
- Network error detection
- Unauthorized access handling

## 🎯 Key Features

### Real-time Updates
- Optimistic UI updates for better user experience
- Automatic data refresh after mutations
- Loading states for all operations

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Consistent spacing across devices

### Professional UI
- Clean, modern design
- Consistent component styling
- Proper typography hierarchy
- Accessible color contrasts

### Type Safety
- Full TypeScript implementation
- Comprehensive type definitions
- Compile-time error detection
- IntelliSense support

## 🚀 Available Scripts

```bash
npm start      # Start development server (http://localhost:3000)
npm build      # Build for production
npm test       # Run tests
npm eject      # Eject from Create React App (not recommended)
```

## 📋 Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
GENERATE_SOURCEMAP=false                     # Disable source maps in production
```

## 🎨 Customization

### Colors
Update `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Your primary color palette */ },
      success: { /* Your success color palette */ },
      // ... other colors
    }
  }
}
```

### Components
All components are in `src/components/` and can be easily customized:

- **Common Components** - Reusable UI components
- **Page Components** - Complete page implementations
- **Modal Components** - Overlay components for forms

## 🔍 Testing

### Test Workflow
1. Start backend server: `npm run dev` (in backend directory)
2. Start frontend server: `npm start` (in frontend directory)
3. Navigate to http://localhost:3000
4. Use demo credentials to login
5. Test all features:
   - Create projects
   - Create tasks
   - Update task status
   - Filter tasks
   - Delete items

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Follow the existing component structure
2. Use TypeScript for all new files
3. Follow Tailwind CSS conventions
4. Add proper error handling
5. Test on different screen sizes

## 📄 License

This project is part of the Project Management application and follows the same MIT license.