import React, { Component } from "react";
import Datetime from "react-datetime";
import { Toast } from "antd-mobile";
import moment from "moment";
import ReservationDataService from "../../services/reservation.service";

const limitePorMesa = 6;

export default class AddReservation extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCantidad = this.onChangeCantidad.bind(this);
    this.onChangeAdentro = this.onChangeAdentro.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTurno = this.onChangeTurno.bind(this);
    this.onChangeCumple = this.onChangeCumple.bind(this);
    this.saveReserva = this.saveReserva.bind(this);
    this.saveReservaCumple = this.saveReservaCumple.bind(this);
    this.newReserva = this.newReserva.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.getMesas = this.getMesas.bind(this);
    this.obtainLastMesa = this.obtainLastMesa.bind(this);

    this.state = {
      name: "",
      adentro: false,
      mesa: 0,
      cantidad: "",
      date: moment(new Date().getTime()).format("DD-MM-YYYY"),
      turno: "turno1",
      lastId: 0,
      mesasAdentro: {},
      mesasAfuera: {},
      error: false,
      isCumple: false,
      cantidadMesas: "",

      submitted: false,
    };
  }

  componentDidMount() {
    ReservationDataService.getAll()
      .orderByChild("id")
      .limitToLast(1)
      .once("child_added", this.onDataChange);
    ReservationDataService.getAll()
      .orderByChild("mesa")
      .on("value", this.getMesas);
  }

  componentWillUnmount() {
    ReservationDataService.getAll().off("child_added", this.onDataChange);
  }

  onDataChange(items) {
    this.setState({
      lastId: items.val().id || 0,
    });
  }

  getMesas(items) {
    let reservas = [];
    items.forEach((item) => {
      let data = item.val();
      reservas.push({
        name: data.name,
        adentro: data.adentro,
        mesa: data.mesa,
        cantidad: data.cantidad,
        turno: data.turno,
        date: data.date,
      });
    });
    this.setState({
      reservas: reservas,
    });
    this.obtainLastMesa();
  }

  obtainLastMesa(fecha, turnoParam) {
    const { reservas, turno, date } = this.state;
    let lastMesaAdentro = 0;
    let lastMesaAfuera = 10;
    const turnoComp = turnoParam || turno;
    const fechaComp = fecha || date;
    reservas.forEach((item) => {
      if (item.date === fechaComp && item.turno === turnoComp) {
        lastMesaAdentro = item.adentro ? item.mesa : lastMesaAdentro;
        lastMesaAfuera = !item.adentro ? item.mesa : lastMesaAfuera;
      }
    });
    this.setState({ lastMesaAdentro, lastMesaAfuera });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeCantidad(e) {
    this.setState({
      cantidad: e.target.value,
    });
  }

  onChangeAdentro() {
    this.setState({
      adentro: !this.state.adentro,
    });
  }

  onChangeCumple() {
    this.setState({
      isCumple: !this.state.isCumple,
    });
  }

  onChangeDate(e) {
    const dateFormat = e.format("DD-MM-YYYY");
    this.setState({ date: dateFormat });
    this.obtainLastMesa(dateFormat, "");
  }

  onChangeTurno(e) {
    this.setState({ turno: e.target.value });
    this.obtainLastMesa("", e.target.value);
  }

  validationLugar(mesa) {
    if (this.state.adentro && mesa > 10) {
      return false;
    }
    if (!this.state.adentro && mesa > 55) {
      return false;
    }
    return true;
  }

  saveReserva() {
    let data = {
      id: this.state.lastId + 1,
      name: this.state.name,
      adentro: this.state.adentro,
      mesa: this.state.adentro
        ? this.state.lastMesaAdentro + 1
        : this.state.lastMesaAfuera + 1,
      cantidad: parseInt(this.state.cantidad, 10),
      date: this.state.date,
      turno: this.state.turno,
    };
    if (this.validationLugar(data.mesa)) {
      ReservationDataService.create(data)
        .then(() => {
          Toast.loading("Loading...", 1, () => {
            this.setState({
              submitted: true,
            });
          });
        })
        .catch((e) => {
          Toast.fail("Ocurrió un error !!!", 2);
        });
    } else {
      this.setState({ error: true });
    }
  }

  saveReservaCumple() {
    const promises = [];
    const cantMesasDiv = this.state.cantidad / limitePorMesa;
    const cantMesas =
      this.state.cantidad % limitePorMesa === 0
        ? Math.trunc(cantMesasDiv)
        : Math.trunc(cantMesasDiv) + 1;
    let restoMesas = this.state.cantidad;
    const nameCumple = `${this.state.name} (Cumple)`;
    for (let i = 1; i < cantMesas + 1; i++) {
      let quantity = restoMesas < limitePorMesa ? restoMesas : limitePorMesa;
      let data = {
        id: this.state.lastId + i,
        name: nameCumple,
        adentro: this.state.adentro,
        mesa: this.state.adentro
          ? this.state.lastMesaAdentro + i
          : this.state.lastMesaAfuera + i,
        cantidad: quantity,
        date: this.state.date,
        turno: this.state.turno,
      };
      restoMesas = restoMesas - limitePorMesa;
      if (this.validationLugar(data.mesa)) {
        promises.push(data);
      } else {
        this.setState({ error: true });
      }
    }

    if (cantMesas === promises.length) {
      promises.forEach((data) => {
        ReservationDataService.create(data)
          .then(() => {
            Toast.loading("Loading...", 1, () => {
              this.setState({
                submitted: true,
              });
            });
          })
          .catch((e) => {
            Toast.fail("Ocurrió un error !!!", 2);
          });
      });
    }
  }

  newReserva() {
    this.setState({
      name: "",
      adentro: false,
      mesa: 0,
      cantidad: 0,
      date: moment(new Date().getTime()).format("DD-MM-YYYY"),
      turno: "turno1",
      isCumple: false,

      submitted: false,
    });
  }

  render() {
    const textUbicacion = this.state.adentro ? "Adentro" : "Afuera";
    console.log(this.state.lastMesaAdentro, this.state.lastMesaAfuera);
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>Reserva creada correctamente!</h4>
            <button className="btn btn-success" onClick={this.newReserva}>
              Nueva
            </button>
            <a
              className="btn btn-primary go-listado"
              href="/forest/reservas"
              role="button"
            >
              Listado
            </a>
          </div>
        ) : (
          <div>
            <h4>Nueva Reserva</h4>
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <Datetime
                className="post-input  post-input__event"
                dateFormat="DD-MM-YYYY"
                timeFormat={false}
                name="eventDate"
                utc
                closeOnSelect
                value={this.state.date}
                onChange={this.onChangeDate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="turno">Turno</label>
              <select
                className="form-control"
                type="text"
                id="turno"
                placeholder="Seleccione un turno"
                name="turno"
                value={this.state.turno}
                onChange={this.onChangeTurno}
              >
                <option value="turno1">Turno 1</option>
                <option value="turno2">Turno 2</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cumple">Cumpleaños?</label>
              <input
                type="checkbox"
                className="form-control checkbox__adentro"
                id="cumple"
                required
                value={this.state.isCumple}
                onChange={this.onChangeCumple}
                name="cumple"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cantidad">Cantidad de personas</label>
              <input
                type="number"
                className="form-control"
                id="cantidad"
                required
                value={this.state.cantidad}
                onChange={this.onChangeCantidad}
                name="cantidad"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adentro">Adentro</label>
              <input
                type="checkbox"
                className="form-control checkbox__adentro"
                id="adentro"
                required
                value={this.state.adentro}
                onChange={this.onChangeAdentro}
                name="adentro"
              />
            </div>

            {this.state.error && (
              <div className="alert alert-danger" role="alert">
                Se superó la cantidad máxima de mesas para {textUbicacion}
              </div>
            )}

            <button
              onClick={
                this.state.isCumple ? this.saveReservaCumple : this.saveReserva
              }
              className="btn btn-success"
              disabled={this.state.name === "" || this.state.cantidad === ""}
            >
              Aceptar
            </button>
          </div>
        )}
      </div>
    );
  }
}
