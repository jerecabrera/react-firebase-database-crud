import React, { Component } from "react";
import moment from "moment";
import { List, Checkbox, Toast } from "antd-mobile";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import ProductosDataService from "../../../services/productos.service";
import PedidosDataService from "../../../services/pedidos.service";

const Item = List.Item;
const Brief = Item.Brief;
const CheckboxItem = Checkbox.CheckboxItem;

export default class Pedido extends Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.setActive = this.setActive.bind(this);
    this.onChangeCantidad = this.onChangeCantidad.bind(this);
    this.onChangePeso = this.onChangePeso.bind(this);
    this.onChangeDto = this.onChangeDto.bind(this);
    this.addPedido = this.addPedido.bind(this);
    this.setInitialProduct = this.setInitialProduct.bind(this);
    this.getLastId = this.getLastId.bind(this);
    this.createPedido = this.createPedido.bind(this);

    this.state = {
      products: [],
      currentProduct: null,
      lastId: 0,
      peso: '',
      cantidad: '',
      descuento: '',
      indexActive: 0,
      pedido: {
        id: 0,
        idCliente: 0,
        idProductos: [],
        fecha: moment(new Date().getTime()).format("DD-MM-YYYY hh:mm"),
        total: 0,
      },
      searchTitle: "",
      submitted: false,
    };
  }

  componentDidMount() {
    PedidosDataService.getAll()
      .orderByChild("id")
      .limitToLast(1)
      .once("child_added", this.getLastId);
    ProductosDataService.getAll()
      .orderByChild("id")
      .on("value", this.onDataChange);
  }

  componentWillUnmount() {
    ProductosDataService.getAll().off("value", this.onDataChange);
    PedidosDataService.getAll().off("value", this.onDataChange);
  }

  onDataChange(items) {
    const products = [];
    items.forEach((item) => {
      let data = item.val();
      products.push({
        id: data.id,
        codigo: data.codigo,
        descripcion: data.descripcion,
        marca: data.marca,
        stock: data.stock,
        precio: data.precio,
      });
    });
    // console.log('lalala', this.props.match.params.id);
    this.setState({ products });
  }

  getLastId(items) {
    this.setState({ lastId: items.val().id || 0 });
    this.setInitialProduct();
  }

  setInitialProduct() {
    const lastId = this.state.lastId;
    const idCliente = parseInt(this.props.match.params.id, 10);
    this.setState({
      pedido: {
        id: lastId + 1,
        idCliente,
        idProductos: [],
        fecha: moment(new Date().getTime()).format("DD-MM-YYYY hh:mm"),
        total: 0,
      },
    });
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  searchTitle(e) {
    clearTimeout(this.timer);
    // const value = parseInt(e.target.value, 10);
    const value = e.target.value;
    // const value = this.state.searchTitle;
    this.timer = setTimeout(() => {
      if (value) {
        ProductosDataService.getAll()
          .orderByChild("descripcion")
          .startAt(value)
          // .endAt(`${value}\uf8ff`)
          .on("child_added", function (snapshot) {
            console.log(snapshot.val());
          });
      }
    }, 500);
    // this.state.clients.forEach((a) => {
    //   ;
    // })
  }

  setActive(index) {
    this.setState({ indexActive: index })
  }

  onChangeCantidad(e) {
    this.setState({ cantidad: e.target.value });
  }

  onChangeDto(e) {
    this.setState({ descuento: e.target.value });
  }

  onChangePeso(e) {
    this.setState({ peso: e.target.value });
  }

  addPedido(subtotal, idProducto) {
    this.state.pedido.idProductos.push(idProducto);
    const total = this.state.pedido.total + subtotal;

    this.setState({
      pedido: {
        ...this.state.pedido,
        total,
      },
      peso: "",
      cantidad: "",
      descuento: ""
    });
    Toast.success("Cargado correctamente!!", 1);
  }

  createPedido() {
    let data = {
      id: this.state.pedido.id,
      idCliente: this.state.pedido.idCliente,
      idProductos: this.state.pedido.idProductos,
      fecha: this.state.pedido.fecha,
      total: this.state.pedido.total,
    };
    PedidosDataService.create(data)
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
  }

  render() {
    const { products, searchTitle, indexActive, peso, descuento, cantidad } = this.state;
    return (
      <div className="list row">
        {this.state.submitted ? (
          <div>
            <h4>Pedido creado correctamente!</h4>
            <a
              class="btn btn-primary go-listado"
              href="/list-client"
              role="button"
            >
              Nuevo Pedido
            </a>
          </div>
        ) : (
          <div className="col-md-6">
            {/* <div className="new-reservation">
            <a className="btn btn-primary" href="/products" role="button">
              Nuevo producto
            </a>
          </div> */}
            <div className="col-md-8">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por descripción"
                  // value={searchTitle}
                  onChange={this.searchTitle}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.searchTitle}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>
            <h4>Pedido </h4>

            <div className="table-container pedido">
              {/* <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Marca</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody> */}
              {products &&
                products.map((producto, index) => {
                  const subtotal =
                    producto.precio * peso * cantidad;
                  const subtotalDto =
                    subtotal - (subtotal * descuento) / 100;
                  return (
                    <List className="my-list" key={index}>
                      {/* <CheckboxItem key={producto.id}> */}
                      <Item multipleLine onClick={ (e) => {
                        e.preventDefault();
                        this.setActive(index);
                      }} 
                      wrap>
                        <div className="prod__description-container">
                          <span className="prod__description">
                            {producto.descripcion}{" "}
                          </span>
                          <Brief>{producto.marca}</Brief>
                          <span className="prod__codigo-text">
                            #{producto.codigo}
                          </span>
                          <span className="am-list-extra precio">
                            ${producto.precio}
                          </span>
                          <span className="prod__stock-text">
                            S: {producto.stock}
                          </span>
                          <TextField
                            id="standard-read-only-input"
                            className="prod__subtotal"
                            label="Subtotal"
                            // defaultValue={subtotal}
                            value={indexActive === index ? subtotalDto.toFixed(2) : 0.00}
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>

                        <div className="prod__codigo-container">
                          {/* <form
                        className="form-group"
                        noValidate
                        autoComplete="off"
                      > */}
                          <TextField
                            id="standard-start-adornment"
                            // className={clsx(classes.margin, classes.textField)}
                            type="number"
                            onChange={this.onChangePeso}
                            value={indexActive === index ? peso : ""}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  Kg
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            id="standard-basic"
                            label="Cantidad"
                            type="number"
                            value={indexActive === index ? cantidad : ""}
                            onChange={this.onChangeCantidad}
                          />
                          <TextField
                            id="standard-basic"
                            label="Dto"
                            type="number"
                            value={indexActive === index ? descuento : ""}
                            onChange={this.onChangeDto}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                          />
                          {/* </form> */}
                          {/* <TextareaItem placeholder="Kg" />
                      <TextareaItem placeholder="Cant." />
                      <TextareaItem placeholder="Dto" /> */}
                          {/* <span className="am-list-extra">${producto.precio}</span> */}
                        </div>
                        <div className="prod__button-container">
                          <Button
                            className="prod__button-add"
                            variant="contained"
                            onClick={(e) => {
                              e.preventDefault();
                              this.addPedido(subtotalDto, producto.id);
                            }}
                            disabled={
                              indexActive !== index ||
                              peso === "" ||
                              cantidad === ""
                            }
                          >
                            Agregar
                          </Button>
                        </div>
                      </Item>
                      {/*            
        <Item multipleLine extra={`$${producto.precio}`} wrap>
          <div className="prod__codigo-container">
            <span className="prod__codigo-text">{producto.codigo}</span></div>
                  <div className="prod__description-container"> {producto.descripcion} <Brief>{producto.marca}</Brief></div>
        </Item> */}
                      {/* </CheckboxItem> */}
                    </List>
                  );
                })}
            </div>
            <div role="region" class="total-banner">
              <p class="total__text">
                Total: $ {this.state.pedido.total.toFixed(2)}
              </p>
              <Button
                variant="contained"
                color="primary"
                className="total__button"
                onClick={this.createPedido}
              >
                Finalizar pedido
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
