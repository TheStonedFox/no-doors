import fs from "fs"
import path from "path"

const rootDir = "./src" // поменяй на корневую папку стилей

// рекурсивно обходит все файлы
function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file)
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, callback)
        } else if (/\.(css|scss)$/.test(file)) {
            callback(filepath)
        }
    })
}

function pxToRem(content) {
    return content.replace(/font-size\s*:\s*([0-9.]+)px/g, (_, px) => {
        const rem = parseFloat(px) / 16
        return `font-size: ${rem}rem`
    })
}

walk(rootDir, file => {
    const content = fs.readFileSync(file, "utf-8")
    const newContent = pxToRem(content)
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, "utf-8")
        console.log(`✔ Updated ${file}`)
    }
})
