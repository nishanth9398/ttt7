const input = document.querySelector("#profileImg")
input.addEventListener("change", () => {
    const reader = new FileReader()
    reader.readAsDataURL(input.files[0])
    reader.addEventListener('load', async () => {
        await uploadImg(reader.result)
        
    })
})

/**
 * @param {string} dataURL
 * @returns {Promise<string>} the image id
 */
export async function uploadImg(dataURL) {
    let i, id

    await fetch('/api/img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            string: dataURL.slice(0, 100),
            completed: false
        })
    }).then(async res => id = await res.text())

    for (i = 100; i <= dataURL.length; i += 100) {
        await fetch(`/api/img/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                string: dataURL.slice(i, i + 100),
                completed: !(i + 100 < dataURL.length)
            })
        })
    }

    imgs.set(id, { id: id, string: dataURL, completed: true })
    return id
}

/**
 * @param {string} id imgId
 * @returns {Promise<string>} dataURL
 */
export async function getImg(id) {
    if (imgs.has(id)) return imgs.get(id).string

    const img = { id: id, string: '', completed: false }

    for (let i = 0; !img.completed; i += 100) {
        await fetch(`/api/img/${id}/${i}`, { method: 'GET' }).then(async res => {
            let body = await res.json()
            img.string += body.string
            if (body.completed) {
                img.completed = true
            }
        })
    }

    imgs.set(img.id, img)
    return img.string
}

export const imgs = new Map()