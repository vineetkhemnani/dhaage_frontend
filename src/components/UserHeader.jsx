import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useColorMode,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useState } from 'react'
import useShowToast from '../hooks/useShowToast'

const UserHeader = ({ user }) => {
  // color mode to change text color for copy to clipboard
  const { colorMode, toggleColorMode } = useColorMode()

  // toast shown when URL copied to clipboard
  const toast = useToast()

  // custom hook to display customized toast messages easily
  const showToast = useShowToast()

  // if updating user follow-unfollow
  const [updating, setUpdating] = useState(false)

  const currentUser = useRecoilValue(userAtom) // user that is logged in

  const [following, setFollowing] = useState(
    user.followers.includes(currentUser._id)
  )
  // handle follow-unfollow user clicks
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      // if not logged in => cannot follow
      showToast('Error', 'Please login to follow', 'error')
      return
    }
    if(updating) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }

      // stimulate adding/removing to followers on frontend/client side
      if (following) {
        showToast('Success', `You Unfollowed ${user.name}`, 'success')
        user.followers.pop()
      } else {
        showToast('Success', `You Followed ${user.name}`, 'success')
        user.followers.push(currentUser._id)
      }

      // change the state of follow-unfollow button
      setFollowing(!following)
    } catch (error) {
      showToast('Error', error, 'error')
    } finally {
      setUpdating(false)
    }
  }

  // copy URL of user profile
  const copyURL = () => {
    const currentURL = window.location.href
    // console.log(currentURL)
    // copy url to clipboard
    navigator.clipboard.writeText(currentURL).then(() => {
      // after copying toast notification => taken from chakraUI
      toast({
        title: 'Copied',
        status: 'success',
        description: 'Profile link copied to clipboard',
        duration: 3000,
        isClosable: true,
      })
    })
  }
  return (
    <VStack gap={3} alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>{user.username}</Text>
            <Text
              fontSize={'xs'}
              bg={'gray.dark'}
              color={'gray.light'}
              p={1}
              borderRadius={'full'}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePicture && (
            <Avatar
              name={user.name}
              src={user.profilePicture}
              size={{
                // media queries for avatar
                base: 'md',
                md: 'xl',
              }}
            />
          )}
          {!user.profilePicture && (
            <Avatar
              name={user.name}
              src="http://bit.ly/broken-link"
              size={{
                // media queries for avatar
                base: 'md',
                md: 'xl',
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {/* if current user visits own user profile */}
      {currentUser._id === user._id && (
        <RouterLink to="/update">
          <Button size={'sm'}>Update Profile</Button>
        </RouterLink>
      )}
      {/* if current user visits other user profile => show follow-unfollow button */}
      {currentUser._id !== user._id && (
        <Button size={'sm'} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}

      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'}></Box>
          <Text color={'gray.light'}>{user.following.length} following</Text>
          <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'}></Box>
          <Link color={'gray.light'}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={'pointer'} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                {/* copy link menu */}
                <CgMoreO size={24} cursor={'pointer'} />
              </MenuButton>
              <Portal>
                <MenuList bg={colorMode == 'dark' ? 'gray.dark' : 'white'}>
                  <MenuItem
                    bg={colorMode == 'dark' ? 'gray.dark' : 'white'}
                    onClick={copyURL}
                  >
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* Threads/Replies flex */}
      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={
            colorMode === 'dark' ? '1.5px solid white' : '2px solid black'
          }
          justifyContent={'center'}
          pb={3}
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1px solid gray'}
          justifyContent={'center'}
          color={'gray.light'}
          pb={3}
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}
export default UserHeader
