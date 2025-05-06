import {
  Avatar,
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import { DeleteIcon } from '@chakra-ui/icons'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
const Post = ({ post, postedBy }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  // state for like/heart button
  const [liked, setLiked] = useState(false)

  // get current user from recoil
  const currentUser = useRecoilValue(userAtom)

  // global posts atom
  const [posts, setPosts] = useRecoilState(postsAtom)

  //   save user fetched using getUser method
  const [user, setUser] = useState(null)
  //   custom hook to handle toast messages
  const showToast = useShowToast()

  //   navigate to another page
  const navigate = useNavigate()

  //   fetch user using postedBy(userId)
  useEffect(() => {
    // runs once for each post
    const getUser = async () => {
      try {
        const res = await fetch('/api/users/profile/' + postedBy)
        const data = await res.json()
        if (data.error) {
          showToast('Error', data.error, 'error')
          return
        }
        // console.log(data)
        // if no errors set user to data
        setUser(data)
      } catch (error) {
        showToast('Error', data.error, 'error')
        setUser(null)
      }
    }
    getUser()
  }, [postedBy])

  // delete posts method
  const handleDeletePost = async (e) => {
    e.preventDefault()
    try {
      if (!window.confirm('Are you sure you want to delete this post?')) return
      const res = await fetch(
        `https://threads-copy-backend.vercel.app/api/posts/${post._id}`,
        {
          method: 'DELETE',
          credentials: 'include', // Crucial part: tells fetch to include cookies and HTTP Auth
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await res.json()
      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }
      // console.log(data)
      showToast('Success', 'Post deleted successfully', 'success')
      setPosts(posts.filter((p) => p._id !== post._id))
    } catch (error) {
      showToast('Error', data.error, 'error')
      setUser(null)
    }
  }
  if (!user) return null
  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          {/* user picture alongside post */}
          <Avatar
            size={'md'}
            name={user?.name}
            src={user?.profilePicture}
            onClick={(e) => {
              e.preventDefault()
              navigate(`/${user?.username}`)
            }}
          />
          {/* below acts as the vertical line */}
          <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
          <Box position={'relative'} w={'full'}>
            {post.replies.length === 0 && <Text textAlign={'center'}>😑</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[0].userProfilePic}
                position={'absolute'}
                top={'0px'}
                left="15px"
                padding={'2px'}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={'absolute'}
                bottom={'0px'}
                right="-5px"
                padding={'2px'}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[2].userProfilePic}
                position={'absolute'}
                bottom={'0px'}
                left="4px"
                padding={'2px'}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'} w={'full'}>
            <Flex w={'full'} alignItems={'center'}>
              {/* username div */}
              {/* username above post */}
              <Text
                fontSize={'sm'}
                fontWeight={'bold'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/${user?.username}`)
                }}
              >
                {user?.username}
              </Text>
              <Image src="verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={'center'}>
              {/* top-right flex div */}
              {/* post date */}
              <Text
                fontSize={'xs'}
                width={36}
                textAlign={'right'}
                color={'gray.light'}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {currentUser?._id === user._id && (
                <DeleteIcon
                  size={20}
                  _hover={{ color: 'red.600' }}
                  onClick={handleDeletePost}
                />
              )}
            </Flex>
          </Flex>

          <Text fontSize={'sm'}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid'}
              borderColor={'gray.light'}
            >
              <Image src={post.img} w={'full'} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            {/* like,comment,share buttons */}
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  )
}
export default Post
