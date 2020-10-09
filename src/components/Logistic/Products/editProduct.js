import React, { Component } from "react";
import ProductosDataService from "../../../services/productos.service";
import marcas from "../../../utils/default"

export default class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeMarca = this.onChangeMarca.bind(this);
    this.onChangeStock = this.onChangeStock.bind(this);
    this.onChangePrecio = this.onChangePrecio.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.updateProduct = this.updateProduct.bind(this);

    this.state = {
      currentProduct: {
        key: null,
        id: 0,
        codigo: "",
        descripcion: "",
        marca: "",
        precio: "",
        stock: 0,
      },

      submitted: false,
    };
  }

  componentDidMount() {
    const id = parseInt(this.props.match.params.id, 10);
    ProductosDataService.getAll()
      .orderByChild("id")
      .equalTo(id)
      .once("value", this.onDataChange);
  }

  onDataChange(items) {
    let key = Object.keys(items.val());
    let data = items.val();
    const currentProduct = data[key];
    currentProduct.key = key[0];
    this.setState({ currentProduct });
  }

  onChangeCodigo(e) {
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        codigo: e.target.value,
      },
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        descripcion: e.target.value,
      },
    });
  }

  onChangeMarca(e) {
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        marca: e.target.value,
      },
    });
  }

  onChangePrecio(e) {
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        precio: e.target.value,
      },
    });
  }

  onChangeStock(e) {
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        stock: e.target.value,
      },
    });
  }

  updateProduct() {
    const data = {
      id: this.state.currentProduct.id,
      codigo: this.state.currentProduct.codigo,
      descripcion: this.state.currentProduct.descripcion,
      stock: parseInt(this.state.currentProduct.stock, 10),
      marca: this.state.currentProduct.marca,
      precio: this.state.currentProduct.precio,
    };

    ProductosDataService.update(this.state.currentProduct.key, data)
      .then(() => {
        this.setState({
          submitted: true,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>Producto creado correctamente!</h4>
            <a
              class="btn btn-primary go-listado"
              href="/list-products"
              role="button"
            >
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
                value={this.state.currentProduct.codigo}
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
                value={this.state.currentProduct.descripcion}
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
                value={this.state.currentProduct.marca}
                onChange={this.onChangeMarca}
              >
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
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
                value={this.state.currentProduct.precio}
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
                value={this.state.currentProduct.stock}
                onChange={this.onChangeStock}
                name="stock"
              />
            </div>

            <button onClick={this.updateProduct} className="btn btn-success">
              Aceptar
            </button>
          </div>
        )}
      </div>
    );
  }
}
