import React, { Component } from 'react';
import {withRouter, Link} from "react-router-dom";
import AuthContext from '../Context/AuthContext';
import { auth } from '../firebaseConfig';


class MLogin extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:"",
      email:"admin@gmail.com",
      password:"123456",
      tutorName:"",
      phone:"",
      firebaseID:"",
      login:"",
      err:"",
    };
    this.setEmail=this.setEmail.bind(this);
    this.setPassword=this.setPassword.bind(this);
  }

setEmail(e){this.setState({email: e.target.value})}
setPassword(e){this.setState({password: e.target.value})}

  render() {
    return (
          <div className="overlay-cyan">
            <section className="shadow bg-white d-flex flex-column login">
              <p className="child green title text-center my-3">Iniciar sesión</p>
              <form className="mx-3 mb-3"
                onSubmit={(e)=>{
                  e.preventDefault();
                  auth.signInWithEmailAndPassword(this.state.email, this.state.password)
                  .then((res)=> {
                    this.context.setEmail(this.state.email);
                    this.context.setFirebaseID(res.user.uid);
                    this.context.setLogin("Cerrar Sesión");
                  })
                  .then(()=>{
                    fetch(`http://localhost:5000/getusername/${this.context.firebaseID}`)
                    .then((res) => {return res.json();})
                    .then((user) => {
                      this.context.setName(user[0].name)
                      this.context.setRol(user[0].rol)
                    })
                    .then(()=>{
                      if(this.context.rol==="admin"){
                        this.props.history.push("/admin")
                      }else{
                        this.props.history.push("/userarea")
                      }                     
                     })
                    })
                  .catch((err)=>
                  {if(err.code==="auth/user-not-found")
                  {this.setState({err:"No hay ningún usuario registrado con ese correo, prueba con otro."})}
                  else if(err.code==="auth/wrong-password")
                  {this.setState({err:"Te has debido equivocar de contraseña, prueba otra vez."})}
                    console.log(err)})
                }}>
                <div>
                  <label className="mb-1 grey mini">CORREO ELECTRÓNICO</label>
                  <input onChange={this.setEmail} type="mail" className="p-1 grey width100 border-blue-1"/>
                </div>
                <div>
                  <label className="mb-1 mt-3 grey mini">CONTRASEÑA</label>
                  <input onChange={this.setPassword} type="password" id="password" className="p-1 grey width100 border-blue-1" autoComplete="new-password"/>
                  <p className="dosis mini grey mt-2">{this.state.login}</p>
                  <p className="dosis mini red mt-2">{this.state.err}</p>
                </div>
                <div className="d-flex justify-content-center mt-5 mb-2">
                  <input type="submit" value="ENTRAR" className="btn btn-green px-2"/>
                  <Link to="/signup">
                    <button className="btn btn-green-ghost">o  Registrarse</button>
                  </Link>
                </div>
              </form>
            </section>
          </div>
    );
  }
}          
MLogin.contextType=AuthContext;
export default withRouter(MLogin);