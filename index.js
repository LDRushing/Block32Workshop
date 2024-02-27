const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db')


//app routes
app.use(express.json());
app.use(require('morgan')('dev'));
app.post('/api/flavors', async (req, res, next) => {
  try {
    const SQL = 'SELECT * from notes ORDER By ranking ASC;'
    const result = await client.query(SQL)
    res.send(result.rows)
  }catch(error){
    next(error)
  }
}); 
app.get('/api/flavors', async (req, res, next) => {
    try{
        const SQL = `SELECT * from notes ORDER BY ranking ASC;`
        const result = await client.query(SQL)
        res.send(result.rows)

    }catch(error){
        next(error)
    }
});
app.get('/api/flavors:id', async (req, res, next) => {
  try{
      const SQL = `SELECT * from notes ORDER BY ranking ASC;`
      const result = await client.query(SQL)
      res.send(result.rows)

  }catch(error){
      next(error)
  }
});

app.get('/api/flavors', async (req, res, next) => {}); 
app.get('/api/flavors/:id', async (req, res, next) => {}); 
app.put('/api/flavors/:id', async (req, res, next) => {});
app.delete('/api/flavors/:id', async (req, res, next) => {});
app.post('/api/flavors', async (req, res, next) => {}); 


//Create an async function. 
const app = express()
const init = async () => {
    await client.connect();
    console.log('connected to database');
    let SQL = `DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    ranking INTEGER DEFAULT 3 NOT NULL,
    txt VARCHAR(255) NOT NULL
    );`;
    await client.query(SQL);
    console.log('tables created');
    SQL = `
    INSERT INTO notes(txt, ranking) VALUES('learn express', 5);
    INSERT INTO notes(txt, ranking) VALUES('write SQL queries', 4);
    INSERT INTO notes(txt, ranking) VALUES('create routes', 2); `;
    await client.query(SQL);
    console.log('data seeded');

    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`listening on port ${port}`))
  };
  
  init();