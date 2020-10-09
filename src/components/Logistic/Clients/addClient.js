import React, { Component } from "react";
import ClientsDataService from "../../../services/clients.service";

export default class AddClient extends Component {
  constructor(props) {
    super(props);
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeDomicilio = this.onChangeDomicilio.bind(this);
    this.onChangeDni = this.onChangeDni.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.saveClient = this.saveClient.bind(this);
    this.newClient = this.newClient.bind(this);

    this.state = {
      nombre: "",
      domicilio: "",
      dni: 0,
      lastId: 0,

      submitted: false,
    };
  }

  componentDidMount() {
    ClientsDataService.getAll().orderByChild("id").limitToLast(1).once("child_added", this.onDataChange);
  }

  componentWillUnmount() {
    ClientsDataService.getAll().off("child_added", this.onDataChange);
  }

  onDataChange(items) {
    this.setState({
      lastId: items.val().id || 0,
    });
  }

  onChangeNombre(e) {
    this.setState({
      nombre: e.target.value,
    });
  }

  onChangeDomicilio(e) {
    this.setState({
      domicilio: e.target.value,
    });
  }

  onChangeDni(e) {
    this.setState({
      dni: e.target.value,
    });
  }

  saveClient() {
    let data = {
      id: this.state.lastId + 1,
      nombre: this.state.nombre,
      domicilio: this.state.domicilio,
      dni: parseInt(this.state.dni, 10),
    };

    ClientsDataService.create(data)
      .then(() => {
        this.setState({
          submitted: true,
          lastId: this.state.lastId + 1,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newClient() {
    this.setState({
      nombre: "",
      domicilio: "",
      dni: 0,

      submitted: false,
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>Cliente creado correctamente!</h4>
            <button className="btn btn-success" onClick={this.newClient}>
              Nuevo
            </button>
          </div>
        ) : (
          <div>
            <h2 className="title-page">Nuevo Cliente</h2>
            <div className="form-group">
              <label htmlFor="nombre">Nombre y Apellido</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                required
                value={this.state.nombre}
                onChange={this.onChangeNombre}
                name="nombre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="domicilio">Domicilio</label>
              <input
                type="text"
                className="form-control"
                id="domicilio"
                value={this.state.domicilio}
                onChange={this.onChangeDomicilio}
                name="domicilio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dni">DNI/CUIT</label>
              <input
                type="text"
                className="form-control"
                id="dni"
                required
                value={this.state.dni}
                onChange={this.onChangeDni}
                name="dni"
              />
            </div>

            <button onClick={this.saveClient} className="btn btn-success">
              Aceptar
            </button>
          </div>
        )}
      </div>
    );
  }
}
