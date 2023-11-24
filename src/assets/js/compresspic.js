import * as imageConversion from 'image-conversion'
/**
 * 压缩图片
 * inputFile :file
 * toSize : 想要压缩的大小
 * */
export async function compressAccurately(inputFile, toSize) {
  // console.log('压缩前的图片')
  // console.log(inputFile)
  const resAvatarBlob = await imageConversion.compressAccurately(inputFile, {
    size: toSize
    // width: toWidth
  })
  const resAvatarFile = new File(
    [resAvatarBlob],
    inputFile.name,
    { type: inputFile.type }
  )
  resAvatarFile.uid = inputFile.uid
    // console.log('压缩后的图片')
    // console.log(resAvatarFile)
  return resAvatarFile
}
