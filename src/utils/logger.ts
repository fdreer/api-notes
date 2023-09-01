import colors from 'colors'
export const LogSucces = (message: string) => {
  console.log(colors.green(`SUCCESS: ${message}`))
}

export const LogWarning = (message: string) => {
  console.log(colors.yellow(`WARNING: ${message}`))
}

export const LogError = (message: string) => {
  console.log(colors.red(`ERROR: ${message}`))
}
