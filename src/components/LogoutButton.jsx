import { Button, Flex, useColorMode } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'

const LogoutButton = () => {
  const { colorMode } = useColorMode()
  // set the global user recoil state (similiar to setState in useState())
  const setUser = useSetRecoilState(userAtom)

  // custom hook to handle toasts
  const showToast = useShowToast()

  const handleLogout = async () => {
    try {
      // fetch
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      console.log(data)
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
  return (
    <Flex w={'full'} mt={'40px'} justifyContent={'center'}>
      <Button
        mx={'auto'}
        bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.400'}
        _hover={{
          bg: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.500',
        }}
        onClick={() => handleLogout()}
      >
        Logout
      </Button>
    </Flex>
  )
}
export default LogoutButton
