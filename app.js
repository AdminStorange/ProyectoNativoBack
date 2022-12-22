import express from 'express'
import cors from 'cors'
import { urlencoded, json } from 'body-parser'

import initLoginController from './controllers_CP/login'
import initPropietorsController from './controllers_CP/proprietors'
import initOGLController from './controllers_CP/ogl'
import initPaymensController from './controllers_CP/payments'
import initArticlesController from './controllers_CP/articles'
import initArticlesController_F from './controllers_F/articles'
// import calcularFechaFin from './tools/endDate'
// import verificarEV from './tools/verifyEV'

const app = express()
app.use(cors())
app.use(urlencoded({ extended: false }))
app.use(json({ limit: '10mb' }))
app.set('port', 3000)

//Login controller
initLoginController()

//Propietor controller
initPropietorsController()

//OGL controller
initOGLController()

//Payments controller
initPaymensController()

//Articles controller
initArticlesController()

//Articles facturation controller
initArticlesController_F()

app.listen(app.get('port'), () => console.log('Server running at port', app.get('port')))