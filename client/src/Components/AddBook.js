import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {AuthConsumer} from '../Context/AuthContext';
import AuthContext from '../Context/AuthContext';
import {withRouter} from "react-router-dom";

class AddBook extends Component {
  constructor(props){
    super(props);
    this.state = {
      bookID:"",
      isbn:"",
      firebaseID:"",
      message:"",
      info:[]
    };
    this.setAddIsbn=this.setAddIsbn.bind(this);
    this.getBookApi=this.getBookApi.bind(this);
    this.inputChange=this.inputChange.bind(this)
  }

inputChange(e){
  //const change=e.target.value;
}

setAddIsbn(e){
  let addedIsbn=e.target.value.replace(/-/g,"")
  this.setState({isbn: addedIsbn})
}

getBookApi(){
  let newBook={
    isbn:this.state.isbn,
    firebaseID: this.context.firebaseID,
  }
  fetch(`http://localhost:5000/getbookapi/${this.state.isbn}/${this.context.firebaseID}`, {
    method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(newBook),
    })
  .then(() => {
    fetch(`http://localhost:5000/getaddedbooktitle/${newBook.isbn}/${this.context.firebaseID}`)
    .then((res) => {return res.json();})
    .then((titleJson) => {
      // console.log("++++++++++++++")
      // console.log(titleJson)
      this.setState({info:titleJson[0].title})
      this.setState({message: "¡Muy bien! Has añadido el libro "})
      
    })
    // .then(()=>{
    //   setTimeout(() => this.props.history.push('/'), 2500)
    // })
    .catch(err => {console.log(err);});
  })
}
  


render() {
  if(this.context.login==="Iniciar Sesión"){
  
    return (
      <div className="shadow bg-white mb-5">
        <a href="/" data-toggle="collapse" data-target="#addbook">
          <p className="child blue title pt-2 pl-2 mb-0">
            <span className="childIcon blue">f </span>Añadir
          </p>
        </a>

        <div id="addbook" className="collapse grey px-2 pb-2">
          <p>Necesitas iniciar sesión para poder registrar un libro:</p>
          <Link to="/login">
            <button type="text" className="btn btn-green my-2 px-2">INICIAR SESIÓN</button>
          </Link>
        </div>
      </div>  
    )}
    return (
      <AuthConsumer>
        {(contxt)=>(
          <div className="shadow bg-white mb-5">
            <a href="/" data-toggle="collapse" data-target="#addbook">
              <p className="child blue title pt-2 pl-2 mb-0">
                <span className="childIcon blue">f </span>Añadir
              </p>
            </a>
            <div id="addbook" className="collapse grey px-2 pb-2">
              <p className="black pl-2 pb-2"><span className="childIcon medium black pt-3">O </span>Busca en las primera páginas de tu libro el código ISBN e introdúcelo:</p>
              <p className="green mediumbold mb-1">{this.state.message}</p>
              <p className="greenbg white">{this.state.info}</p>
              
              <form method="POST" action="/getbookapi" className="pl-3 my-2"
                  onSubmit={(e)=>{
                  e.preventDefault();
                  this.getBookApi(contxt);
                  }}
              >
                <div>
                  <label className="mb-1 grey mini">ISBN</label>
                  <input id="addBookForm" onChange={this.setAddIsbn} type="text" placeHolder="Introduce el ISBN" name="isbn" className="p-1 mb-2 grey width100 border-blue-1"/>
                </div>
                  <input type="submit" value="AÑADIR" className="btn btn-blue mt-2" onChange={(e)=>this.inputChange(e)}></input>
              </form>
            </div>
          </div>
        )}
    </AuthConsumer>
    );
  }
}

AddBook.contextType=AuthContext;
export default withRouter(AddBook);