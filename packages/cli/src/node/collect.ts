import { readJsonSync, readdirSync, writeFile } from 'fs-extra'
import { join } from 'path'
import { USER_PACKAGES_JSON_PATH } from '../shared/constant'
import { resolveConfig } from './config'
import { formatCode } from '../shared/format'

const PASCAL_REG = /(\w)(.+)/g

const IGNORE_DIR = ['utils', 'index.ts']

const genImport = (components, names) => {
  return components.map((name, idx) => `import { ${name} } from './${names[idx]}';`).join('\n')
}

const genExport = (dirs) => dirs.map((dir) => `export * from './${dir}';`).join('\n ')

export const genPackagesEntry = async () => {
  const { userConfig } = await resolveConfig()
  const pakagePath = userConfig.entry
  const outPut = join(pakagePath, 'index.ts')

  const { version } = readJsonSync(USER_PACKAGES_JSON_PATH)
  const dirs = readdirSync(pakagePath).filter((_) => !IGNORE_DIR.includes(_))

  // eg : avatar-group =>AvatarGroup
  const pascalNames = dirs.map((dir) => {
    return dir.replace(PASCAL_REG, (_, k, k1) => k.toUpperCase() + k1).replace(/-(\w)/g, (_, k) => k.toUpperCase())
  })

  const content = `
   
     const version = '${version}' ;
      import {App} from 'vue';
      ${genImport(pascalNames, dirs)}
      const components = [${pascalNames.map((_) => _)}];
      const install = (app:App) => {
        components.map((component:any) => {
          if (component.install) {
            app.use(component)
          } else if(component.name) {
            app.component(component.name , component)
          }
        })
      };
   
      ${genExport(dirs)}
   
      export {
        install,
        version
      };
   
      export default {
        install,
        version,
      };
   
      `

  await writeFile(outPut, formatCode(content))
}