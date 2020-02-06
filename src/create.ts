import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import path from 'path'
import { URL } from 'url'
import { promisify } from 'util'
import { argumentOptions } from './types'
import Listr from 'listr'
import { initGit } from './git'
import execa from 'execa';

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

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options)
    },
    {
      title: 'Initialize git',
      enable: () => options.git,
      task: () => initGit(options.targetDirectory!)
    },
    {
      title: 'Install dependencies',
      task: () => execa('npm'/**todo: support yarn */, ['install'], {
        cwd: options.targetDirectory
      }),
      skip: () => 
        !options.runInstall 
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    }
  ])

  tasks.run()

  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}