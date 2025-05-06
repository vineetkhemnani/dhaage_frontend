import {
  Input,
  InputGroup,
  Box,
  Button,
  FormControl,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Card,
  Avatar,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { Link } from 'react-router-dom'

const SearchBar = () => {
  // hook derived from modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // search user state
  const [searchTerm, setSearchTerm] = useState('')

  // state to save user data
  const [user, setUser] = useState(null)

  //   loading state
  const [loading, setLoading] = useState(true)

  // console.log(username)
  //   custom toast messages
  const showToast = useShowToast()

  // function to get user data
  const getUser = async () => {
    try {
      const res = await fetch(
        `https://threads-copy-backend.vercel.app/api/users/profile/${searchTerm}`
      )
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

  const handleSubmit = () => {
    // console.log(searchTerm)
    getUser()
    setSearchTerm('')
  }

  return (
    <Box>
      <FormControl>
        <InputGroup>
          <Input
            type="text"
            placeholder="Search for a user..."
            h={8}
            borderRadius={'2xl'}
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            // open modal for search onFocus
            onClick={onOpen}
            blur={!isOpen}
            focusBorderColor={useColorModeValue('black', 'gray.light')}
            borderColor="gray.400"
          />
          {/* <Button
            type="submit"
            ml={2}
            colorScheme="teal"
            onClick={handleSubmit}
          >
            Search
          </Button> */}
        </InputGroup>
      </FormControl>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setSearchTerm()
          setUser(null)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Search using username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {user && (
              <Link onClick={onClose} to={`/${user?.username}`}>
                <Card p={1} my={4}>
                  <Flex justifyContent={'space-around'}>
                    <Avatar src={user?.profilePicture} />
                    <Box>
                      <Text>{user?.name}</Text>
                      <Text>{user?.username}</Text>
                    </Box>
                  </Flex>
                </Card>
              </Link>
            ) }
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              ml={2}
              colorScheme="teal"
              onClick={handleSubmit}
            >
              Search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
export default SearchBar
