var ProductBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadProductsFromServer: function () {
    console.log(productid.value);
    $.ajax({
      url: "/getproduct",
      data: {
        productid: productid.value,
        productname: productname.value,
        productprice: productprice.value,
        productquantity: productquantity.value,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadProductsFromServer();
  },

  render: function () {
    return (
      <div>
        <h1>Products</h1>
        <Productform onProductSubmit={this.loadProductsFromServer} />
        <br />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Description</th>
            </tr>
          </thead>
          <ProductList data={this.state.data} />
        </table>
      </div>
    );
  },
});

var Productform = React.createClass({
  getInitialState: function () {
    return {
      productid: "",
      productname: "",
      productprice: "",
      productquantity: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var productid = this.state.productid.trim();
    var productname = this.state.productname.trim();
    var productprice = this.state.productprice.trim();
    var productquantity = this.state.productquantity.trim();

    this.props.onProductSubmit({
      productid: productid,
      productname: productname,
      productprice: productprice,
      productquantity: productquantity,
    });
  },
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Search Through Products</h2>
        <table>
          <tbody>
            <tr>
              <th>Product ID</th>
              <td>
                <input
                  type="text"
                  name="productid"
                  id="productid"
                  value={this.state.productid}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Product Name</th>
              <td>
                <input
                  name="productname"
                  id="productname"
                  value={this.state.productname}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Product Price</th>
              <td>
                <input
                  name="productprice"
                  id="productprice"
                  value={this.state.productprice}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Product Quantity</th>
              <td>
                <input
                  name="productquantity"
                  id="productquantity"
                  value={this.state.productquantity}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Product" />
      </form>
    );
  },
});
var ProductList = React.createClass({
  render: function () {
    var productNodes = this.props.data.map(function (product) {
      //map the data to individual
      return (
        <Product
          key={product.dbproduct_id}
          pdcid={product.dbproduct_id}
          pdcname={product.dbproduct_name}
          pdcprice={product.dbproduct_price}
          pdcquantity={product.dbproduct_quantity}
          pdcdescription={product.dbproduct_description}
        ></Product>
      );
    });

    //print all the nodes in the list
    return <tbody>{productNodes}</tbody>;
  },
});

var Product = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.pdcid}</td>
        <td>{this.props.pdcname}</td>
        <td>${this.props.pdcprice}</td>
        <td>{this.props.pdcquantity}</td>
        <td>{this.props.pdcdescription}</td>
      </tr>
    );
  },
});

ReactDOM.render(<ProductBox />, document.getElementById("content"));
