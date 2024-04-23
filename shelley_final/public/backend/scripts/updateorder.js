var OrderBox = React.createClass({
  getInitialState: function () {
    return { data: [], datalog: [], viewthepage: "" };
  },
  // Load all order items from the database
  loadOrderItemsFromServer: function () {
    console.log(orderitemidSS.value);
    $.ajax({
      url: "/getorderitem",
      data: {
        orderitemidSS: orderitemidSS.value,
        orderitemproductSS: orderitemproductSS.value,
        orderitemorderSS: orderitemorderSS.value,
        orderitemquantitySS: orderitemquantitySS.value,
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
  updateSingleOrdFromServer: function (order) {
    $.ajax({
      url: "/updatesingleord",
      dataType: "json",
      data: order,
      type: "POST",
      cache: false,
      success: function (upsingledata) {
        this.setState({ upsingledata: upsingledata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    setTimeout(function(){
      window.location.reload(true);
    }, 500);
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
        this.loadOrderItemsFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // On load run function
  componentDidMount: function () {
    this.loadAllowLogin();
    // setInterval(this.loadOrderItemsFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage != "Manager") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
      return (
        <div>
          <h1>Update Orders</h1>
          <OrderItemform onOrderItemSubmit={this.loadOrderItemsFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>OrderID</th>
                    <th></th>
                  </tr>
                </thead>
                <OrderItemList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              <OrderUpdateform
                onUpdateSubmit={this.updateSingleOrdFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
  },
});

var OrderItemform = React.createClass({
  getInitialState: function () {
    return {
      orderitemidSS: "",
      orderitemproductSS: "",
      orderitemorderSS: "",
      orderitemquantitySS: "",
    };
  },
  handleItmSubmit: function (e) {
    e.preventDefault();

    var orderitemidSS = this.state.orderitemidSS.trim();
    var orderitemproductSS = this.state.orderitemproductSS.trim();
    var orderitemorderSS = this.state.orderitemorderSS.trim();
    var orderitemquantitySS = this.state.orderitemquantitySS.trim();

    this.props.onOrderItemSubmit({
      orderitemidSS: orderitemidSS,
      orderitemproductSS: orderitemproductSS,
      orderitemorderSS: orderitemorderSS,
      orderitemquantitySS: orderitemquantitySS,
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
        <div className="theform">
          <form onSubmit={this.handleItmSubmit}>
            <h2>Search Through OrderItems</h2>
            <table>
              <tbody>
                <tr>
                  <th>OrderItem ID</th>
                  <td>
                    <input
                      type="text"
                      name="orderitemidSS"
                      id="orderitemidSS"
                      value={this.state.orderitemidSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order Item Product Id</th>
                  <td>
                    <input
                      name="orderitemproductSS"
                      id="orderitemproductSS"
                      value={this.state.orderitemproductSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order ID</th>
                  <td>
                    <input
                      name="orderitemorderSS"
                      id="orderitemorderSS"
                      value={this.state.orderitemorderSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order Item Quantity</th>
                  <td>
                    <input
                      name="orderitemquantitySS"
                      id="orderitemquantitySS"
                      value={this.state.orderitemquantitySS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Search Order Item" />
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

var OrderUpdateform = React.createClass({
  getInitialState: function () {
    return {
      uporderitemidSS: "",
      uporderitemproductSS: "",
      uporderitemorderSS: "",
      uporderitemquantitySS: "",
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var uporderitemidSS = uporditmidSS.value;
    var uporderitemproductSS = uporditmproductSS.value;
    var uporderitemorderSS = uporditmorderSS.value;
    var uporderitemquantitySS = uporditemquantitySS.value;

    this.props.onUpdateSubmit({
      uporderitemidSS: uporderitemidSS,
      uporderitemproductSS: uporderitemproductSS,
      uporderitemorderSS: uporderitemorderSS,
      uporderitemquantitySS: uporderitemquantitySS,
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
                  <th>Order Product</th>
                  <td>
                    <input
                      type="text"
                      name="uporditmproductSS"
                      id="uporditmproductSS"
                      value={this.state.uporditmproductSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order ID</th>
                  <td>
                    <input
                      type="text"
                      name="uporditmorderSS"
                      id="uporditmorderSS"
                      value={this.state.uporditmorderSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order Item Quantity</th>
                  <td>
                    <input
                      type="text"
                      name="uporditemquantitySS"
                      id="uporditemquantitySS"
                      value={this.state.uporditemquantitySS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="uporditmidSS"
              id="uporditmidSS"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Order" />
          </form>
        </div>
      </div>
    );
  },
});

var OrderItemList = React.createClass({
  render: function () {
    var orderItemNodes = this.props.data.map(function (orderitem) {
      //map the data to individual
      return (
        <OrderItem
          key={orderitem.dborderitem_id}
          orditmid={orderitem.dborderitem_id}
          orditmproduct={orderitem.dbproduct_name}
          orditmorder={orderitem.dborder_id}
          orditmquantity={orderitem.dborderitem_quantity}
        ></OrderItem>
      );
    });

    //print all the nodes in the list
    return <tbody>{orderItemNodes}</tbody>;
  },
});

var OrderItem = React.createClass({
  getInitialState: function () {
    return {
      uporditmidSS: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theuporditmid = this.props.orditmid;

    this.loadSingleOrd(theuporditmid);
  },
  loadSingleOrd: function (theuporditmid) {
    $.ajax({
      url: "/getsingleorditm",
      data: {
        uporditmidSS: theuporditmid,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateOrd = this.state.singledata.map(function (order) {
          uporditmidSS.value = theuporditmid;
          uporditmproductSS.value = order.dbproduct_id;
          uporditmorderSS.value = order.dborder_id;
          uporditemquantitySS.value = order.dborderitem_quantity;
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
        <td>{this.props.orditmid}</td>
        <td>{this.props.orditmproduct}</td>
        <td>{this.props.orditmorder}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  },
});

ReactDOM.render(<OrderBox />, document.getElementById("content"));
