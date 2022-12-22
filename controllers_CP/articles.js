const initArticlesController = () => {
    app.get('/articulo', (req, res) => {
        var connection = createConnection(credentials)
        connection.query('SELECT * from articulo', (err, result) => {
            if (err) throw err
            if (result.length > 0) res.json(result)
            else res.send('No hay resultados')
        })
        connection.end()
    })
    
    //Articulos por propietario
    app.post('/articuloPropietario', (req, res) => {
        const { idPropietario } = req.body
        const values = [idPropietario]
        var connection = createConnection(credentials)
        connection.query(`
            SELECT
            articulo.idArticulo,
            articulo.titulo,
            almacen.ubicacion,
            almacen.numero,
            almacen.area,
            posicion.seccion,
            posicion.columna,
            pallet.idPallet,
            articulo.tipoArticulo,
            articulo.imagenRecogida,
            articulo.descripcion
            FROM
            articulo
            RIGHT JOIN pallet ON articulo.idPallet = pallet.idPallet
            RIGHT JOIN posicion ON pallet.idPosicion = posicion.idPosicion
            RIGHT JOIN almacen ON almacen.idAlmacen = posicion.idAlmacen
            RIGHT JOIN propietario ON propietario.idPropietario = articulo.idPropietario
            WHERE propietario.idPropietario = ?`, values, (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                if (result.length > 0) {
                    res.status(200).send(result)
                } else {
                    res.status(200).send('No se encontraron articulos para el propietario')
                }
            }
        })
        connection.end()
    })
    
    //Articulos por almacen
    app.post('/articuloAlmacen', (req, res) => {
        const { idAlmacen } = req.body
        const values = [idAlmacen]
        var connection = createConnection(credentials)
        connection.query(`
            SELECT
            articulo.idArticulo,
            articulo.titulo,
            propietario.nombre,
            propietario.apellido,
            almacen.ubicacion,
            almacen.numero,
            almacen.area,
            posicion.seccion,
            posicion.columna,
            pallet.idPallet,
            articulo.tipoArticulo,
            articulo.imagenRecogida,
            articulo.descripcion
            FROM
            articulo
            RIGHT JOIN pallet ON articulo.idPallet = pallet.idPallet
            RIGHT JOIN posicion ON pallet.idPosicion = posicion.idPosicion
            RIGHT JOIN almacen ON almacen.idAlmacen = posicion.idAlmacen
            RIGHT JOIN propietario ON propietario.idPropietario = articulo.idPropietario
            WHERE almacen.idAlmacen = ?`, values, (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                if (result.length > 0) {
                    res.status(200).send(result)
                } else {
                    res.status(200).send('No se encontraron articulos en el almacen')
                }
            }
        })
        connection.end()
    })
    
    //Subarticulos por articulo
    app.post('/subarticulo', (req, res) => {
        const { idArticulo } = req.body
        const values = [idArticulo]
        let connection = createConnection(credentials)
        connection.query(`
            SELECT
            subarticulo.idSubArticulo,
            articulo.idArticulo,
            articulo.titulo,
            subarticulo.qrcode,
            subarticulo.imagen
            FROM
            subarticulo
            LEFT JOIN articulo ON subarticulo.idArticulo = articulo.idArticulo
            WHERE articulo.idArticulo = ?;`, values, (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                if (result.length > 0) {
                    res.status(200).send(result)
                } else {
                    res.status(200).send('No se encontraron subarticulos')
                }
            }
        })
        connection.end()
    })

    app.post('/articulovirtual', (req, res) => {
        const { idPropietario, filter } = req.body
        const values = [idPropietario]
        let connection = createConnection(credentials)
        connection.query(`
        select
        articulo.idArticulo,
        articulo.idEstadoArticulo,
        estado_articulo.estado as estadoArticulo,
        articulo.estadoEnvio,
        articulo.imagenRecogida,
        articulo.volumen,
        articulo.vaa,
        articulo.fechaDeInicio,
        articulo.fechaDeFin,
        articulo.qrCode,
        articulo.material,
        articulo.color,
        articulo.conservacion,
        propietario.idPropietario,
        articulo.titulo,
        articulo.descripcion,
        articulo.descripcionPropietario,
        propietario.nombre,
        propietario.apellido,
        propietario.fechaDeCorte,
        articulo.tipoArticulo,
        articulo.RALM,
        articulo.medidaLargo,
        articulo.medidaProfundidad,
        articulo.medidaAltura,
        articulo.precio
        from
        articulo
        left join estado_articulo ON articulo.idEstadoArticulo = estado_articulo.idEstadoArticulo
        left join propietario ON articulo.idPropietario = propietario.idPropietario
        where propietario.idPropietario = ?
        and articulo.estado = 'Activo' and articulo.idEstadoArticulo <> 4
        and (articulo.titulo like '%${filter}%' or articulo.descripcion like '%${filter}%' or articulo.descripcionPropietario like '%${filter}%')`,
            values, async (err, result) => {
                try {
                    if (result.length > 0) {
                        let articulos = JSON.parse(JSON.stringify(result))
    
                        articulos.forEach(el => {
                            el.fechaCorteAnterior = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 5)
                            el.dias = el.fechaDeFin === null ? (
                                new Date(el.fechaDeInicio) >= el.fechaCorteAnterior ? Math.floor((((new Date(new Date().getFullYear(), new Date().getMonth(), 5) - new Date(el.fechaDeInicio)) / 86200000) + 30)) : 30
                            ) : (
                                new Date(el.fechaDeInicio) >= el.fechaCorteAnterior ? 30 : 0
                            )
                            el.monto = parseFloat(((el.dias * el.volumen * 60) / 30).toFixed(2))
                        })
    
                        res.status(200).send(articulos)
                    } else {
                        res.status(200).send([])
                    }
    
                    connection.end()
                } catch (err) {
                    console.log(err)
                }
            })
    })
    
    app.post('/articuloPorId', (req, res) => {
        const { idArticulo } = req.body
        const values = [idArticulo]
    
        let connection = createConnection(credentials)
    
        connection.query(`
        select
        articulo.*,
        estado_articulo.estado as estadoArticulo
        from
        articulo
        left join estado_articulo ON articulo.idEstadoArticulo = estado_articulo.idEstadoArticulo
        where idArticulo = ?`,
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
}

export default initArticlesController