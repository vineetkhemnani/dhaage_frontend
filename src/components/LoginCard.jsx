import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Divider,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'
import { FaGoogle } from 'react-icons/fa'

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)

  // setter function
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  // works as useState with the default state set to authScreenAtom state

  //   setter function for userAtom
  const setUser = useSetRecoilState(userAtom)
  //   store the user as a global state

  // showToast custom hook
  const showToast = useShowToast()

  //  state to handle inputs
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  })

  // loading state
  const [loading, setLoading] = useState(false)

  //   login handler
  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      })
      const data = await res.json()

      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }
      console.log(data)

      //   store the data of user in localStorage
      localStorage.setItem('user-threads', JSON.stringify(data))

      // set global user state to user fetched from backend
      setUser(data)

      //   success toast
      showToast('Yayy !!', 'Logged in successfully', 'success')
    } catch (error) {
      showToast('Error', error, 'error')
    } finally {
      setLoading(false)
    }
  }
  const handleGoogleLogin = () => {
    // Construct the backend Google auth URL
    const googleAuthUrl = `${'https://threads-copy-backend.vercel.app'}/api/users/auth/google`
    // Redirect the current window to the backend endpoint
    window.location.href = googleAuthUrl
  }
  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: 'full',
            sm: '400px',
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={inputs.username}
                onChange={(e) =>
                  setInputs((inputs) => ({
                    ...inputs,
                    username: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((inputs) => ({
                      ...inputs,
                      password: e.target.value,
                    }))
                  }
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800'),
                }}
                onClick={() => handleLogin()}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Not a user?{' '}
                <Link
                  color={'blue.400'}
                  onClick={() => {
                    // onclick change the auth state to signup
                    setAuthScreen('signup')
                  }}
                >
                  Signup
                </Link>
              </Text>
            </Stack>
            <Divider />
            <Button
              size="lg"
              bg={useColorModeValue('white', 'gray.700')}
              color={useColorModeValue('gray.800', 'white')}
              border={'1px solid'}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              _hover={{
                bg: useColorModeValue('gray.50', 'gray.800'),
                color: useColorModeValue('gray.900', 'white'),
              }}
              onClick={() => handleGoogleLogin()}
              leftIcon={<FaGoogle color="#DB4437" />}
            >
              Sign in with Google
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
