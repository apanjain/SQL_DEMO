import React, { useState, Fragment } from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import styles from './ValidationForm.module.scss';
const baseUrl = process.env.REACT_APP_BASE_URL;

const ValidationForm = () => {
  const [inputFields, setInputFields] = useState([""]);
  const [isValid, setIsValid] = useState([2]);
  const [errMsg, setErrMsg] = useState([""]);

  const handleAddFields = () => {
    const values = [...inputFields,""];
    const valids = [...isValid,2];
    const msg = [...errMsg,""];
    setInputFields(values);
    setIsValid(valids);
    setErrMsg(msg);
  };

  const handleRemoveFields = index => {
    const values = [...inputFields];
    const valids = [...isValid];
    const msg  = [...errMsg];
    values.splice(index, 1);
    valids.splice(index,1);
    msg.splice(index,1);
    setInputFields(values);
    setIsValid(valids);
    setErrMsg(msg);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index] = event.target.value;
    setInputFields(values);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const statements = JSON.stringify(inputFields);
    console.log(baseUrl);
    axios.post(baseUrl+"/api/validate_sql/",{"statement":statements})
    .then( res => {
        const data = JSON.parse(res.data.data);
        let msg=[];
        let valids=[];
        data.forEach(element => {
          valids.push(element.isValid ? 1 : 0);
          msg.push(element.err);
        });
        setErrMsg(msg);
        setIsValid(valids);
    })
    .catch(err => {
        console.log(err);
    })
    console.log("inputFields", inputFields);
  };

  return (
    <>
      <h1 className={styles.mainHead}>Validate Your SQL Statements</h1>
      <form onSubmit={handleSubmit} className={styles.mainForm}>
        <div className="form-row">
          {inputFields.map((inputField, index) => (
            <Fragment key={`${index}`}>
              <div className="form-group col-12">
                <label htmlFor="statement">{index+1}&emsp;</label><div className={isValid[index]===2 ? styles.class2 : isValid[index]===0 ? styles.class0 : styles.class1}></div>
                <input
                  type="text" 
                  className="form-control" 
                  id="statement"
                  name="statement"
                  value={inputField}
                  onChange={event => handleInputChange(index, event)}
                />
                <p>{errMsg[index]}</p>
              </div>
              <div className="form-group col">
                {(index>0) ? 
                (<button
                  className="btn btn-link"
                  type="button"
                  onClick={() => handleRemoveFields(index)}
                >
                  -
                  </button>)
                : null}
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => handleAddFields()}
                >
                  +
                </button>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="submit-button">
          <button
            className="btn btn-primary mr-2"
            type="submit"
            onSubmit={handleSubmit}
          >
            Validate
          </button>
        </div>
        <br/>
      </form>
    </>
  );
};

export default ValidationForm;

