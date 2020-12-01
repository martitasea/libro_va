import React, { Component } from 'react';
import {Link} from "react-router-dom";
import AuthContext from '../Context/AuthContext';
import Book from './Book';

class ReadingBook extends Component {
  constructor(props){
    super(props);
    this.state = {
      books:[],
      message:""
    };
    this.getReadingBook=this.getReadingBook.bind(this);   
  }

getReadingBook(){
    return this.state.books.map((book)=>( 
      <div className="d-flex flex-row">
          <Book
        key={book.isbn}
        src={book.image}
        title={book.title}
        />
        <div className="pl-3">
          <p className="pt-3 pb-2 my-0">Tienes que devolverlo antes del:</p>
          
          <p className="heavy red pb-2"><i class="fas fa-exclamation-triangle"></i><span>  </span>{book.deathLine.slice(0,10)}</p>
          <button className="btn btn-blue" onClick={()=>{
            fetch("http://localhost:5000/updatebookphase/"+book.bookID+"/"+4)
            .then(()=>{
              this.setState({message: "Entrégalo el próximo día de cole al mostrador del AMPA"})
              })
            .catch(err => {console.log(err);});
            }  
          }>DEVOLVERLO YA</button>
          <p className="greenbg white mt-2 mr-2 mediumbold">{this.state.message}</p>
        </div>
      </div>
  ))
}

componentDidMount(){
  fetch("http://localhost:5000/getreadingbook/"+this.context.firebaseID)
    .then((res) => {return res.json();})
    .then((booksJson) => {
      this.setState({books:booksJson})
    })
    .catch(err => {console.log(err);});
  }

  render() {
    if(this.context.login==="Iniciar Sesión"){
      return(
      <div className="shadow bg-white mb-3">
        <a href="/" data-toggle="collapse" data-target="#askedbook">
          <p className="child blue title pt-2 pl-2 mb-0">
            <span className="childIcon blue">f </span>Leyendome
          </p>
        </a>
        <div id="askedbook" className="collapse grey pl-2">
          <p className="grey pb-2">Tienes que iniciar sesión para poder devolver un libro.</p>
          <Link to="/">
            <input type="text" value="INICIAR SESIÓN" className="btn btn-green my-2 px-2"/>
          </Link>
        </div>
    </div>  
      )
    }
    return (
      <div className="shadow bg-white mb-3">
      <a href="/" data-toggle="collapse" data-target="#askedbook">
        <p className="child blue title pt-2 pl-2 mb-0">
          <span className="childIcon blue">f </span>Leyendo
        </p>
      </a>
      <div id="askedbook" className="collapse grey pl-2">
        <p className="pb-2">Actualmente tienes el siguiente libro en préstamo:</p>
        {this.getReadingBook()}
      </div>
    </div>  
    );
  }
}

ReadingBook.contextType=AuthContext;
export default ReadingBook;