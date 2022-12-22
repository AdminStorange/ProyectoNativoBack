const initLoginController = () => {
    app.post('/login', (req, res) => {
        const { email, password } = req.body
        const values = [email, password]
        var connection = createConnection(credentials)
        connection.query("SELECT * FROM users WHERE email = ? AND password = ?", values, (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                if (result.length > 0) {
                    res.status(200).send(result)
                } else {
                    res.status(200).send(result)
                }
            }
        })
        connection.end()
    })
}

export default initLoginController