const calcularFechaFin = (idArticulo, connection) => {
	return new Promise((resolve, reject) => {
		connection.query(`
		select
		detalle_ogl.idDetalleOGL,
		articulo.titulo,
		articulo.idArticulo,
		propietario.idPropietario,
		propietario.nombre,
		propietario.fechaDeCorte,
		servicio.fechaServicio,
        ogl.idOGL,
        ogl.idTipoOGL,
		tipo_ogl.descripcion,
		tipo_ogl.precio
		from
		detalle_ogl
        left join ogl ON detalle_ogl.idOGL = ogl.idOGL
        left join servicio ON servicio.idServicio = ogl.idServicio
        left join tipo_ogl ON tipo_ogl.idTipoOGL = ogl.idTipoOGL
		left join articulo ON detalle_ogl.idArticulo = articulo.idArticulo
		left join propietario ON propietario.idPropietario = articulo.idPropietario
		where articulo.idArticulo = ? and
		(tipo_ogl.idTipoOGL = 'oi2fubgo'or
		tipo_ogl.idTipoOGL = 'o0iytq9i' or
		tipo_ogl.idTipoOGL = 'ft5qtczg')`, [idArticulo], (err, result) => {
			try {
				if (result.length > 0) {
					let ogl = JSON.parse(JSON.stringify(result)).map((el) => el.fechaServicio)
					return resolve(ogl[0].substring(0, 10))
				} else return resolve(null)
			} catch (err) {
				console.log(err)
			}
		})
	})
}

export default calcularFechaFin