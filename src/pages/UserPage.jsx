import { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import Post from '../components/Post'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'

const UserPage = () => {
  // store the user state
  const [user, setUser] = useState(null)

  // fetch username from params
  const { username } = useParams()

  const showToast = useShowToast()

  // get user using fetch request
  const getUser = async () => {
    try {
      const res = await fetch(`/api/users/profile/${username}`)
      const data = await res.json()
      console.log(data)

      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }

      setUser(data)
    } catch (error) {
      // console.log(error)
      showToast('Error', error, 'error')
    } finally {
      // whether user found or not, setLoading state to false finally
      setLoading(false)
    }
  }

  // loading state to check for user
  const [loading, setLoading] = useState(true)

  // store the posts
  const [posts, setPosts] = useState([])

  // loading state for fetching posts
  const [fetchingPosts, setFetchingPosts] = useState(true)

  useEffect(() => {
    // call the getUser() whenever username changes
    getUser()
    getPosts()
  }, [username, useShowToast])

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

      {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}
      {fetchingPosts && (
        <Flex justifyContent={'center'} my={12}>
          <Spinner size={'xl'} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
    </>
  )
}
export default UserPage
