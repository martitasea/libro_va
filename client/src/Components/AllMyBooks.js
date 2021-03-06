import React, { Component } from 'react';
import {Link} from "react-router-dom";
import AuthContext from '../Context/AuthContext';
import Book from './Book';


class AllMyBooks extends Component {
  constructor(props){
    super(props);
    this.state = {
      myBooks:[],
      message:""
    };
    this.getAllMyBooks=this.getAllMyBooks.bind(this);
  }

getAllMyBooks(){
  if(this.state.myBooks.length!==0){
    return this.state.myBooks.map((book)=>(
    <>
      <Book
      key={book.bookID}
      src={book.image}
      title={book.title}
      classIcon="prevapceptIconDelete far fa-trash-alt"
      onClick={()=>{
        fetch(`http://localhost:5000/deletebook/${book.boodID}`, {
          method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(book),
          })
          .then(()=>{
            this.setState({message:"Has borrado el libro con éxito."})  
          })
          .then(()=>{
            fetch(`http://localhost:5000/getallmybooks/${this.context.firebaseID}`)
            .then((res) => {return res.json();})
            .then(booksJson => {this.setState({myBooks:booksJson})})
            .catch(err => {console.log(err);});
          })
          }}      
      />
    </>
  ))
  } 
}

// In order to reload if book is deleted (books change)
// componentWillUpdate(prevProps, prevState){
getSnapshotBeforeUpdate(prevProps, prevState){
  if(prevState.myBooks!==this.state.myBooks){
  this.getAllMyBooks()
}
}

componentDidMount(){
  fetch(`http://localhost:5000/getallmybooks/${this.context.firebaseID}`)
    .then((res) => {return res.json();})
    .then(MyBooks => {this.setState({myBooks:MyBooks})})
    .catch(err => {console.log(err);});
}

  render() {
    if(this.context.login==="Iniciar Sesión"){
      return(
      <div className="shadow bg-white mb-3">
        <a href="/" data-toggle="collapse" data-target="#allmybooksloggedout">
          <p className="child blue title pt-2 pl-2 mb-0">
            <span className="childIcon blue">f </span>MI BIBLIOTECA
          </p>
        </a>
        <div id="allmybooksloggedout" className="collapse grey pl-2">
          <p className="grey pb-2">Tienes que iniciar sesión para poder ver tus libros.</p>
          <Link to="/login">
            <button type="text" className="btn btn-green my-2 px-2">INICIAR SESIÓN</button>
          </Link>
        </div>
    </div>  
      )
    }
    return (
      <div className="shadow bg-white mb-3">
        <a href="/" data-toggle="collapse" data-target="#allmybooksloggedin">
          <p className="child blue title pt-2 pl-2 mb-0">
            <span className="childIcon blue">f </span>MI BIBLIOTECA
          </p>
        </a>
        <div id="allmybooksloggedin" className="collapse grey pl-2">
        <p className="black pl-2"><span className="childIcon medium black pt-3">O </span>Estos son los libros de tu biblioteca:</p>
          <p className="grey pl-3 pb-2">Puedes borrarlos del catálogo haciendo click en <i className="prevapceptIconDelete far fa-trash-alt"></i>
          </p>
        <p className="ml-2 mb-2 redbg white mediumbold">{this.state.message}</p>
        <div className="d-flex flex-wrap justify-content-around">
            {this.getAllMyBooks()}
        </div>
        </div>
      </div>  
    );
  }
}

AllMyBooks.contextType=AuthContext;
export default AllMyBooks;