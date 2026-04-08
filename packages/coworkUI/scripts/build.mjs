import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgRoot = path.resolve(__dirname, '..')
const srcDir = path.join(pkgRoot, 'src')
const distDir = path.join(pkgRoot, 'dist')

await rm(distDir, { recursive: true, force: true })
await mkdir(distDir, { recursive: true })
await cp(srcDir, distDir, { recursive: true })

console.log(`Built coworkUI package: ${path.relative(pkgRoot, distDir)}`)
