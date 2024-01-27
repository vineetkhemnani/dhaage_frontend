import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spinner,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import { useEffect, useState } from 'react'
import Comment from '../components/Comment'
import { useGetUserProfile } from '../hooks/useGetUserProfile'
import useShowToast from '../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
// design for each post
const PostPage = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  // custom hook to show customized toasts
  const showToast = useShowToast()

  // custom hook defined to get user and user loading state
  const { user, loading } = useGetUserProfile()
  // get current user
  const currentUser = useRecoilValue(userAtom)
  // get post id from params
  const { pid } = useParams()

  const [posts, setPosts] = useRecoilState(postsAtom)

  const navigate = useNavigate()

  const currentPost = posts[0]
  useEffect(() => {
    const getPost = async () => {
      setPosts([])
      try {
        const res = await fetch(`/api/posts/${pid}`)
        const data = await res.json()
        if (data.error) {
          showToast('Error', data.error, 'error')
          return
        }
        console.log(data)
        setPosts([data])
      } catch (error) {
        showToast('Error', error.message, 'error')
      }
    }
    getPost()
  }, [showToast, pid, setPosts])

const handleDeletePost = async () => {
  try {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    const res = await fetch(`/api/posts/${currentPost._id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (data.error) {
      showToast('Error', data.error, 'error')
      return
    }
    // console.log(data)
    showToast('Success', 'Post deleted successfully', 'success')
    navigate(`/${user.username}`)
  } catch (error) {
    showToast('Error', data.error, 'error')
    setUser(null)
  }
}

  // if we havent fetched user and loading is true, show spinner
  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    )
  }

  // if (!post) return null
  // console.log(posts)
  // console.log(currentPost)
  return (
    <>
      <Flex>
        {/* profile image and username on left */}
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user?.profilePicture} size={'md'} name={user?.name} />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={'center'}>
          <Text
            fontSize={'xs'}
            width={36}
            textAlign={'right'}
            color={'gray.light'}
          >
            {currentPost?.createdAt &&
              formatDistanceToNow(new Date(currentPost.createdAt)) +
                ' ago'}
          </Text>
          <Box
            className="icon-container"
            onClick={(e) => {
              // e.stopPropagation()
              e.preventDefault()
            }}
          >
            <Menu>
              <MenuButton>
                {/* post copy menu */}
                <BsThreeDots size={24} cursor={'pointer'} />
              </MenuButton>

              <Portal>
                <MenuList bg={colorMode == 'dark' ? 'gray.dark' : 'white'}>
                  <MenuItem
                    bg={colorMode == 'dark' ? 'gray.dark' : 'white'}
                    _hover={{ backgroundColor: 'blue.500', color: 'white' }}
                  >
                    Copy Link
                  </MenuItem>
                  {currentUser?._id === user._id && (
                    <MenuItem
                      bg={colorMode == 'dark' ? 'gray.dark' : 'white'}
                      _hover={{ backgroundColor: 'red', color: 'white' }}
                      onClick={handleDeletePost}
                    >
                      Delete Post
                    </MenuItem>
                  )}
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Text my={3}>{currentPost?.text}</Text>
      {currentPost?.img && (
        <Box
          borderRadius={6}
          overflow={'hidden'}
          border={'1px solid'}
          borderColor={'gray.light'}
          w={'-webkit-fit-content'}
        >
          <Image src={currentPost?.img} />
        </Box>
      )}
      {/* post actions */}
      <Flex gap={3}>
        <Actions post={currentPost} />
      </Flex>

      {!currentUser && (
        <>
          <Divider my={4} />
          <Flex justifyContent={'space-between'}>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'2xl'}>👋</Text>
              <Text color={'gray.light'}>Login to like, reply and post</Text>
            </Flex>
            <Button
              onClick={() => {
                navigate(`/auth`)
              }}
            >
              Login
            </Button>
          </Flex>
          <Divider my={4} />
        </>
      )}
      {/* comments/replies on post */}
      {currentPost?.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost?.replies[currentPost?.replies.length - 1]._id
          }
        />
      ))}
    </>
  )
}
export default PostPage
