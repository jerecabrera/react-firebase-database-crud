import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Drawer, Button } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datetime/css/react-datetime.css";
import "./App.scss";
import 'antd-mobile/dist/antd-mobile.css'

import AddTutorial from "./components/add-tutorial.component";
import TutorialsList from "./components/tutorials-list.component";

//Login
import SignIn from "./components/Login/SignIn";
import SignUp from "./components/Login/SignUp";
import Profile from "./components/Login/Profile";
// Forest
import ReservasList from "./components/Reservation/reservaList";
import Reservation from "./components/Reservation/add-reservation";
import EditReserva from "./components/Reservation/editReserva";
// Windy
import AddClient from "./components/Logistic/Clients/addClient";
import ListClient from "./components/Logistic/Clients/listClient";
import AddProduct from "./components/Logistic/Products/addProduct";
import ListProduct from "./components/Logistic/Products/listProduct";
import EditProduct from "./components/Logistic/Products/editProduct";
import Pedido from "./components/Logistic/Pedido/pedido";
import FooterView from "./components/FooterView";
class App extends Component {
  render() {
    const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
    };
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            TopTec
          </a>
          <div className="navbar-nav mr-auto">
          {/* <Button onClick={toggleDrawer('left', true)}>{'left'}</Button> */}
    {/* <Drawer anchor={'left'} open={toggleDrawer('left', true)} onClose={toggleDrawer('left', false)}>
      {'left'}
    </Drawer> */}
            {/* <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Reservas
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#">Action</a>
                <Link to={"/reservas"} className="dropdown-item nav-link">
                  Listado de reservas
                </Link>
                <Link to={"/reservation"} className="nav-link">
                  Nueva reserva
                </Link>
              </div>
            </li> */}
            {/* <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li> */}
            {/* <li className="nav-item">
              <Link to={"/reservas"} className="nav-link">
                Listado de reservas
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/reservation"} className="nav-link">
                Nueva reserva
              </Link>
            </li> */}

            {/* <li className="nav-item">
              <Link to={"/client"} className="nav-link">
                Nuevo cliente
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/list-client"} className="nav-link">
                Listado de clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/products"} className="nav-link">
                Nuevo Producto
              </Link>
            </li> */}
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/tutorials"]} component={TutorialsList} />
            <Route exact path="/add" component={AddTutorial} />
            <Route exact path="/login" component={SignIn} />
            <Route exact path="/register" component={SignUp} />
            <Route exact path="/profile" component={Profile} />

            {/* Forest */}
            <Route exact path={["/", "/forest/reservas"]} component={ReservasList} />
            <Route exact path="/forest/reservation" component={Reservation} />
            <Route exact path="/forest/reserva/:id" component={EditReserva} />

            {/* Windy */}
            <Route exact path="/client" component={AddClient} />
            <Route exact path="/list-client" component={ListClient} />
            <Route exact path="/products" component={AddProduct} />
            <Route exact path="/product/:id" component={EditProduct} />
            <Route exact path="/list-products" component={ListProduct} />
            <Route exact path="/pedido/:id" component={Pedido} />
            {/* <Route exact path="/reservation" component={Reservation} /> */}
          </Switch>
        </div>
        {/* <FooterView /> */}
      </div>
    );
  }
}

export default App;
