import React, { Component } from 'react';
import {Link, Redirect} from "react-router-dom";
import AuthContext from '../Context/AuthContext';
import Book from './Book';

class AskedBooks extends Component {
  constructor(props){
    super(props);
    this.state = {
      books:[], 
      message1:"",
      message2:"",
      message3:"",
      info:""
    };
    this.getAskedBooks=this.getAskedBooks.bind(this);
  }

getAskedBooks(){
    return this.state.books.map((book)=>(
      <Book
      key={book.isbn}
      src={book.image}
      title={book.title}
      classIcon="prevapceptIconOK fas fa-check-square"
      onClick={()=>{
        fetch("http://localhost:5000/updatebookphase/"+book.bookID+"/"+2)
        .then(()=>{
          fetch("http://localhost:5000/getbooktitle/"+book.bookID)
          .then((res)=>{return res.json();})
          .then((titleJson)=>{
            this.setState({info:titleJson[0].title, message1: "Se ha confirmado el préstamo del libro: ", message2: " Entrégalo el próximo día de cole en el AMPA", message3:<i class="fas fa-exclamation-triangle"></i>})
          })
        })
        .then(()=>{
          fetch("http://localhost:5000/getaskedbooks/"+this.context.firebaseID)
          .then((res) => {return res.json();})
          .then(booksJson => {this.setState({books:booksJson})})
          .catch(err => {console.log(err);});
        })
        .catch(err => {console.log(err);});
      }
    }/>
  ))
}
// In order to reload if book is loaned (books change)
componentWillUpdate(prevProps, prevState){
  if(prevState.books!==this.state.books){
  this.getAskedBooks()
}
}

componentDidMount(){
  fetch("http://localhost:5000/getaskedbooks/"+this.context.firebaseID)
    .then((res) => {return res.json();})
    .then(booksJson => {this.setState({books:booksJson})})
    .catch(err => {console.log(err);});
}

  render() {
    if(this.context.login==="Iniciar Sesión"){
      return(
      <div className="shadow bg-white mb-3">
        <a href="/" data-toggle="collapse" data-target="#notificationsloggedout">
          <p className="child blue title pt-2 pl-2 mb-0">
            <span className="childIcon blue">f </span>Préstamos
          </p>
        </a>
        <div id="notificationsloggedout" className="collapse grey pl-2">
          <p className="grey pb-2">Tienes que iniciar sesión para poder ver los libros pendientes de préstamo.</p>
          <Link to="/">
            <input type="text" value="INICIAR SESIÓN" className="btn btn-green my-2 px-2"/>
          </Link>
        </div>
    </div>  
      )
    }
    return (
      <div className="shadow bg-white mb-3">
      <a href="/" data-toggle="collapse" data-target="#notificationsloggedin">
        <p className="child blue title pt-2 pl-2 mb-0">
          <span className="childIcon blue">f </span>Préstamos
        </p>
      </a>
      <div id="notificationsloggedin" className="collapse grey pl-2">
        <p className="grey pl-2">Te han pedido prestados los siguientes libros: </p>
        <p className="grey pl-2 pt-1 pb-2">Para confirmar el préstamo haz click en <i class="prevapceptIconOK fas fa-check-square"></i></p>
        <p className="greenbg white px-2 mb-2">{this.state.message1}{this.state.info}</p>
        <p className="redbg white px-2 mb-2"><span>{this.state.message3}</span>{this.state.message2}</p>
      <div className="d-flex flex-wrap justify-content-around">
        {this.getAskedBooks()}
      </div>
      </div>
    </div>  
    );
  }
}

AskedBooks.contextType=AuthContext;
export default AskedBooks;