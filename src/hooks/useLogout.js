import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from './useShowToast'

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast()
  const logout = async () => {
    try {
      // fetch
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      // console.log(data)
      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }

      // remove the user from local storage
      localStorage.removeItem('user-threads')

      // setting the recoil atom state to null
      setUser(null)

      // show successfully logged out toast
      showToast('Logged out', data.message, 'info')
    } catch (error) {
      showToast('Error', error, 'error')
      console.log(error)
    }
  }
  return logout
}
export default useLogout
