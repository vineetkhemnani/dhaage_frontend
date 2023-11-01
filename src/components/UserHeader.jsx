import { Avatar, Box, Flex, Text, VStack } from '@chakra-ui/react'

const UserHeader = () => {
  return (
    <VStack gap={4} alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'}>Mark Zuckerberg</Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>markzuckerberg</Text>
            <Text fontSize={'xsm'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>threads.net</Text>
          </Flex>
        </Box>
        <Box>
          <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size={'xl'} />
        </Box>
      </Flex>
      <Box>box3</Box>
    </VStack>
  )
}
export default UserHeader
