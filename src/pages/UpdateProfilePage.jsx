import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import usePreviewImg from '../hooks/usePreviewImg'
import useShowToast from '../hooks/useShowToast'
import { useNavigate } from 'react-router-dom'

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom)
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: '',
  })
  const fileRef = useRef(null)
  const [updating, setUpdating] = useState(false)

  const showToast = useShowToast()

  // custom hook to preview image when we select a file from file explorer
  const { handleImageChange, imgUrl } = usePreviewImg()

  const navigate = useNavigate()

  // handle cancel button
  const handleCancel = (e) => {
    try {
      if (updating) {
        e.preventDefault()
        // Optionally, you can show a message to the user that the cancel action is disabled during the update.
        showToast(
          'Warning',
          'Cancel action is disabled during update',
          'warning'
        )
      } else {
        // Handle the cancel action when not updating
        // For example, you may want to navigate back or perform some other action.
        navigate(`/${user.username}`)
      }
    } catch (error) {
      showToast('Error', error, 'error')
    }
  }

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    // if updating backend cant submit again and exit out of function
    if (updating) return
    setUpdating(true)
    try {
      // console.log(inputs)
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...inputs, profilePicture: imgUrl }),
      })
      const data = await res.json() // updated user object
      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }
      showToast('Success', 'Profile updated successfully', 'success')
      setUser(data)
      localStorage.setItem('user-threads', JSON.stringify(data))
      //   console.log(imgUrl)
    } catch (error) {
      showToast('Error', error, 'error')
    } finally {
      setUpdating(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'} my={6}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={'md'}
                  src={imgUrl || user.profilePicture}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}
              onClick={handleCancel}
              isDisabled={updating}
            >
              Cancel
            </Button>
            <Button
              bg={'green.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'green.500',
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  )
}
