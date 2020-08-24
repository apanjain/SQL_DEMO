const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'build')));

app.use(cors());

app.get("/static/*.js", (req,res,next) => {
    req.url = req.url + ".gz";
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "text/javascript");
    next();
})

app.get('/static/*.css',(req, res, next) => {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/css');
  next();
});

app.use('/',routes);

app.use((req,res,next)=>{
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
})

app.use((err,req,res,next) => {
    res.locals.message = err.message;
    res.locals.err = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.send("error");
});

module.exports = app;