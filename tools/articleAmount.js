const montoArticulo = (articulo, connection) => {

	return new Promise((resolve, reject) => {
		connection.query(`
		select
		articulo.idArticulo,
		articulo.volumen,
		articulo.vaa,
		articulo.fechaDeInicio,
		articulo.fechaDeFin,
		propietario.nombre,
		propietario.apellido,
		propietario.fechaDeCorte,
		articulo.tipoArticulo,
		articulo.RALM,
		articulo.medidaLargo,
		articulo.medidaProfundidad,
		articulo.medidaAltura
		from
		articulo
		left join propietario ON articulo.idPropietario = propietario.idPropietario
		where articulo.idArticulo = ? and articulo.RALM is not null and ogl.fechaSolicitado is not null`,
			[articulo.idArticulo], async (err, result) => {
				try {
					if (result.length > 0) {
						let articulo = JSON.parse(JSON.stringify(result[0]))

						let fechaCorteAnterior = new Date(new Date(articulo.fechaDeCorte).getTime() - 2592000000)
						let dias = articulo.fechaDeFin === null ? (
							new Date(articulo.fechaDeInicio) >= fechaCorteAnterior ? Math.floor(((new Date(articulo.fechaDeCorte) - new Date(articulo.fechaDeInicio)) / 86200000) + 30) : 30
						) : (
							new Date(articulo.fechaDeInicio) >= fechaCorteAnterior ? 30 : 0
						)

						return resolve(parseFloat(((dias * articulo.volumen * 60) / 30).toFixed(2)))
					} else {
						return resolve(false)
					}
				} catch (err) {
					console.log(err)
				}
			})
	})
	connection.end()
}

export default montoArticulo