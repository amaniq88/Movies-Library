const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const movieData = require('./MovieData/data.json');
const res = require('express/lib/response');

///// endpoints ///server for Movies 

app.get('/', MovieViwer);
app.get('/favorite' , Helloworld );
///   500 internal server error
app.get('/',(req,res)=>res.send('500 error'))

app.get('/error',(req,res)=>res.send(error()))   // to test the 500 error 

app.use(function(err,req,res,text){
console.error(err.stack)
res.type('text/plain')
res.status(500)
res.send('Sorry, something went wrong')

})

app.get('*',notFoundHndler)

//constructor
function Movie(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
   }




function Helloworld(req,res){
    return res.status(200).send("Welcome to Favorite Page");

}


function MovieViwer(req,res){
          let FirstMovie = new Movie(movieData.title , movieData.poster_path,movieData.overview)
   
    //console.log(FirstMovie)
    return res.status(200).json(FirstMovie)
}

function notFoundHndler(req,res){
    return res.status(404).send('page not found error')
}


app.listen(3000, ()=>{

    console.log('listening to port 3000')
})
