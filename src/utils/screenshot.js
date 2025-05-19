/* global html2canvas */

export function getScreenshot () {
  html2canvas(document.getElementById('game')).then(canvas => {
    // create a link to download the image
    const link = document.createElement('a')
    link.download = 'screenshot.png'
    link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    link.click()
  })
}
