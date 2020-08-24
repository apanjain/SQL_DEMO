const express = require('express');
const router = express.Router();
const SQLParser = require('sql-parser');
const viewController = require('../utils/view_controller');
const { json } = require('body-parser');
router.post('/api/validate_sql',(req,res) => {
    console.log(req.body.statement);
    var statement = JSON.parse(req.body.statement);
    var result = [];
    statement.forEach(element => {
        try{
            SQLParser.parse(element);
            result = [...result,{isValid:true, err : "No Error"}];
        }catch(err){
            result = [...result,{isValid:false, err : err.message}];
        }
    });
    return res.json({data : JSON.stringify(result)});
})
router.get('/*', viewController);
module.exports = router;