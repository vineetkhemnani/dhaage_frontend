import { useToast } from '@chakra-ui/react'
// custom hook to show toast instead of doing it repetitively
const useShowToast = () => {
  const toast = useToast()

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    })
  }
  return showToast
}
export default useShowToast
