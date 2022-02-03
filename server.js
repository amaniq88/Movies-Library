'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const axios = require('axios');
app.use(express.json());  
// DataBase
const pg = require('pg');
//const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

const PORT = process.env.PORT;

//https://api.themoviedb.org/3/trending/all/week?api_key=2f1caaaa92be3db9642884fc641f0878&language=en-US" ;
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;

const movieData = require('./MovieData/data.json');
const res = require('express/lib/response');
const { database } = require('pg/lib/defaults');
const { Client } = require('pg/lib');

///// endpoints ///server for Movies 

app.get('/', MovieViwer);
app.get('/favorite' , Helloworld );
app.get('/trending' , trendingHandler );
app.get('/search' , searchHandler );
app.get('/TV_sesons' , TV_sesonsHandler );
app.get('/TV_shows' , TV_showsHandler );


// New added routes connected with DB
app.post('/addMovie' , addMovieHandler );
app.get('/getMovies1' , getMoviesHandler );

// update and delete DB 
app.put('/UPDATE/:id' , updateHandler)
app.delete('/DELETE/:id' , DELETEHandler)
app.get('/getMovie/:id' , getMovieHandler );

///   500 internal server error
app.get('/',(req,res)=>res.send('500 error'))
app.get('/error',(req,res)=>res.send(error()))   // to test the 500 error 

app.use(errorHandler);
function errorHandler(err,req,res,text)
{
console.error(err.stack)
res.type('text/plain')
res.status(500)
res.send('Sorry, something went wrong')

}

app.get('*',notFoundHndler)

//constructor
function Movie(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
   }

   function MovieAPI(id,title,release_date,poster_path,overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
   }




function Helloworld(req,res){
    return res.status(200).send("Welcome to Favorite Page");

}


function MovieViwer(req,res){
          let FirstMovie = new Movie(movieData.title , movieData.poster_path,movieData.overview)
       return res.status(200).json(FirstMovie)
}

function notFoundHndler(req,res){
    return res.status(404).send('page not found error')
}

//  trendingHandler Function 
function trendingHandler(req,res){
    let newArr = [];
    axios.get(url)
     .then((result)=>{   
        result.data.results.forEach(Mobj =>{
            newArr.push(new MovieAPI(Mobj.id, Mobj.title, Mobj.release_date, Mobj.poster_path, Mobj.overview));
        })
        res.status(200).json(newArr);

    }).catch((err)=>{
        errorHandler(err,req,res,'page error');

    })
}
 
// searchHandler Function 
let userSearch = "=The&page=2";
function searchHandler(req,res){
    let newArr = [];
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query=${userSearch}`;
 
    axios.get(url)
    .then(result=>{
        result.data.results.forEach(Mobj =>{
            newArr.push(new MovieAPI(Mobj.id, Mobj.title, Mobj.release_date, Mobj.poster_path, Mobj.overview));
            console.log(newArr)
        })
        res.status(200).json(newArr);
     }).catch(err=>{
        errorHandler(err,req,res,'page error');

    })
}

// TV_sesonsHandler 
function TV_sesonsHandler(req,res){
    let newArr = [];
    let url = `https://api.themoviedb.org/3/movie/157336?api_key=${process.env.APIKEY}`;
    axios.get(url)
    .then(result=>{
       
        res.status(200).json(result.data);
     }).catch(err=>{
        errorHandler(err,req,res,'page error');

    })
}

// TV_shows

function TV_showsHandler(req,res){
    let newArr = [];
    let url = `https://api.themoviedb.org/3/movie/157336/videos?api_key=${process.env.APIKEY}`;
   
    axios.get(url)
    .then(result=>{
       
        res.status(200).json(result.data);
     }).catch(err=>{
        errorHandler(err,req,res,'page error');

    })
}

//  addMovieHandler  


function addMovieHandler(req,res){
    const movieobje = req.body;
    let sql = `INSERT INTO addMovieTable(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let values=[movieobje.title,movieobje.release_date,movieobje.poster_path,movieobje.overview];
    client.query(sql,values).then(data =>{
        res.status(200).json(data.rows);
    }).catch(err=>{
        errorHandler(err,req,res,'page error');
    });
  }
  
  
  function getMoviesHandler(req,res){
      let sql = `SELECT * FROM addMovieTable;`;
      client.query(sql).then(data=>{
         res.status(200).json(data.rows);
      }).catch(err=>{
        errorHandler(err,req,res,'page error');
      });
  }

// ***********************************  New added functions for Task 14 **************************************

  function updateHandler(req,res){
    const id = req.params.id;
    const Movieobjj = req.body;
    const sql = `UPDATE addMovieTable SET title =$1, release_date = $2, poster_path = $3 ,overview=$4 WHERE id=$5 RETURNING *;`; 
    let values=[Movieobjj.title,Movieobjj.release_date,Movieobjj.poster_path,Movieobjj.overview, id];
    client.query(sql,values).then(data=>{
        res.status(200).json(data.rows);
        // res.status(204)
    }).catch(err=>{
        errorHandler(err,req,res,'page error');
      });

  }

  function DELETEHandler(req,res){
    const id = req.params.id;
    const sql = `DELETE FROM addMovieTable WHERE id=${id};` 
    // DELETE FROM table_name WHERE condition;

    client.query(sql).then(()=>{
        res.status(200).send("The Recipe has been deleted");
        // res.status(204).json({});
    }).catch(err=>{
        errorHandler(err,req,res,'page error');
      });

  }

  
function getMovieHandler(req,res){

    let sql = `SELECT * FROM addMovieTable WHERE id=${req.params.id};`;

    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(err=>{
        errorHandler(err,req,res,'page error');
      });
}

client.connect().then(()=>{

    app.listen(PORT, ()=>{

      console.log('listening to port 3000')
})
})
