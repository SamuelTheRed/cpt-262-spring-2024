var OrderBox = React.createClass({
  getInitialState: function () {
    return { data: [], datalog: [], viewthepage: "" };
  },
  loadOrdersFromServer: function () {
    console.log(orderidSS.value);
    $.ajax({
      url: "/getorder",
      orddataSS: {
        orderidSS: orderidSS.value,
        orderdatetimeSS: orderdatetimeSS.value,
        orderplayerSS: orderplayerSS.value,
        orderuserSS: orderuserSS.value,
      },
      dataType: "json",
      cache: false,
      success: function (orddata) {
        this.setState({ orddataSS: orddata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  updateSingleEmpFromServer: function (order) {
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
    window.location.reload(true);
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
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // On load run function
  componentDidMount: function () {
    this.loadAllowLogin();
    this.loadOrdersFromServer();
    // setInterval(this.loadOrdersFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage != "Manager") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
      return (
        <div>
          <h1>Update Orders</h1>
          <Orderform onOrderSubmit={this.loadOrdersFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>ID</th>
                    <th>Date Time</th>
                    <th>Player</th>
                    <th>User</th>
                  </tr>
                </thead>
                <OrderList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              <OrderUpdateform
                onUpdateSubmit={this.updateSingleEmpFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
  },
});

var Orderform = React.createClass({
  getInitialState: function () {
    return {
      orderkeySS: "",
      orderidSS: "",
      orderdatetimeSS: "",
      orderplayerSS: "",
      orderuserSS: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var orderidSS = this.state.orderidSS.trim();
    var orderdatetimeSS = this.state.orderdatetimeSS.trim();
    var orderplayerSS = this.state.orderplayerSS.trim();
    var orderuserSS = this.state.orderuserSS.trim();

    this.props.onOrderSubmit({
      orderidSS: orderidSS,
      orderdatetimeSS: orderdatetimeSS,
      orderplayerSS: orderplayerSS,
      orderuserSS: orderuserSS,
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
          <form onSubmit={this.handleSubmit}>
            <h2>Search Through Orders</h2>
            <table>
              <tbody>
                <tr>
                  <th>Order ID</th>
                  <td>
                    <input
                      type="text"
                      name="orderidSS"
                      id="orderidSS"
                      value={this.state.orderidSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order Date Time</th>
                  <td>
                    <input
                      name="orderdatetimeSS"
                      id="orderdatetimeSS"
                      value={this.state.orderdatetimeSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order Player</th>
                  <td>
                    <input
                      name="orderplayerSS"
                      id="orderplayerSS"
                      value={this.state.orderplayerSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order User</th>
                  <td>
                    <input
                      name="orderuserSS"
                      id="orderuserSS"
                      value={this.state.orderuserSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Search Order" />
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
      uporderkeySS: "",
      uporderidSS: "",
      uporderdateSS: "",
      uporderplayerSS: "",
      uporderuserSS: "",
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var uporderkeySS = upordkeySS.value;
    var uporderidSS = upordidSS.value;
    var uporderplayerSS = upordplayerSS.value;
    var uporderdateSS = uporddateSS.value;
    var uporderuserSS = uporduserSS.value;

    this.props.onUpdateSubmit({
      uporderkeySS: uporderkeySS,
      uporderidSS: uporderidSS,
      uporderdateSS: uporderdateSS,
      uporderplayerSS: uporderplayerSS,
      uporderuserSS: uporderuserSS,
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
                  <th>Order ID</th>
                  <td>
                    <input
                      type="text"
                      name="upordidSS"
                      id="upordidSS"
                      value={this.state.upordidSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order Date</th>
                  <td>
                    <input
                      name="uporddateSS"
                      id="uporddateSS"
                      value={this.state.uporddateSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order Player</th>
                  <td>
                    <input
                      name="upordplayerSS"
                      id="upordplayerSS"
                      value={this.state.upordplayerSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Order User</th>
                  <td>
                    <input
                      name="uporduserSS"
                      id="uporduserSS"
                      value={this.state.uporduserSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upordkeySS"
              id="upordkeySS"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Order" />
          </form>
        </div>
      </div>
    );
  },
});

var OrderList = React.createClass({
  render: function () {
    var orderNodes = this.props.data.map(function (order) {
      return (
        <Order
          key={order.dborder_id}
          ordkey={order.dborder_id}
          ordid={order.dborder_id}
          orddate={order.dborder_datetime}
          ordplayer={order.dbplayer_id}
        ></Order>
      );
    });

    //print all the nodes in the list
    return <tbody>{orderNodes}</tbody>;
  },
});

var Order = React.createClass({
  getInitialState: function () {
    return {
      upordkey: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupordkey = this.props.ordkey;

    this.loadSingleEmp(theupordkey);
  },
  loadSingleEmp: function (theupordkey) {
    $.ajax({
      url: "/getsingleord",
      data: {
        upordkey: theupordkey,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateEmp = this.state.singledata.map(function (order) {
          upordkeySS.value = theupordkey;
          upordplayerSS.value = order.dbplayer_id;
          upordidSS.value = order.dborder_id;
          uporduserSS.value = order.dbuser_id;
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
        <td>{this.props.ordkey}</td>
        <td>{this.props.ordid}</td>
        <td>{this.props.orddate}</td>
        <td>{this.props.ordplayer}</td>
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
