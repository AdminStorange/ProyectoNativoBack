const initPaymensController = () => {
    app.get('/pagos', (req, res) => {
        var connection = createConnection(credentials)
        connection.query('SELECT * from pagos_recibidos', (err, result) => {
            if (err) throw error
            if (result.length > 0) res.json(result)
            else res.send('No hay resultados')
        })
        connection.end()
    })
}

export default initPaymensController