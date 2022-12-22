const initPropietorsController = () => {
    app.get('/propietario', (req, res) => {
        var connection = createConnection(credentials)
        connection.query(`SELECT
        propietario.idPropietario,
        propietario.nombre,
        propietario.apellido,
        propietario.tipoCliente,
        propietario.documento,
        propietario.direccion,
        propietario.telefono,
        propietario.email,
        propietario.fechaDeCorte,
        propietario.estado
        from propietario`, (err, result) => {
            if (err) throw err
            if (result.length > 0) res.status(200).send(result)
            else res.send('No hay resultados')
        })
        connection.end()
    })

    app.post('/propietarioPorId', (req, res) => {
        const { idPropietario } = req.body
        const values = [idPropietario]
    
        let connection = createConnection(credentials)
    
        connection.query(`
        select
        idPropietario,
        nombre,
        apellido,
        tipoCliente,
        documento,
        direccion,
        telefono,
        email,
        fechaDeCorte,
        estado,
        primerCambio,
        fechaPrimerCambio
        from
        propietario
        where idPropietario = ?`,
            values, (err, result) => {
                try {
    
                    if (result.length > 0) {
                        res.status(200).send(result[0])
                    } else {
                        res.status(200).send([])
                    }
    
                } catch (err) {
                    console.log(err)
                }
                connection.end()
            })
    })

    app.post('/propietarioFiltrado', (req, res) => {
        const { text } = req.body
        var connection = createConnection(credentials)
        connection.query(`select
        propietario.idPropietario,
        propietario.nombre,
        propietario.apellido,
        propietario.tipoCliente,
        propietario.documento,
        propietario.direccion,
        propietario.telefono,
        propietario.email,
        propietario.fechaDeCorte,
        propietario.estado
        from propietario where nombre like "%${text}%" or apellido like "%${text}%"`, (err, result) => {
            if (err) throw err
            if (result.length > 0) res.status(200).send(result)
            else res.send([])
        })
        connection.end()
    })

    app.post('/nuevopropietario', (req, res) => {
        const { nombre, apellido, tipoCliente, tipoDocumento, documento, direccion, telefono, email, formNiubiz, plan } = req.body
        const values = [nombre, apellido, tipoCliente, tipoDocumento, documento, direccion, telefono, email, formNiubiz, plan]
        var connection = createConnection(credentials)
        connection.query(`
        INSERT
        INTO propietario (
        nombre,
        apellido,
        tipoCliente,
        tipoDocumento,
        documento,
        direccion,
        telefono,
        email,
        formNiubiz,
        plan) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "Activo")`, values, (err, result) => {
            if (err) {
                res.status(500).send('Ocurrio un error con el registro')
            } else res.status(200).send('Registro ingresado correctamente')
        })
        connection.end()
    })
}

export default initPropietorsController