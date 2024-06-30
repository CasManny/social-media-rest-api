export const handleError = async (err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Internal Server Error"

    console.log(`Error from handleError function => ${message}`)
    return res.status(status).json({error: message})
}