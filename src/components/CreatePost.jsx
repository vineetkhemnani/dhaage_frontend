import { AddIcon } from '@chakra-ui/icons'
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import usePreviewImg from '../hooks/usePreviewImg'
import { BsFillImageFill } from 'react-icons/bs'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'

// max character allowed per post
const MAX_CHAR = 500

const CreatePost = () => {
  // modal functions
  const { isOpen, onOpen, onClose } = useDisclosure()

  //   stores the post text
  const [postText, setPostText] = useState('')

  // custom hook to preview image when we select a file from file explorer
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg()

  //   store the image reference
  const imageRef = useRef(null)

  //   store remaining characters that can be typed in a post
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR)

  //   get current user state
  const currentUser = useRecoilValue(userAtom)

  // showToast custom hook
  const showToast = useShowToast()

  //   loader if posting
  const [posting, setPosting] = useState(false)

  //   handle number of characters left to post
  const handleTextChange = (e) => {
    const inputText = e.target.value
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR)
      setPostText(truncatedText)
      setRemainingChar(0)
    } else {
      setPostText(inputText)
      setRemainingChar(MAX_CHAR - inputText.length)
    }
  }

  //   create post handler
  const handleCreatePost = async () => {
    // if creating a post set posting to true
    setPosting(true)
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postedBy: currentUser,
          text: postText,
          img: imgUrl,
        }),
      })
      const data = await res.json()

      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }

      //   show success toast
      showToast('Success', 'Post created successfully', 'success')

      //   close the modal
      onClose()

      //   reset the post's entire state
      setPostText('')
      setImgUrl('')
    } catch (error) {
      showToast('Error', error, 'error')
    } finally {
      setPosting(false)
    }
  }

  return (
    <>
      <Button
        position={'fixed'}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue('gray.300', 'gray.dark')}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setPostText('')
          setImgUrl('')
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              {/* text area for post content */}
              <Textarea
                placeholder="Post content goes here"
                onChange={handleTextChange}
                value={postText}
              />

              {/* shows how many characters we are left with */}
              <Text
                fontSize={'xs'}
                fontWeight={'bold'}
                textAlign={'right'}
                m={1}
                color={'gray.800'}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              {/* upload image with post */}
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {/* if image render this portion */}
            {imgUrl && (
              <Flex mt={5} w={'full'} position={'relative'}>
                <Image src={imgUrl} alt="selected-img" />
                {/* close button sets the imgUrl to empty string */}
                <CloseButton
                  onClick={() => setImgUrl('')}
                  bg={useColorModeValue('gray.300', 'gray.800')}
                  _hover={{ bg: useColorModeValue('gray.400', 'gray.600') }}
                  position={'absolute'}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={posting}
            >
              Post
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default CreatePost
