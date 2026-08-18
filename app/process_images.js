const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const publicDir = path.join(__dirname, 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const logoSrc = path.join(__dirname, 'src/assets/images/Logo.jpg')
const favSrc = path.join(__dirname, 'src/assets/images/favicon.jpg')

async function processImage(srcPath, outPngName, outJpgName) {
  if (!fs.existsSync(srcPath)) return

  // Copy original JPG
  fs.copyFileSync(srcPath, path.join(publicDir, outJpgName))

  // Create transparent PNG by keying out white background pixels
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // If pixel is white or near-white (threshold > 235)
    if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = 0 // Transparent
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(path.join(publicDir, outPngName))

  console.log(`Processed ${srcPath} -> public/${outPngName}`)
}

async function main() {
  await processImage(logoSrc, 'logo.png', 'logo.jpg')
  await processImage(favSrc, 'favicon.png', 'favicon.jpg')
}

main().catch(console.error)
