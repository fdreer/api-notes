import mongoose from 'mongoose'
import colors from 'colors'

/**
 *  CONNECTION TO MONGO DB
 */
const connectionDB = () => {
  const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
  const connectionString =
    NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

  mongoose
    .connect(connectionString as string)
    .then(() => {
      console.log(colors.green('SUCCESS CONNECTION'))
    })
    .catch(err => {
      console.error(colors.red(err))
    })
}

export default connectionDB
