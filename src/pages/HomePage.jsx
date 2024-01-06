import { Button, Flex, Spinner, useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // custom hook to show toasts
  const showToast = useShowToast()


  useEffect(() => {
    // get feedPosts function
    const getFeedPosts = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/posts/feed')
        const data = await res.json()
        console.log(data)
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
  }, [showToast])
  return (
    <>
      {loading && (
        <Flex justify={'center'}>
          <Spinner size={'xl'} />
        </Flex>
      )}
      {/* not loading and no users followed */}
      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed</h1>
      )}
      {/* if posts array has items */}
      {posts.map((post)=>(
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
        )
      )}
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
