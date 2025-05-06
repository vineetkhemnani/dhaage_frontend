import {
  Box,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  Container,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import './Heart.css'
import postsAtom from '../atoms/postsAtom'
// actions
// 1. like
// 2. comment
// 3. share
const Actions = ({ post }) => {
  // hook derived from modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // get current user if present
  const user = useRecoilValue(userAtom)

  // post intially has a state derived from the previous component
  const [posts, setPosts] = useRecoilState(postsAtom)

  // state to toggle like-unlike
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id))

  // loading/liking state for sending the fetch request so that it does not send it again
  const [isLiking, setIsLiking] = useState(false)

  // loading/replying state for sending the fetch request so that it does not send it again
  const [isReplying, setIsReplying] = useState(false)

  // state to store replies
  const [reply, setReply] = useState('')

  // show custom toasts
  const showToast = useShowToast()

  // function to handle like unlike
  const handleLikeUnlike = async () => {
    if (!user)
      return showToast('Error', 'You must be logged in to like a post', 'error')

    // if isLiking means request has not yet completed return out of the function
    if (isLiking) return
    // if not liking, send the fetch request and set isLiking to true
    setIsLiking(true)
    try {
      const res = await fetch(
        `https://threads-copy-backend.vercel.app/api/posts/like/${post._id}`,
        {
          method: 'PUT',
          credentials: 'include', // Crucial part: tells fetch to include cookies and HTTP Auth
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await res.json()

      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }
      if (!liked) {
        // like the post by adding the id of the current user to the post likes array
        // by spreading the post object properties inside setPost and concatenating user._id
        // to the post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] }
          }
          return p
        })
        setPosts(updatedPosts)
      } else {
        // while unliking filter the id from the array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) }
          }
          return p
        })

        setPosts(updatedPosts)
      }
      // console.log(data)

      // set liked/unliked state
      setLiked(!liked)
    } catch (error) {
      showToast('Error', error.message, 'error')
    } finally {
      // function completed running setIsLiking to false
      setIsLiking(false)
    }
  }

  // function to handle replies
  const handleReplies = async () => {
    // console.log(reply)
    if (!user)
      return showToast('Error', 'You must be logged in to like a post', 'error')

    if (isReplying) return
    setIsReplying(true)
    try {
      const res = await fetch(`/api/posts/reply/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: reply }),
      })
      const data = await res.json()

      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [data, ...p.replies] }
        }
        return p
      })

      setPosts(updatedPosts)
      showToast('Success', 'Reply posted successfully', 'success')
      console.log(data)
      onClose()
      setReply('')
    } catch (error) {
      showToast('Error', error.message, 'error')
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={3} onClick={(e) => e.preventDefault()}>
        {/* <div>
          <input type="checkbox" id="checkbox" checked={liked}/>
          <label htmlFor="checkbox">
            <svg
              aria-label="Like"
              color={liked ? 'rgb(237, 73, 86)' : ''}
              fill={liked ? 'rgb(237, 73, 86)' : 'transparent'}
              height="19"
              role="img"
              viewBox="0 0 24 22"
              width="20"
              onClick={() => handleLikeUnlike()}
            >
              <title>Like</title>
              <path
                d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                stroke="currentColor"
                strokeWidth="2"
              ></path>
            </svg>
          </label>
        </div> */}
        <Container my={-2.5} mr={-7} ml={-8}>
          <input
            type="checkbox"
            id="checkbox"
            checked={liked}
            readOnly
            // onChange={()=>{console.log("clicked")}}
          />
          <label htmlFor="checkbox">
            <svg
              id="heart-svg"
              height="40"
              role="img"
              viewBox="467 392 58 57"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => handleLikeUnlike()}
            >
              <g
                id="Group"
                fill="none"
                fillRule="evenodd"
                transform="translate(467 392)"
              >
                <path
                  d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
                  id="heart"
                  fill="#AAB8C2"
                />
                <circle
                  id="main-circ"
                  fill="#E2264D"
                  opacity="0"
                  cx="29.5"
                  cy="29.5"
                  r="1.5"
                />

                <g id="grp7" opacity="0" transform="translate(7 6)">
                  <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2" />
                  <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2" />
                </g>

                <g id="grp6" opacity="0" transform="translate(0 28)">
                  <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2" />
                  <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2" />
                </g>

                <g id="grp3" opacity="0" transform="translate(52 28)">
                  <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2" />
                  <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2" />
                </g>

                <g id="grp2" opacity="0" transform="translate(44 6)">
                  <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2" />
                  <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2" />
                </g>

                <g id="grp5" opacity="0" transform="translate(14 50)">
                  <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2" />
                  <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2" />
                </g>

                <g id="grp4" opacity="0" transform="translate(35 50)">
                  <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2" />
                  <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2" />
                </g>

                <g id="grp1" opacity="0" transform="translate(24)">
                  <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
                  <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
                </g>
              </g>
            </svg>
          </label>
        </Container>
        <CommentSVG openModal={onOpen} />

        <RepostSVG />

        <ShareSVG />
      </Flex>

      <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize={'sm'}>
          {post?.replies.length} Replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize={'sm'}>
          {post?.likes.length} likes
        </Text>
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setReply('')
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="Reply goes here"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              loadingText="Replying"
              colorScheme="blue"
              size={'sm'}
              mr={3}
              onClick={handleReplies}
              isLoading={isReplying}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
export default Actions

const RepostSVG = () => {
  return (
    <svg
      aria-label="Repost"
      color="currentColor"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
    >
      <title>Repost</title>
      <path
        fill=""
        d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
      ></path>
    </svg>
  )
}

const ShareSVG = () => {
  return (
    <svg
      aria-label="Share"
      color=""
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  )
}

const CommentSVG = ({ openModal }) => {
  return (
    <svg
      aria-label="Comment"
      color=""
      fill=""
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      onClick={openModal}
    >
      <title>Comment</title>
      <path
        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
    </svg>
  )
}
