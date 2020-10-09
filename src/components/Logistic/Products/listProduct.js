import React, { Component } from "react";
import ProductosDataService from "../../../services/productos.service";
import { Modal } from "antd-mobile";

const alert = Modal.alert;

export default class listClient extends Component {
  constructor(props) {
    super(props);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveProduct = this.setActiveProduct.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTurno = this.onChangeTurno.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);

    this.state = {
      products: [],
      currentProduct: null,
      currentIndex: -1,
      nombre: "",
      domicilio: "",
      dni: 0,
      productoFilter: [],
      searchTitle: "",
    };
  }

  componentDidMount() {
    ProductosDataService.getAll().orderByChild("id").on("value", this.onDataChange);
  }

  componentWillUnmount() {
    ProductosDataService.getAll().off("value", this.onDataChange);
  }

  onDataChange(items) {
    const products = [];
    items.forEach((item) => {
      let key = item.key;
      let data = item.val();
      products.push({
        key,
        id: data.id,
        codigo: data.codigo,
        descripcion: data.descripcion,
        marca: data.marca,
        stock: data.stock,
        precio: data.precio,
      });
    });

    this.setState({ products });
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  searchTitle(e) {
    const { products } = this.state;
    clearTimeout(this.timer);
    // const value = parseInt(e.target.value, 10);
    const value = e.target.value;
    // const value = this.state.searchTitle;
    this.timer = setTimeout(() => {
      if (value) {
        // ProductosDataService.getAll().orderByChild("descripcion").startAt(value)
        // // .endAt(`${value}\uf8ff`)
        // .on("child_added", function(snapshot) {
        //     console.log(snapshot.val());
        //   });
        const filter = products.filter(a => a.descripcion.toLowerCase().match(value.toLowerCase()))
        this.setState({ productoFilter: filter, searchTitle: value })

        // console.log(products.filter(a => a.descripcion.toLowerCase().match(value.toLowerCase())));
        } else {
          this.setState({ searchTitle: '' })
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
      currentProduct: null,
      currentIndex: -1,
    });
  }

  setActiveProduct(product, index) {
    this.setState({
      currentProduct: product,
      currentIndex: index,
    });
  }

  deleteProduct(key) {
    ProductosDataService.delete(key)
      .then(() => {
        console.log('ok');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { products, searchTitle, productoFilter } = this.state;
    const displayTable = searchTitle !== '' ? productoFilter : products
    return (
      <div className="list row">
        <div className="col-md-6">
          <div className="new-reservation">
            <a className="btn btn-primary" href="/products" role="button">
              Nuevo producto
            </a>
          </div>
          <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por descripción"
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
          <h4>Listado de productos</h4>
          <div className="table-container">
            <table className="table">
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
              <tbody>
                {products &&
                  displayTable.map((producto, index) => {
                    return (
                      <tr key={index}>
                        <td>{producto.codigo}</td>
                        <td>{producto.descripcion}</td>
                        <td>{producto.marca}</td>
                        <td>{producto.stock}</td>
                        <td>${producto.precio}</td>
                        <td className="column-actions">
                          <a
                            className="btn btn-light"
                            href={`/product/${producto.id}`}
                            role="button"
                          >
                            Editar
                          </a>
                          <button type="button" className="btn btn-danger"
                          onClick={() =>
                            alert('Eliminar', 'Estás seguro???', [
                              { text: 'Cancelar' },
                              { text: 'Ok', onPress: () => this.deleteProduct(producto.key) },
                            ])
                          }
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* <div className="modal fade" style={{display: "block", paddingRight: "15px"}} id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="deleteModalLabel">Eliminar producto</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        Seguro que desea eliminar este producto?
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" className="btn btn-primary">Aceptar</button>
      </div>
    </div>
  </div>
</div> */}
        </div>
      </div>
    );
  }
}
