var OrderBox = React.createClass({
    getInitialState: function () {
      return { data: [] };
    },
    loadOrdersFromServer: function () {
      console.log(orderid.value);
      $.ajax({
        url: "/getorder",
        data: {
            'orderid': orderid.value,
            'orderdate': orderdate.value,
            'orderplayer': orderplayer.value,
            'orderuser': orderuser.value,
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
      this.loadOrdersFromServer();
    },
  
    render: function () {
      return (
        <div>
          <h1>Orders</h1>
          <Orderform onOrderSubmit={this.loadOrdersFromServer} />
          <br />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Player</th>
                <th>User</th>
              </tr>
            </thead>
            <OrderList data={this.state.data} />
          </table>
        </div>
      );
    },
  });
  
  var Orderform = React.createClass({
    getInitialState: function () {
      return {
        orderid: "",
        orderdate: "",
        orderplayer: "",
        orderuser: "",
      };
    },
    handleSubmit: function (e) {
      e.preventDefault();
  
      var orderid = this.state.orderid.trim();
      var orderdate = this.state.orderdate.trim();
      var orderplayer = this.state.orderplayer.trim();
      var orderuser = this.state.orderuser.trim();
  
      this.props.onOrderSubmit({
        orderid: orderid,
        orderdate: orderdate,
        orderplayer: orderplayer,
        orderuser: orderuser,
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
                    name="orderid"
                    id="orderid"
                    value={this.state.orderid}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Order Date</th>
                <td>
                  <input
                    name="orderdate"
                    id="orderdate"
                    value={this.state.orderdate}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Order Player</th>
                <td>
                  <input
                    name="orderplayer"
                    id="orderplayer"
                    value={this.state.orderplayer}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Order User</th>
                <td>
                  <input
                    name="orderuser"
                    id="orderuser"
                    value={this.state.orderuser}
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
            key={order.orderid}
            ordid={order.orderid}
            orddate={order.orderdate}
            ordplayer={order.orderplayer}
            orduser={order.orderuser}
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
          <td>{this.props.orddate}</td>
          <td>{this.props.ordplayer}</td>
          <td>{this.props.orduser}</td>
        </tr>
      );
    },
  });
  
  ReactDOM.render(<OrderBox />, document.getElementById("content"));
  