const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generarColumnas = async (articulo, connection) =>{
let fechaDeInicio = articulo.TipoArticulo.toLowerCase() === 'suelto' || await verificarEV(articulo.idArticulo,connection) === false ?
articulo.RALM : await verificarEV(articulo.idArticulo, connection)
let fechaDeFin = await calcularFechaFin(articulo.idArticulo, connection)

	let fecha = articulo.fechaDeInicio.replace(/[/]/g, '-').split('-').reverse().join("-")
	let newRalm = articulo.RALM.replace(/[/]/g, '-').split('-').reverse().join("-")

	let vaa = articulo.fechaDeFin === null ? articulo.Volumen : 0

	connection.query(`
	UPDATE articulo
	SET
	fechaDeInicio = ?,
	fechaDeFin = ?,
	vaa = ?
	WHERE idArticulo = ?;
	`, [fechaDeInicio, fechaDeFin, vaa, articulo.idArticulo], (err, res) =>{
		if(err) {
			console.log(res)
		} else {
			console.log("Actualizado")
		}
	})
}

let connection = mysql.createConnection(credentials)

connection.query('SELECT * from articulo', (err, result) =>{
	if(err) console.log(err)
	if(result.length > 0){
		let articulo = JSON.parse(JSON.stringify(result))

		Promise.all(articulo.map( async (el) => {
			await generarColumnas(el, connection)
		}))
	}
})