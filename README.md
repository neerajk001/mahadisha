# MAHA-DISHA - Digital Integrated System for Holistic Administration

A modern web application built with React, Ionic, and TypeScript for managing government schemes and services seamlessly.

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional interface with intuitive navigation
- **Authentication System**: Secure login, signup, and password recovery
- **Scheme Management**: Browse and manage government schemes
- **Profile Management**: User profile creation with Aadhaar verification
- **Cross-Platform**: Built with Ionic for potential mobile app conversion

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **UI Framework**: Ionic Framework
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Icons**: Ionicons
- **Routing**: React Router DOM
- **Mobile Ready**: Capacitor integration ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd mahadisha_app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
ionic serve
```

**Note**: 
- `npm run dev` or `yarn dev` will open at `http://localhost:5173` (Vite)
- `ionic serve` will open at `http://localhost:8100` (Ionic)

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
mahadisha_app/
├── public/                 # Static assets
│   ├── mahadisha.png      # Main logo
│   ├── forget.png         # Forgot password image
│   └── logo.png           # Header logo
├── src/
│   ├── components/        # Reusable components
│   │   ├── header/        # Header component
│   │   ├── hero/          # Hero section
│   │   ├── aboutSection/  # About section
│   │   ├── scheme/        # Scheme categories
│   │   ├── contact/       # Contact information
│   │   ├── Statistics/    # Statistics component
│   │   └── CallToAction/  # Call to action
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Home page
│   │   ├── Login.tsx      # Login page
│   │   ├── Signup.tsx     # Signup page
│   │   └── ForgotPassword.tsx # Forgot password page
│   ├── theme/             # Global styles and variables
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🎨 Key Components

### Header Component
- Responsive navigation with mobile menu
- Logo display
- Navigation links (About, Schemes, Signup, Login)

### Home Page
- Hero section with call-to-action
- About section explaining MAHA-DISHA
- Scheme categories display
- Contact information panels
- Statistics and call-to-action sections

### Authentication Pages
- **Login**: Split layout with logo and form
- **Signup**: Comprehensive registration with Aadhaar validation
- **Forgot Password**: Password recovery with Aadhaar verification

### Scheme Categories
- Direct Finance Scheme
- Margin Money Scheme
- Subsidy Scheme
- State Schemes button

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=MAHA-DISHA
VITE_APP_API_URL=your_api_url_here
```

### Build Configuration
The project uses Vite for building. Configuration can be found in `vite.config.ts`.

## 📱 Mobile Development

This project is built with Ionic, making it ready for mobile app development:

### Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

### Add Platforms
```bash
npx cap add android
npx cap add ios
```

### Build and Sync
```bash
npm run build
npx cap sync
npx cap open android  # Opens Android Studio
npx cap open ios      # Opens Xcode (macOS only)
```

## 🧪 Testing

### Run Tests
```bash
npm run test
# or
yarn test
```

### E2E Testing with Cypress
```bash
npm run cypress:open
# or
yarn cypress:open
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run cypress:open` - Open Cypress test runner

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For any questions or support, please contact:
- **Email**: info@mpbcdc.in
- **Phone**: (022) 26200351
- **Address**: Mahatma Phule Backward Class Development Corporation, Mumbai

## 🙏 Acknowledgments

- MAHA-DISHA team for the vision
- Ionic Framework for the robust UI components
- React community for the excellent ecosystem
- All contributors who helped build this application

---

**MAHA-DISHA** - Empowering citizens through digital governance and accessible government services.
