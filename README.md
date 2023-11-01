## Configuring ChakraUI
- installing
```
 npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
```


- Defining global styles
```
const styles = {
  global:(props)=>({
    body:{
      // color:mode(lightMode colors,darkmode colors)
      color:mode('gray.800','whiteAlpha.900')(props),
      bg:mode('gray.100','#101010')(props)
    }
  })
}
```

- creating config
```
const config = {
  // dark color mode
  initialColorMode: "dark",
  // change theme to light or dark according to user's browser theme
  useSystemColorMode:true,
}
```

- defining extra colors
```
const colors = {
  gray:{
    light:"#616161",
    dark:"#1e1e1e",
  }
}
```
- creating a custom theme using above objects
```
const theme = extendTheme({config, styles, colors})
```

- passing ChakraProvider with theme to our app
```
<React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
```

- Adding the ColorModeScript
```
<React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
```