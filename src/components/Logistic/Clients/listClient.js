import React, { Component } from "react";
import Datetime from "react-datetime";
import ClientsDataService from "../../../services/clients.service";

export default class listClient extends Component {
  constructor(props) {
    super(props);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTurno = this.onChangeTurno.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    // this.filterReservations = this.filterReservations.bind(this);

    this.state = {
      clients: [],
      currentTutorial: null,
      currentIndex: -1,
      nombre: "",
      domicilio: "",
      dni: 0,
      reservaFilter: [],
      searchTitle: "",
    };
  }

  componentDidMount() {
    ClientsDataService.getAll().orderByChild("id").on("value", this.onDataChange);
  }

  componentWillUnmount() {
    ClientsDataService.getAll().off("value", this.onDataChange);
  }

  onDataChange(items) {
    let clients = [];
    items.forEach((item) => {
      let data = item.val();
      let key = item.key;
      clients.push({
        key,
        id: data.id,
        nombre: data.nombre,
        domicilio: data.domicilio,
        dni: data.dni,
      });
    });

    this.setState({ clients });
    // this.filterReservations();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle.toLowerCase(),
    });
  }

  searchTitle() {
    clearTimeout(this.timer);
    // const value = parseInt(e.target.value, 10);
    // const value = e.target.value;
    const value = this.state.searchTitle;
    this.timer = setTimeout(() => {
      if (value) {
        ClientsDataService.getAll().orderByChild("nombre").startAt(value)
        // .endAt(`${value}\uf8ff`)
        .on("value", function(snapshot) {
            console.log(snapshot.val());
          });
        }
      }, 500);
    // this.state.clients.forEach((a) => {
    //   ;
    // })
  }

  // filterReservations(fecha, turnoParam) {
  //   const { clients, turno, date } = this.state;
  //   let reserva = [];
  //   let cantAdentro = 0;
  //   let cantAfuera = 0;
  //   const turnoComp = turnoParam || turno;
  //   const fechaComp = fecha || date;
  //   clients.forEach((item) => {
  //     if (item.date === fechaComp && item.turno === turnoComp) {
  //       reserva.push(item);
  //       cantAdentro = item.adentro ? cantAdentro + 1 : cantAfuera + 1;
  //     }
  //   });
  //   this.setState({ reservaFilter: reserva, cantAdentro, cantAfuera });
  // }

  onChangeDate(e) {
    const dateFormat = e.format("DD-MM-YYYY");
    this.setState({ date: dateFormat });
    // this.filterReservations(dateFormat, "");
  }

  onChangeTurno(e) {
    this.setState({ turno: e.target.value });

    // this.filterReservations("", e.target.value);
  }

  refreshList() {
    this.setState({
      currentTutorial: null,
      currentIndex: -1,
    });
  }

  setActiveTutorial(tutorial, index) {
    this.setState({
      currentTutorial: tutorial,
      currentIndex: index,
    });
  }

  removeAllTutorials() {
    ClientsDataService.deleteAll()
      .then(() => {
        this.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { clients, searchTitle } = this.state;
    return (
      <div className="list row">
        <div className="col-md-6">
          <div className="new-reservation">
            <a className="btn btn-primary" href="/clients" role="button">
              Nuevo cliente
            </a>
          </div>
          <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
          <h4>Listado de clientes</h4>
          <div className="table-container">
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Dirección</th>
                  <th scope="col">DNI</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients &&
                  clients.map((cliente, index) => {
                    return (
                      <tr key={index}>
                        <td>{cliente.id}</td>
                        <td><a href={`/pedido/${cliente.id}`}>{cliente.nombre}</a></td>
                        <td>{cliente.domicilio}</td>
                        <td>{cliente.dni}</td>
                        <td className="column-actions">
                          <a
                            className="btn btn-light"
                            href={`/client/${cliente.id}`}
                            role="button"
                          >
                            Editar
                          </a>
                          <button type="button" className="btn btn-danger">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
