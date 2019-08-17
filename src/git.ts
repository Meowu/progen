import execa from 'execa'

export const initGit = async (directory: string) => {
  // TODO: check if git installed.
  const result = await execa('git', ['init'], {
    cwd: directory
  })
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
  return true;
}