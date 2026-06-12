import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ReportRescue from './pages/ReportRescue';
import Contact from './pages/Contact';
import Campaigns from './pages/Campaigns';
import Volunteer from './pages/Volunteer';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyAdoption from './pages/ApplyAdoption';
import ReviewAdoptions from './pages/ReviewAdoptions';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

const routerObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "/new",
        element: <ReportRescue />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/campaigns",
        element: <Campaigns />
      },
      {
        path: "/volunteer",
        element: <Volunteer />
      },
      {
        path: "/blogs",
        element: <Blogs />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/apply-adoption",
        element: <ApplyAdoption />
      },
      {
        path: "/review-adoptions",
        element: <ReviewAdoptions />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routerObj} />
    </AuthProvider>
  );
}

export default App;
