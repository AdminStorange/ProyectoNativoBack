const initOGLController = () => {
    app.get('/servicio', (req, res) => {
        var connection = createConnection(credentials)
        connection.query('SELECT * from transporte', (err, result) => {
            if (err) throw error
            if (result.length > 0) res.json(result)
            else res.send('No hay resultados')
        })
        connection.end()
    })
    
    app.get('/ogl', (req, res) => {
        var connection = createConnection(credentials)
        connection.query('SELECT * from ogl', (err, result) => {
            if (err) throw error
            if (result.length > 0) res.json(result)
            else res.send('No hay resultados')
        })
        connection.end()
    })
    
    app.get('/tipoogl', (req, res) => {
        var connection = createConnection(credentials)
        connection.query('SELECT * from tipo_ogl', (err, result) => {
            if (err) throw err
            if (result.length > 0) res.json(result)
            else res.send('No hay resultados')
        })
        connection.end()
    })
    
    app.get('/detalleogl', (req, res) => {
        var connection = createConnection(credentials)
        connection.query('SELECT * from detalle_ogl', (err, result) => {
            if (err) throw error
            if (result.length > 0) res.json(result)
            else res.send('No hay resultados')
        })
        connection.end()
    })
}

export default initOGLController