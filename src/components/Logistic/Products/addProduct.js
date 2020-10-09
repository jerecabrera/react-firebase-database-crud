import React, { Component } from "react";
import ProductosDataService from "../../../services/productos.service";
import marcas from "../../../utils/default"

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeMarca = this.onChangeMarca.bind(this);
    this.onChangeStock = this.onChangeStock.bind(this);
    this.onChangePrecio = this.onChangePrecio.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.saveClient = this.saveClient.bind(this);
    this.newClient = this.newClient.bind(this);

    this.state = {
      codigo: "",
      descripcion: "",
      marca: "Windy",
      precio: "",
      stock: 0,
      lastId: 0,

      submitted: false,
    };
  }

  componentDidMount() {
    ProductosDataService.getAll()
      .orderByChild("id")
      .limitToLast(1)
      .once("child_added", this.onDataChange);
  }

  componentWillUnmount() {
    ProductosDataService.getAll().off("child_added", this.onDataChange);
  }

  onDataChange(items) {
    this.setState({
      lastId: items.val().id || 0,
    });
    console.log(items.val().id );
  }

  onChangeCodigo(e) {
    this.setState({
      codigo: e.target.value,
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      descripcion: e.target.value,
    });
  }

  onChangeMarca(e) {
    this.setState({ marca: e.target.value });
  }

  onChangePrecio(e) {
    this.setState({ precio: e.target.value });
  }

  onChangeStock(e) {
    this.setState({
      stock: e.target.value,
    });
  }

  saveClient() {
    let data = {
      id: this.state.lastId + 1,
      codigo: this.state.codigo,
      descripcion: this.state.descripcion,
      stock: parseInt(this.state.stock, 10),
      marca: this.state.marca,
      precio: this.state.precio,
    };

    ProductosDataService.create(data)
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
      codigo: "",
      descripcion: "",
      stock: 0,
      marca: "Windy",
      precio: "",
      lastId: this.state.lastId,

      submitted: false,
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>Producto creado correctamente!</h4>
            <button className="btn btn-success" onClick={this.newClient}>
              Nuevo
            </button>
            <a class="btn btn-primary go-listado" href="/list-products" role="button">
              Listado
            </a>
          </div>
        ) : (
          <div>
            <h2 className="title-page">Nuevo producto</h2>
            <div className="form-group">
              <label htmlFor="codigo">Código</label>
              <input
                type="text"
                className="form-control"
                id="codigo"
                required
                value={this.state.codigo}
                onChange={this.onChangeCodigo}
                name="codigo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <input
                type="text"
                className="form-control"
                id="descripcion"
                value={this.state.descripcion}
                onChange={this.onChangeDescripcion}
                name="descripcion"
              />
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <select
                className="form-control"
                type="text"
                id="marca"
                placeholder="Seleccione una marca"
                name="marca"
                value={this.state.marca}
                onChange={this.onChangeMarca}
              >
                {marcas.map(marca => 
                  <option key={marca} value={marca}>{marca}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio</label>
              <input
                type="text"
                className="form-control"
                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                data-type="currency"
                id="precio"
                required
                value={this.state.precio}
                onChange={this.onChangePrecio}
                name="precio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                data-type="number"
                required
                value={this.state.stock}
                onChange={this.onChangeStock}
                name="stock"
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
