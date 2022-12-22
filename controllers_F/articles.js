const initArticlesController_F = () =>{
    app.post('/articulovirtualFacturacion', (req, res) => {
        const { idPropietario } = req.body
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
        and articulo.estado = 'Activo' and articulo.idEstadoArticulo <> 4`,
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
}

export default initArticlesController_F