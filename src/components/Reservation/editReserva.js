import React, { Component } from "react";
import Datetime from "react-datetime";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import moment from "moment";
import ReservationDataService from "../../services/reservation.service";

export default class AddReservation extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeMesa = this.onChangeMesa.bind(this);
    this.onChangeCantidad = this.onChangeCantidad.bind(this);
    this.onChangeAdentro = this.onChangeAdentro.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTurno = this.onChangeTurno.bind(this);
    this.updateReserva = this.updateReserva.bind(this);
    this.newReserva = this.newReserva.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.getMesas = this.getMesas.bind(this);
    this.obtainLastMesa = this.obtainLastMesa.bind(this);

    this.state = {
      currentReserva: {
        key: null,
        id: 0,
        name: "",
        adentro: false,
        mesa: 0,
        cantidad: "",
        date: moment(new Date().getTime()).format("DD-MM-YYYY"),
        turno: "turno1",
      },
      mesasAdentro: {},
      mesasAfuera: {},
      error: {
        value: false,
        message: '',
      },

      submitted: false,
    };
  }

  componentDidMount() {
    const id = parseInt(this.props.match.params.id, 10);
    ReservationDataService.getAll()
      .orderByChild("id")
      .equalTo(id)
      .once("value", this.onDataChange);
    ReservationDataService.getAll().orderByChild("mesa").on("value", this.getMesas);
  }

  componentWillUnmount() {
    ReservationDataService.getAll().off("child_added", this.onDataChange);
  }

  onDataChange(items) {
    let key = Object.keys(items.val());
    let data = items.val();
    const currentReserva = data[key];
    currentReserva.key = key[0];
    this.setState({ currentReserva });
  }

  getMesas(items) {
    const { currentReserva } = this.state
    let reservas = [];
    items.forEach((item) => {
      let data = item.val();
      if (data.turno === currentReserva.turno && data.date === currentReserva.date) {
        reservas.push({
          name: data.name,
          adentro: data.adentro,
          mesa: data.mesa,
          cantidad: data.cantidad,
          turno: data.turno,
          date: data.date,
        });
      }
    });
    this.setState({
      reservas,
    });
  }

  obtainLastMesa(fecha, turnoParam) {
    const { reservas, turno, date } = this.state;
    // let reserva = [];
    let lastMesaAdentro = 0;
    let lastMesaAfuera = 11;
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
      currentReserva: {
        ...this.state.currentReserva,
        name: e.target.value,
      },
    });
  }

  onChangeMesa(e) {
    this.setState({
      currentReserva: {
        ...this.state.currentReserva,
        mesa: e.target.value,
      },
      error: {
        value: false,
        message: '',
      },
    });
  }

  onChangeCantidad(e) {
    this.setState({
      currentReserva: {
        ...this.state.currentReserva,
        cantidad: e.target.value,
      },
    });
  }

  onChangeAdentro(e) {
    this.setState({
      currentReserva: {
        ...this.state.currentReserva,
        adentro: !this.state.currentReserva.adentro,
      },
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
    if (this.state.currentReserva.adentro && mesa > 10) {
      this.setState({ error: {value: true, message: 'Número de mesa no corresponde para Adentro'} });
      return false;
    }
    if (!this.state.currentReserva.adentro && mesa > 55) {
      this.setState({ error: {value: true, message: 'Número de mesa no corresponde para Afuera'} });
      return false;
    }

    if (this.state.reservas.filter(res => res.mesa === mesa).length > 0) {
      this.setState({ error: {value: true, message: 'Ya existe otra reserva con ese Nº de mesa'} });
      return false;
    }

    return true;
  }

  saveReserva() {
    // console.log(this.state.mesasAdentro.filter(a => a.date === this.state.date && a.turno === this.state.turno))
    console.log(this.state.lastMesaAdentro, this.state.lastMesaAfuera);
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
          console.log("Created new item successfully!");
          this.setState({
            submitted: true,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      this.setState({ error: true });
    }
  }

  updateReserva() {
    const data = {
      id: this.state.currentReserva.id,
      name: this.state.currentReserva.name,
      mesa: parseInt(this.state.currentReserva.mesa, 10),
      cantidad: parseInt(this.state.currentReserva.cantidad, 10),
      date: this.state.currentReserva.date,
      turno: this.state.currentReserva.turno,
    };

    if (this.validationLugar(data.mesa)) {
      ReservationDataService.update(this.state.currentReserva.key, data)
        .then(() => {
          this.setState({
            submitted: true,
            error: {
              value: false,
              message: '',
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  newReserva() {
    this.setState({
      name: "",
      adentro: false,
      mesa: 0,
      cantidad: 0,

      submitted: false,
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>Reserva editada correctamente!</h4>
            <a className="btn btn-success"  href="/forest/reservation" role="button">
              Nueva Reserva
            </a>
            <a className="btn btn-primary go-listado" href="/forest/reservas" role="button">
              Listado
            </a>
          </div>
        ) : (
          <div>
            <h4>Editar Reserva</h4>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Fecha"
                value={this.state.currentReserva.date}
                disabled
              />
            </div>

            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Turno"
                value={this.state.currentReserva.turno}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.currentReserva.name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                className="form-control"
                id="cantidad"
                required
                value={this.state.currentReserva.cantidad}
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
                value={this.state.currentReserva.adentro}
                checked={this.state.currentReserva.adentro}
                onChange={this.onChangeAdentro}
                name="adentro"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adentro">Mesa</label>
              <input
                type="number"
                className="form-control"
                id="mesa"
                required
                value={this.state.currentReserva.mesa}
                onChange={this.onChangeMesa}
                min={this.state.currentReserva.adentro ? 1 : 11}
                max={this.state.currentReserva.adentro ? 10 : 55}
                name="mesa"
              />
            </div>

            {this.state.error.value && (
              <div className="alert alert-danger" role="alert">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.updateReserva}
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
