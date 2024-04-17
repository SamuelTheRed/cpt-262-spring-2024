// Create Product Box
var ProductBox = React.createClass({
  getInitialState: function () {
    return { data: [], datalog: [], viewthepage: "" };
  },
  // Load all product items from the database
  loadProductsFromServer: function () {
    console.log(productidSS.value);
    $.ajax({
      url: "/getproduct",
      // Stores the data
      data: {
        productidSS: productidSS.value,
        productnameSS: productnameSS.value,
        productpriceSS: productpriceSS.value,
        productquantitySS: productquantitySS.value,
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
  // Check Status
  loadAllowLogin: function () {
    $.ajax({
      url: "/getloggedin",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ datalog: datalog });
        this.setState({ viewthepage: this.state.datalog[0].dbuser_role });
        console.log("Logged in:" + this.state.viewthepage);
        this.loadProductsFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // On load run function
  componentDidMount: function () {
    this.loadAllowLogin();
  },
  // Render Product Box
  render: function () {
    if (this.state.viewthepage != "Manager" && this.state.viewthepage != "Assistant") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
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
    }
  },
});

// Search Product Form to Page
var Productform = React.createClass({
  getInitialState: function () {
    return {
      productidSS: "",
      productnameSS: "",
      productpriceSS: "",
      productquantitySS: "",
    };
  },
  // Handle Search Submit Button
  handleSubmit: function (e) {
    e.preventDefault();

    var productidSS = this.state.productidSS.trim();
    var productnameSS = this.state.productnameSS.trim();
    var productpriceSS = this.state.productpriceSS.trim();
    var productquantitySS = this.state.productquantitySS.trim();

    this.props.onProductSubmit({
      productidSS: productidSS,
      productnameSS: productnameSS,
      productpriceSS: productpriceSS,
      productquantitySS: productquantitySS,
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
                    name="productidSS"
                    id="productidSS"
                    value={this.state.productidSS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Product Name</th>
                <td>
                  <input
                    type="text"
                    name="productnameSS"
                    id="productnameSS"
                    value={this.state.productnameSS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Product Price</th>
                <td>
                  <input
                    type="text"
                    name="productpriceSS"
                    id="productpriceSS"
                    value={this.state.productpriceSS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Product Quantity</th>
                <td>
                  <input
                    type="text"
                    name="productquantitySS"
                    id="productquantitySS"
                    value={this.state.productquantitySS}
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
