import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'SecretKeyOfToken');

            req.userId = decoded._id
            next();
        } catch (err) {
            return res.status(403).json({message: "not auth!"});
        }
    } else {
        return res.status(403).json({message: "not auth!"});
    }
}