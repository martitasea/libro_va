import React, { Component } from 'react';
import Notifications from './Notifications';
import AddBook from './AddBook';
import AskedBook from './AskedBook';
import AllMyBooks from './AllMyBooks';
import {AuthConsumer} from '../Context/AuthContext';
import { auth } from '../firebaseConfig';
import {withRouter} from 'react-router-dom';

class User extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <AuthConsumer>
        {(contxt)=>(
          <div>
          <div className="d-flex  justify-content-between align-items-center margin-header mb-2">
            <p className="child blue title ml-2 mb-2">
              <span className="childIcon blue">s </span>
              Hola {contxt.name}!
              <span className="childIcon blue"> s</span>
            </p>
            <div className="d-flex justify-content-end">
              <p className="childIcon title mt-1 grey">V  </p>
              <a href="/" type="button" className="dosis medium grey mt-1 ml-1"
                onClick={(e)=>{
                  e.preventDefault();
                  auth.signOut()
                  .then((res)=> {
                    contxt.setName('');
                    contxt.setEmail('');
                    contxt.setPassword('');
                    contxt.setTutorName('');
                    contxt.setPhone('');
                    contxt.setFirebaseID('');
                    contxt.setLogin("Iniciar Sesión")
                    this.props.history.push("/");
                    console.log("Sign-out successful");
                })
                }}>{contxt.login}
                 </a>
            </div>
          </div>
          <Notifications/>
          <AskedBook/>
          <AllMyBooks/>
          <AddBook/>
        </div>
        )}
      </AuthConsumer>
    );
  }
}

export default withRouter(User);