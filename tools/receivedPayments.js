const pagosRecibidos = (idPropietario, connection) => {
	let montoPagado = 0
	return new Promise((resolve, reject) => {
		connection.query(`
		select
		pagos_recibidos.idPagosRecibidos,
		pagos_recibidos.idPropietario,
		pagos_recibidos.fechaDePago,
		pagos_recibidos.monto,
		propietario.fechaDeCorte
		from
		pagos_recibidos
		left join propietario ON pagos_recibidos.idPropietario = propietario.idPropietario
		where propietario.idPropietario = ?`,
			[idPropietario], async (err, result) => {
				try {
					let ogl = JSON.parse(JSON.stringify(result)).forEach(el => {
						if (new Date(new Date(el.fechaDeCorte).getTime() - 2592000000) < new Date(el.fechaDePago)
							&& new Date(el.fechaSolicitado) < new Date(el.fechaDePago)) montoPagado += el.monto
					})

					return resolve(montoPagado)
				} catch (err) {
					console.log(err)
				}
			})

	})
}

export default pagosRecibidos