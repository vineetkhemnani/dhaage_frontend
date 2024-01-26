import { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import Post from '../components/Post'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import {
  Flex,
  Spinner,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from '@chakra-ui/react'
import { useGetUserProfile } from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const UserPage = () => {
  // custom hook defined to get user and user loading state
  const { user, loading } = useGetUserProfile()

  // fetch username from params
  const { username } = useParams()

  const showToast = useShowToast()

  // store the posts
  const [posts, setPosts] = useRecoilState(postsAtom)

  // loading state for fetching posts
  const [fetchingPosts, setFetchingPosts] = useState(true)

  useEffect(() => {
    getPosts()
  }, [username, useShowToast,setPosts])
  console.log("posts is here and it is recoil state",posts)

  const getPosts = async () => {
    try {
      const res = await fetch(`/api/posts/user/${username}`)
      const data = await res.json()
      console.log(data)

      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }
      setPosts(data)
    } catch (error) {
      showToast('Error', error, 'error')
      setPosts([])
    } finally {
      setFetchingPosts(false)
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

  // if no user and not loading
  if (!user && !loading) return <h1>User not found </h1>
  return (
    <>
      <UserHeader user={user} />

      {/* tab panels */}
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab _selected={{ fontWeight: 'bold' }}>
            <Text>Threads</Text>
          </Tab>
          <Tab _selected={{ fontWeight: 'bold' }}>
            <Text>Replies</Text>
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>

          <TabPanel>
            {/* threads tab contents */}
            {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}
            {fetchingPosts && (
              <Flex justifyContent={'center'} my={12}>
                <Spinner size={'xl'} />
              </Flex>
            )}

            {posts.map((post) => (
              <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
          </TabPanel>


          <TabPanel>
            <p>Replies coming soon!</p>
          </TabPanel>

          
        </TabPanels>
      </Tabs>
    </>
  )
}

export default UserPage
