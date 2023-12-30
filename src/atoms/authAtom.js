// each atom is like a slice in Redux
import { atom } from 'recoil'
const authScreenAtom = atom({
  key: 'authScreenAtom',
  // by default, we want login page to show
  default: 'login',
})

export default authScreenAtom
