import { Container, Spinner, Center } from '@chakra-ui/react' // Import Spinner and Center for loading state
import { Navigate, Route, Routes, useLocation } from 'react-router-dom' // Import useLocation
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import { useRecoilValue, useSetRecoilState } from 'recoil' // Import useSetRecoilState
import userAtom from './atoms/userAtom'
import UpdateProfilePage from './pages/UpdateProfilePage'
import CreatePost from './components/CreatePost'
import { useEffect, useState } from 'react' // Import useEffect, useState
import useShowToast from './hooks/useShowToast' // Import useShowToast

function App() {
  const user = useRecoilValue(userAtom) // Read the user state
  const setUser = useSetRecoilState(userAtom) // Get the setter function
  const showToast = useShowToast()
  const [loadingAuth, setLoadingAuth] = useState(true) // State to track initial auth check

  // Get current location to potentially clear query params later
  const location = useLocation()

  // Effect to check authentication status on load/reload
  // In your App.js - update the checkAuth function

  useEffect(() => {
    const checkAuth = async () => {
      setLoadingAuth(true) // Start loading indicator
      try {
        // Update this to use the full URL to your Vercel backend
        const res = await fetch(
          'https://dhaage-backend.vercel.app/api/users/me',
          {
            method: 'GET',
            credentials: 'include', // CRITICAL for cross-domain cookies
            headers: {
              'Content-Type': 'application/json',
              // You may need to add other headers here
            },
          }
        )

        if (res.ok) {
          const data = await res.json()
          console.log('User data:', data)
          setUser(data)
          localStorage.setItem('user-threads', JSON.stringify(data))
        } else if (res.status === 401) {
          setUser(null)
          localStorage.removeItem('user-threads')
        } else {
          const errorText = await res.text()
          console.error(
            'Error checking authentication:',
            `Status ${res.status}`,
            errorText || '(No error body)'
          )
          setUser(null)
          localStorage.removeItem('user-threads')
        }
      } catch (error) {
        console.error('Network error during auth check:', error)
        setUser(null)
        localStorage.removeItem('user-threads')
      } finally {
        setLoadingAuth(false)
      }
    }

    checkAuth()
  }, [setUser])

  // Effect to check for login errors passed in URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const error = urlParams.get('error')
    if (error) {
      // Map common errors to user-friendly messages
      let message = `Login failed: ${error.replace(/_/g, ' ')}`
      if (error === 'google_auth_failed') {
        message = 'Authentication with Google failed. Please try again.'
      } else if (error === 'google_user_not_found') {
        message = 'Could not retrieve user information from Google.'
      } else if (error === 'google_login_failed') {
        message = 'Failed to log you in after Google authentication.'
      } else if (error === 'server_error') {
        message =
          'A server error occurred during login. Please try again later.'
      }

      showToast('Login Error', message, 'error')
      // Clean the URL (optional but recommended for better UX)
      window.history.replaceState({}, document.title, location.pathname)
    }
    // Run when location.search changes (new query params) or showToast becomes available
  }, [location.search, showToast])

  // Show loading indicator while checking auth initially
  if (loadingAuth) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  // --- Render Routes once auth check is complete ---
  return (
    // Using a Box or Flex instead of Container might be better if Container adds unwanted padding
    // <Box maxW="620px" mx="auto">
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to={'/'} />}
        />
        <Route
          path="/update"
          element={user ? <UpdateProfilePage /> : <Navigate to={'/auth'} />}
        />
        {/* Keep existing user/post routes */}
        {/* It's often better to handle "not found" or "permission denied" *inside* these page components */}
        <Route
          path="/:username"
          element={user ? <UserPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/:username/post/:pid"
          element={user ? <PostPage /> : <Navigate to="/auth" />}
        />

        {/* Optional: Catch-all for undefined routes */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>

      {user && <CreatePost />}
    </Container>
    // </Box>
  )
}

export default App
