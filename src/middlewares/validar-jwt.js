import { decodedToken } from "../helpers/generar-jwt.js"

const validateJWT = async (req, res, next) => {
    const token = req.header("Authorization")?.replace('Bearer ', '')
    if (!token) {
        res.status(401).json({
            msg: "No existe token en la peticion"
        })
        return
    }
    try {
        const val = await decodedToken(token)
        req.token = val;
        let userValidated = {
            nombre: 'admin'
        }

        req.user = userValidated
        next()
    } catch (error) {
        res.status(401).send("Porfavor autenticarse")
    }
}

export default validateJWT