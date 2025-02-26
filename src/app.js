import express from 'express'
import router from './routes/index.js'
import connectdb from './config/db.js' 

const app = express()

connectdb()

app.use(express.json()) //Allow reading json request body
app.use('/api', router)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
