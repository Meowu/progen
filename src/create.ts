import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import path from 'path'
import { URL } from 'url'
import { promisify } from 'util'
import { argumentOptions } from './types'

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles(options: argumentOptions) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  })
}

// we may extract return type from promptForMissingOptions
export async function createProject(options: argumentOptions & {template: string}) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  }

  const currentFileUrl = import.meta.url // ???
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    options.template.toLowerCase()
  )
  options.templateDirectory = templateDir

  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (e) {
    console.log('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }
  
  console.log('Copy projects files')
  await copyTemplateFiles(options)

  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}