var ProductBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
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
  updateSinglePdcFromServer: function (product) {
    $.ajax({
      url: "/updatesinglepdc",
      dataType: "json",
      data: product,
      type: "POST",
      cache: false,
      success: function (upsingledata) {
        this.setState({ upsingledata: upsingledata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },
  componentDidMount: function () {
    this.loadProductsFromServer();
    // setInterval(this.loadProductsFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <h1>Update Products</h1>
        <Productform onProductSubmit={this.loadProductsFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <ProductList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <ProductUpdateform
              onUpdateSubmit={this.updateSinglePdcFromServer}
            />
          </div>
        </div>
      </div>
    );
  },
});

var Productform = React.createClass({
  getInitialState: function () {
    return {
      productnameSS: "",
      productdescriptionSS: "",
      productpriceSS: "",
      productquantitySS: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var productnameSS = this.state.productnameSS.trim();
    var productdescriptionSS = this.state.productdescriptionSS.trim();
    var productpriceSS = this.state.productpriceSS.trim();
    var productquantitySS = this.state.productquantitySS.trim();

    this.props.onProductSubmit({
      productnameSS: productnameSS,
      productdescriptionSS: productdescriptionSS,
      productpriceSS: productpriceSS,
      productquantitySS: productquantitySS,
    });
  },
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <div>
        <div id="theform">
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
              <input
                type="submit"
                className="form_submit"
                value="Search Product"
              />
            </div>
          </form>
        </div>
        <div>
          <br />
          <form onSubmit={this.getInitialState}>
            <input type="submit" value="Clear Form" />
          </form>
        </div>
      </div>
    );
  },
});

var ProductUpdateform = React.createClass({
  getInitialState: function () {
    return {
        upproductidSS: "",
        upproductnameSS: "",
        upproductdescriptionSS: "",
        upproductpriceSS: "",
        upproductquantitySS: "",
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upproductidSS = uppdcidSS.value;
    var upproductnameSS = uppdcnameSS.value;
    var upproductdescriptionSS = uppdcdescriptionSS.value;
    var upproductpriceSS = uppdcpriceSS.value;
    var upproductquantitySS = uppdcquantitySS.value;

    this.props.onUpdateSubmit({
        upproductidSS: upproductidSS,
        upproductnameSS: upproductnameSS,
        upproductdescriptionSS: upproductdescriptionSS,
        upproductpriceSS: upproductpriceSS,
        upproductquantitySS: upproductquantitySS,
    });
  },
  handleUpChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <div>
        <div id="theform">
          <form onSubmit={this.handleUpSubmit}>
            <table>
              <tbody>
              <tr>
                <th>Product Name</th>
                <td>
                  <input
                    type="text"
                    name="uppdcnameSS"
                    id="uppdcnameSS"
                    value={this.state.uppdcnameSS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Product Description</th>
                <td>
                  <input
                    type="text"
                    name="uppdcdescriptionSS"
                    id="uppdcdescriptionSS"
                    value={this.state.uppdcdescriptionSS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Product Price</th>
                <td>
                  <input
                    type="text"
                    name="uppdcpriceSS"
                    id="uppdcpriceSS"
                    value={this.state.uppdcpriceSS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Product Quantity</th>
                <td>
                  <input
                    type="text"
                    name="uppdcquantitySS"
                    id="uppdcquantitySS"
                    value={this.state.uppdcquantitySS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="uppdcidSS"
              id="uppdcidSS"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Product" />
          </form>
        </div>
      </div>
    );
  },
});

var ProductList = React.createClass({
  render: function () {
    var productNodes = this.props.data.map(function (product) {
      return (
        <Product
          key={product.dbproduct_id}
          pdcid={product.dbproduct_id}
          pdcname={product.dbproduct_name}
          pdcprice={product.dbproduct_price}
        ></Product>
      );
    });

    //print all the nodes in the list
    return <tbody>{productNodes}</tbody>;
  },
});

var Product = React.createClass({
  getInitialState: function () {
    return {
      uppdcidSS: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theuppdcid = this.props.pdcid;

    this.loadSinglePdc(theuppdcid);
  },
  loadSinglePdc: function (theuppdcid) {
    $.ajax({
      url: "/getsinglepdc",
      data: {
        uppdcidSS: theuppdcid,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populatePdc = this.state.singledata.map(function (product) {
          uppdcidSS.value = theuppdcid;
          uppdcnameSS.value = product.dbproduct_name;
          uppdcdescriptionSS.value = product.dbproduct_description;
          uppdcpriceSS.value = product.dbproduct_price;
          uppdcquantitySS.value = product.dbproduct_quantity;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    return (
      <tr>
        <td>{this.props.pdcid}</td>
        <td>{this.props.pdcname}</td>
        <td>${this.props.pdcprice}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  },
});

ReactDOM.render(<ProductBox />, document.getElementById("content"));
