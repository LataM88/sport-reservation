import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './sections/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './sections/auth/Register';
import Login from './sections/auth/Login';
import ForgotPassword from './sections/auth/ForgotPassword';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import RootLayout from './components/AuthLayout/RootLayout';
import MainDashboard from './sections/client/MainDashboard';
import MyBookings from './sections/client/MyBookings';
import Profile from './sections/client/Profile/Profile';
import AiReservations from './sections/client/Ai/AiReservations';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/dashboard',
        element: <MainDashboard />,
      },
      {
        path: '/my-bookings',
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/ai-reservations',
        element: (
          <ProtectedRoute>
            <AiReservations />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
