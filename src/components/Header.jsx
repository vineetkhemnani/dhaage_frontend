import { Flex, Image, useColorMode } from '@chakra-ui/react'
import lightLogo from '/light-logo.svg'
import darkLogo from '/dark-logo.svg'
import { AiFillHome } from 'react-icons/ai'
import { RxAvatar } from 'react-icons/rx'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link, useParams } from 'react-router-dom'
import SearchBar from './SearchBar'
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const currentUser = useRecoilValue(userAtom) //
  return (
    <Flex justifyContent={'space-between'} mt={4} mb="12">
      {currentUser && (
        <Link to="/">
          <AiFillHome size={30} />
        </Link>
      )}
      <Image
        ml={currentUser?40:0}
        cursor={'pointer'}
        alt="logo"
        w={6}
        src={colorMode === 'dark' ? lightLogo : darkLogo}
        onClick={toggleColorMode}
      />
      <Flex gap={3}>
        {currentUser && <SearchBar />}
        {currentUser && (
          <Link to={`/${currentUser?.username}`}>
            <RxAvatar size={30} />
          </Link>
        )}
      </Flex>
    </Flex>
  )
}
export default Header
