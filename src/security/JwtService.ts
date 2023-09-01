import jwt from 'jsonwebtoken'

const secret = `${process.env.SECRET_TEXT ?? 'NASHEEE'}`

class JwtService {
  generateToken (sub: any): string {
    const token = jwt.sign({}, secret, {
      expiresIn: '2h',
      algorithm: 'HS256',
      subject: sub.toString()
    })

    return token
  }
}
export default Object.freeze(new JwtService())
