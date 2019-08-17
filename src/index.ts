import arg from 'arg'
import { argumentOptions } from './types'
import { promptForMissingOptions } from './prompt'

const parseArgs = (rawArgs: string[]): argumentOptions => {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false
  }
}

export const run = async (args: string[]) => {
  let options = parseArgs(args)
  options = await promptForMissingOptions(options)
  console.log('option', options)
}