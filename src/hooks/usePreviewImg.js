import { useState } from 'react'
import useShowToast from './useShowToast'

// image preview for update profile picture
const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null)

  const showToast = useShowToast()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setImgUrl(reader.result)
      }

      // converts the file into BASE 64 string
      reader.readAsDataURL(file)

      // When the readAsDataURL operation is finished, the readyState becomes DONE,
      // and the loadend is triggered.
      // At that time, the result attribute contains the data as a
      // data: URL representing the file's data as a base64 encoded string.
    } else {
      showToast(
        'Invalid file type',
        'Please select a valid image file',
        'error'
      )
      setImgUrl(null)
    }
    // console.log(imgUrl)
    // console.log(file)
  }
  return { handleImageChange, imgUrl,setImgUrl }
}
export default usePreviewImg
