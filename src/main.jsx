import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
const styles = {
  global: (props) => ({
    body: {
      // color:mode(lightMode colors,darkmode colors)
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props),
    },
  }),
}

const config = {
  // dark color mode
  initialColorMode: 'dark',
  // change theme to light or dark according to user's browser theme
  useSystemColorMode: true,
}

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e',
  },
}
// extendTheme and pass it to ChakraProvider so we can use it globally
const theme = extendTheme({ config, styles, colors })
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
)
