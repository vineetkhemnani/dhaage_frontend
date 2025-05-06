import { Button, Flex, Spinner, useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const [posts, setPosts] = useRecoilState(postsAtom)
  const [loading, setLoading] = useState(true)

  // custom hook to show toasts
  const showToast = useShowToast()

  useEffect(() => {
    // get feedPosts function
    const getFeedPosts = async () => {
      setLoading(true)
      setPosts([])
      try {
        const res = await fetch('/api/posts/feed', {
          method: 'GET', // Default method is GET, but explicitly stating it can be clearer
          credentials: 'include', // Crucial part: tells fetch to include cookies and HTTP Auth
          // You can add other options here if needed, like headers:
          headers: {
            'Content-Type': 'application/json',
          //   'Accept': 'application/json',
          //   // If you were sending a custom Authorization token (e.g., JWT):
          //   // 'Authorization': `Bearer ${yourToken}`
          }
        })
        const data = await res.json()
        console.log('posts: ', data)
        // error handling for data
        if (data.error) {
          showToast('Error', data.error, 'error')
          return
        }

        // if no error=> setPosts
        setPosts(data)
      } catch (error) {
        showToast('Error', error.message, 'error')
      } finally {
        setLoading(false)
      }
    }
    getFeedPosts()
  }, [showToast, setPosts])
  return (
    <>
      {loading && (
        <Flex justify={'center'}>
          <Spinner size={'xl'} />
        </Flex>
      )}
      {/* not loading and no users followed */}
      {!loading && posts?.length === 0 && (
        <h1>Follow some users to see the feed</h1>
      )}
      {/* if posts array has items */}
      {posts?.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
    // <Link to={'/markzuckerberg'}>
    //   <Flex w={'full'} justifyContent={'center'}>
    //     <Button
    //       mx={'auto'}
    //       bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.400'}
    //       _hover={{
    //         bg: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.500',
    //       }}
    //     >
    //       Visit Profile
    //     </Button>
    //   </Flex>
    // </Link>
  )
}
export default HomePage
