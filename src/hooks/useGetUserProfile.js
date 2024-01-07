import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from './useShowToast'

export const useGetUserProfile = () => {
  // state to save user data
  const [user, setUser] = useState(null)

  //   loading state
  const [loading, setLoading] = useState(true)

  //   get username from url
  const { username } = useParams()
  // console.log(username)
  //   custom toast messages
  const showToast = useShowToast()
  
  // function to get user data
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
  useEffect(() => {
    // call the getUser() whenever username changes
    getUser()
  }, [username, useShowToast])

  return { loading, user }
}
