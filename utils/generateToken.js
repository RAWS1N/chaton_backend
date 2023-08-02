import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    const token = jwt.sign({id},process.env.secret,{
        expiresIn : "15d"
    })
    return token
}


export default generateToken