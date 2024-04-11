var OrderBox = React.createClass({
  getInitialState: function () {
    return { orddataSS: [], itmdataSS: [] };
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
  loadOrderItemsFromServer: function () {
    console.log(orderitemidSS.value);
    $.ajax({
      url: "/getorderitem",
      itmdataSS: {
        orderitemidSS: orderitemidSS.value,
        orderitemproductSS: orderitemproductSS.value,
        orderitemorderSS: orderitemorderSS.value,
        orderitemquantitySS: orderitemquantitySS.value,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ itmdataSS: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadOrdersFromServer();
    this.loadOrderItemsFromServer();
  },

  render: function () {
    return (
      <div id="theresults">
        <div id="theleft">
          <h1>Orders</h1>
          <Orderform onOrderSubmit={this.loadOrdersFromServer} />
          <br />
          <table>
            <thead>
              <tr>
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
          <h1>Orders Items</h1>
          <OrderItemform onOrderItemSubmit={this.loadOrderItemsFromServer} />
          <br />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Order</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <OrderItemList data={this.state.itmdataSS} />
          </table>
        </div>
      </div>
    );
  },
});

var Orderform = React.createClass({
  getInitialState: function () {
    return {
      orderidSS: "",
      orderdatetimeSS: "",
      orderplayerSS: "",
      orderuserSS: "",
    };
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
    );
  },
});
var OrderList = React.createClass({
  render: function () {
    var orderNodes = this.props.data.map(function (order) {
      //map the data to individual
      return (
        <Order
          key={order.dborder_id}
          ordid={order.dborder_id}
          orddatetime={order.dborder_datetime}
          ordplayer={order.dbplayer_lastname}
          orduser={order.dbuser_firstname}
        ></Order>
      );
    });

    //print all the nodes in the list
    return <tbody>{orderNodes}</tbody>;
  },
});
var Order = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.ordid}</td>
        <td>{this.props.orddatetime}</td>
        <td>{this.props.ordplayer}</td>
        <td>{this.props.orduser}</td>
      </tr>
    );
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
  handleSubmit: function (e) {
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
      <form onSubmit={this.handleSubmit}>
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
              <th>Order Item Product Name</th>
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
    );
  },
});
var OrderItemList = React.createClass({
  render: function () {
    console.log(this.props.data);
    var orderItemNodes = this.props.data.map(function (orderitem) {
      //map the data to individual
      return (
        <OrderItem
          key={orderitem.dborderitem_id}
          orditmid={orderitem.dborderitem_id}
          orditmproduct={orderitem.dbproduct_name}
          orditmorder={orderitem.dborder_id}
          orditmquantity={orderitem.dbordeeritem_quantity}
        ></OrderItem>
      );
    });

    //print all the nodes in the list
    return <tbody>{orderItemNodes}</tbody>;
  },
});
var OrderItem = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.orditmid}</td>
        <td>{this.props.orditmproduct}</td>
        <td>{this.props.orditmorder}</td>
        <td>{this.props.orditmquantity}</td>
      </tr>
    );
  },
});

ReactDOM.render(<OrderBox />, document.getElementById("content"));
