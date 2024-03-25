// Create Product Box
var ProductBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
// Load all product items from the database
  loadProductsFromServer: function () {
    console.log(productid.value);
    $.ajax({
      url: "/getproduct",
      // Stores the data
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
  // When site is loaded, load products
  componentDidMount: function () {
    this.loadProductsFromServer();
  },
  // Render Product Box
  render: function () {
    return (
      <div>
        {/* Page Title */}
        <div className="page_title">
          <h1>Products</h1>
        </div>
        {/* Product Form */}
        <Productform onProductSubmit={this.loadProductsFromServer} />
        <br />
        <div className="result_table">
          {/* Result Table */}
        <table>
          <thead>
            <tr className="result_headers">
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
      </div>
    );
  },
});

// Search Product Form to Page
var Productform = React.createClass({
  getInitialState: function () {
    return {
      productid: "",
      productname: "",
      productprice: "",
      productquantity: "",
    };
  },
  // Handle Search Submit Button
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
  // Handle change in focus
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Render Product Search Form
  render: function () {
    return (
      <form className="form_area" onSubmit={this.handleSubmit}>
        <h2>Search Through Products</h2>
        <div className="table_area">
          <table className="form_table">
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
                    type="text"
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
                    type="text"
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
                    type="text"
                    name="productquantity"
                    id="productquantity"
                    value={this.state.productquantity}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/* Submit Search Button */}
          <input type="submit" className="form_submit" value="Search Product" />
        </div>
      </form>
    );
  },
});

// Product List of Products
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

// Product Entity to Fill Product List
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
