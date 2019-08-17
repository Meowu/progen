import inquirer from 'inquirer'
import { argumentOptions } from './types'

type AnswerType = Record<keyof argumentOptions, string & number & boolean>
type QuestionMap = {
  type: string;
  name: string;
  message: string;
  choices?: string[];
  default?: any;
}
export const promptForMissingOptions = async (options: argumentOptions): Promise<argumentOptions> => {
  const defaultTemplate = 'TypeScript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    }
  }

  const questions: QuestionMap[] = []
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate
    })
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false
    })
  }

  const answers: AnswerType = await inquirer.prompt(questions)
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git
  }
}