import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import lightLogo from '/light-logo.svg'
import darkLogo from '/dark-logo.svg'
import { AiFillHome } from 'react-icons/ai'
import { RxAvatar } from 'react-icons/rx'
import { RxHamburgerMenu } from 'react-icons/rx'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link, useParams } from 'react-router-dom'
import SearchBar from './SearchBar'
import { HamburgerIcon } from '@chakra-ui/icons'
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import authScreenAtom from '../atoms/authAtom'
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const currentUser = useRecoilValue(userAtom) //

  const logout = useLogout()

  const setAuthScreen = useSetRecoilState(authScreenAtom)
  return (
    <Flex justifyContent={'space-between'} mt={4} mb="12">
      {currentUser && (
        <Link to="/">
          <AiFillHome size={30} />
        </Link>
      )}
      {!currentUser && (
        <Link to="/auth" onClick={() => setAuthScreen('login')}>
          Login
        </Link>
      )}
      <Image
        ml={currentUser ? 40 : 0}
        mx={currentUser?undefined:'auto'}
        cursor={'pointer'}
        alt="logo"
        w={6}
        src={colorMode === 'dark' ? lightLogo : darkLogo}
        onClick={toggleColorMode}
      />
      {!currentUser && (
        <Link to="/auth" onClick={() => setAuthScreen('signup')}>
          Signup
        </Link>
      )}

      <Flex gap={3}>
        {currentUser && <SearchBar />}

        {currentUser && (
          <Menu bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.400'}>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<RxHamburgerMenu />}
              variant="outline"
            />
            <MenuList>
              <MenuItem
                _hover={{
                  bg: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.500',
                }}
              >
                <Box display="flex" alignItems="center">
                  <RxAvatar
                    style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '8px',
                    }}
                  />
                  <Link to={`/${currentUser?.username}`}>
                    <Text>Profile</Text>
                  </Link>
                </Box>
              </MenuItem>
              <MenuItem
                _hover={{
                  bg: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.500',
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  onClick={() => logout()}
                >
                  <FiLogOut
                    style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '8px',
                    }}
                  />
                  <Text>Logout</Text>
                </Box>
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  )
}
export default Header
