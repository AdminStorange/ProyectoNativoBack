const montoServicios = (idPropietario, connection) => {
	let montoServicios = 0
	return new Promise((resolve, reject) => {
		connection.query(`
		select
		ogl.idOGL,
		tipo_ogl.tipo,
		tipo_ogl.precio,
		ogl.fechaSolicitado,
		articulo.idPropietario,
		propietario.fechaDeCorte
		from
		ogl
		left join tipo_ogl ON tipo_ogl.idTipoOGL = ogl.idTipoOGL
		left join articulo ON ogl.idArticulo = articulo.idArticulo
		left join propietario ON articulo.idPropietario = propietario.idPropietario
		where propietario.idPropietario = ?`,
			[idPropietario], async (err, result) => {
				try {
					let ogl = JSON.parse(JSON.stringify(result)).forEach(el => {
						if (new Date(new Date(el.fechaDeCorte).getTime() - 2592000000) < new Date(el.fechaSolicitado)
							&& new Date(el.fechaSolicitado) < new Date(el.fechaDeCorte)) montoServicios += el.precio
					})

					return resolve(montoServicios)
				} catch (err) {
					console.log(err)
				}
			})

	})
}

export default montoServicios