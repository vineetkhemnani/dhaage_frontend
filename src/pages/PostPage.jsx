import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import { useState } from 'react'
import Comment from '../components/Comment'
// design for each post
const PostPage = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [liked, setLiked] = useState(false)
  return (
    <>
      <Flex>
        {/* profile image and username on left */}
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src="/zuck-avatar.png" size={'md'} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              markzuckerberg
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'sm'} color={'gray.light'}>
            1d
          </Text>
          <Box
            className="icon-container"
            onClick={(e) => {
              // e.stopPropagation()
              e.preventDefault()
            }}
          >
            <Menu>
              <MenuButton>
                {/* post copy menu */}
                <BsThreeDots size={24} cursor={'pointer'} />
              </MenuButton>

              <Portal>
                <MenuList bg={colorMode == 'dark' ? 'gray.dark' : 'white'}>
                  <MenuItem
                    bg={colorMode == 'dark' ? 'gray.dark' : 'white'}
                    _hover={{ backgroundColor: 'blue.500', color: 'white' }}
                  >
                    Copy Link
                  </MenuItem>
                  <MenuItem
                    bg={colorMode == 'dark' ? 'gray.dark' : 'white'}
                    _hover={{ backgroundColor: 'blue.500', color: 'white' }}
                  >
                    Send Post
                  </MenuItem>
                  <MenuItem
                    bg={colorMode == 'dark' ? 'gray.dark' : 'white'}
                    _hover={{ backgroundColor: 'red', color: 'white' }}
                  >
                    Delete Post
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Text my={3}>Lets talk about Threads.</Text>
      <Box
        borderRadius={6}
        overflow={'hidden'}
        border={'1px solid'}
        borderColor={'gray.light'}
      >
        <Image src="/post1.png" />
      </Box>
      {/* post actions */}
      <Flex gap={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      {/* replies and likes section */}
      <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize={'sm'}>
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize={'sm'}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {/* comments on post */}
      <Comment
        comment="Looks really good"
        createdAt="2d"
        likes={100}
        username="dan-abramov"
        userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment
        comment="Amazing"
        createdAt="1d"
        likes={21}
        username="code-beast"
        userAvatar="https://bit.ly/code-beast"
      />
      <Comment
        comment="Pretty neat"
        createdAt="1d"
        likes={80}
        username="ryan-florence"
        userAvatar="https://bit.ly/ryan-florence"
      />
    </>
  )
}
export default PostPage
