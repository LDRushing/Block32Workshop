const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_flavors_db')
const express = require('express')
const app = express()

// parse the body into JS Objects
app.use(express.json())

// Log the requests as they come in
app.use(require('morgan')('dev'))

// Create Notes - C


// Read Notes - R
app.get('/api/flavors', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from flavors ORDER BY created_at DESC;
    `
    const response = await client.query(SQL)
    res.send(response.rows)
  } catch (ex) {
    next(ex)
  }
})

app.get('/api/flavors/:id', async (req, res, next) => { //Selects a specific flavor. 
  try { 
    const {params} = req //req >> Request, response, next
    console.log(params);
    const {id} = params //destructuring params.id. 
    const SQL = `
      SELECT * from flavors where id = ${id}; 
    `
    const response = await client.query(SQL)
    res.send(response.rows)
  } catch (ex) {
    next(ex)
  }
})

app.post('/api/flavors', async (req, res, next) => {
  try {
    const SQL = `
      INSERT INTO flavors(flavor)
      VALUES($1)
      RETURNING *
    `
    const response = await client.query(SQL, [req.body.flavor])
    res.send(response.rows[0])
  } catch (ex) {
    next(ex)
  }
})

// Delete Notes - D
app.delete('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = `
      DELETE from flavors
      WHERE id = $1
    `
    const response = await client.query(SQL, [req.params.id])
    res.sendStatus(204)
  } catch (ex) {
    next(ex)
  }
})

// Update Notes - U
app.put('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = `
      UPDATE flavors
      SET flavor=$1, ranking=$2, updated_at= now()
      WHERE id=$3 RETURNING *
    `
    const response = await client.query(SQL, [req.body.flavor, req.body.ranking, req.params.id]) // << We send the flavor and ranking, but we put the params into the URL. The ranking helps us understand what the method actually does. 
    res.send(response.rows[0])
  } catch (ex) {
    next(ex)
  }
})

// create and run the express app

const init = async () => {
  await client.connect()
  let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      ranking INTEGER DEFAULT 3 NOT NULL,
      flavor VARCHAR(255) NOT NULL
    );
  `
  await client.query(SQL)
  console.log('tables created')
 SQL = `
    INSERT INTO flavors(flavor, ranking) VALUES('vanilla', 1);
    INSERT INTO flavors(flavor, ranking) VALUES('chocolate', 2);
    INSERT INTO flavors(flavor, ranking) VALUES('strawberry', 3);
  `
  await client.query(SQL)
  console.log('data seeded')
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`listening on port ${port}`))
}

init()