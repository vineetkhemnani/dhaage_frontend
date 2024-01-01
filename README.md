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


## Using Recoil for state management
- To use Recoil, we need to install it using ```npm i recoil```

### Setting up Recoil
- To set up recoil for the project, we need to wrap the part of the project which we need recoil to work in ```<RecoilRoot></RecoilRoot>```
- Example:-
```
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
```

### Atoms in Recoil
- Recoil uses atoms for global state management
- Each atom can be regarded as a state (similar to a slice in redux)
- An atom may be represented as:-
```
import { atom } from "recoil";

const userAtom = atom({
    key:'userAtom',
    default:JSON.parse(localStorage.getItem('user-threads'))
})

export default userAtom
```
- Here key represents name of the atom and default is the default value of the state
- We can access the value of each atom using ```const authScreenState = useRecoilValue(authScreenAtom)```

### Setting the value of atoms/states
- We can use the ```useSetRecoilState()``` provided by recoil to set the value of the atom
- It works similar to the function provided by useState()
```
const setUser = useSetRecoilState(userAtom)
```