import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
// custom hook to show toast instead of doing it repetitively
const useShowToast = () => {
  const toast = useToast()

  // useCallback to cache the function
  const showToast = useCallback((title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    })
  },[toast])
  return showToast
}
export default useShowToast
