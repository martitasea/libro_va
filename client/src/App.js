import React, {useState} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Table from "./Views/Table";
import 'rsuite/lib/styles/index.less'; 
// import Header from "./Views/Login";
import Login from "./Views/Login";
import Instructions from "./Views/Instructions";
import Signup from "./Views/Signup";
import Catalogue from "./Views/Catalogue";
import Bookdetail from "./Views/Bookdetail";
import Userarea from "./Views/Userarea";
import Adminarea from "./Views/Adminarea";
import {AuthProvider} from './Context/AuthContext';
import LoanTable from './Components/LoanTable';
import ReturnTable from './Components/ReturnTable';
import Header from './Components/Header';
import './App.css';


function App() {
  const [name, setName] = useState('');
  const [firebaseID, setFirebaseID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('Iniciar Sesión');
  const [err, setErr]=useState(null);
  const [isbn, setIsbn]=useState('');
  const [sidebar, setSidebar]=useState(false);

  // if(firebaseID==="6THbQtBfDDS8Cu5KNf8r9lK8IEg2"){
  //   return (
      
  //       <BrowserRouter>
  //           <Route exact path="/admin" component={Table}/>
  //       </BrowserRouter>
  //       // <Header/>
  //       //<LoanTable/>
  //       //<ReturnTable/>
 
  //       // <BrowserRouter>
  //       //   <Switch>
  //       //     <Route exact path="/" component={Table}/>
  //       //   </Switch>
  //       // </BrowserRouter>
        

  //   )
  // }
  return (
    <div className="background">
    <AuthProvider value={{
          name, setName, 
          firebaseID, setFirebaseID, 
          email, setEmail,
          password, setPassword, 
          login, setLogin, 
          err, setErr, 
          isbn, setIsbn,
          sidebar, setSidebar
          }}>
        <BrowserRouter>
          <Switch>
          <Route exact path="/admin" component={Table}/>
            <Route exact path="/" component={Catalogue}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/instructions" component={Instructions}/>
            <Route exact path="/signup" component={Signup}/>
            <Route exact path="/bookdetail" component={Bookdetail}/>
            <Route exact path="/userarea" component={Userarea}/>
            <Route exact path="/adminarea" component={Adminarea}/>
          </Switch>
      {firebaseID==="6THbQtBfDDS8Cu5KNf8r9lK8IEg2" ? <Redirect to="/admin"/> : <Redirect to="/"/>}
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
