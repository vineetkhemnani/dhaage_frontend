import { Button, Flex, useColorMode } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Link to={'/markzuckerberg'}>
      <Flex w={'full'} justifyContent={'center'}>
        <Button
          mx={'auto'}
          bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.400'}
          _hover={{
            bg: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.500',
          }}
        >
          Visit Profile
        </Button>
      </Flex>
    </Link>
  )
}
export default HomePage
