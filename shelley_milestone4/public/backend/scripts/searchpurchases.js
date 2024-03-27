var PurchaseBox = React.createClass({
    getInitialState: function () {
      return { data: [] };
    },
    loadPurchasesFromServer: function () {
      console.log(purchaseid.value);
      $.ajax({
        url: "/getpurchase",
        data: {
            'purchaseid': purchaseid.value,
            'purchaseinformation': purchaseinformation.value,
            'purchasedatetime': purchasedatetime.value,
            'purchaseorder': purchaseorder.value,
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
      this.loadPurchasesFromServer();
    },
  
    render: function () {
      return (
        <div>
          <h1>Purchases</h1>
          <Purchaseform onPurchaseSubmit={this.loadPurchasesFromServer} />
          <br />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Information</th>
                <th>Datetime</th>
                <th>Order</th>
              </tr>
            </thead>
            <PurchaseList data={this.state.data} />
          </table>
        </div>
      );
    },
  });
  
  var Purchaseform = React.createClass({
    getInitialState: function () {
      return {
        purchaseid: "",
        purchaseinformation: "",
        purchasedatetime: "",
        purchaseorder: "",
      };
    },
    handleSubmit: function (e) {
      e.preventDefault();
  
      var purchaseid = this.state.purchaseid.trim();
      var purchaseinformation = this.state.purchaseinformation.trim();
      var purchasedatetime = this.state.purchasedatetime.trim();
      var purchaseorder = this.state.purchaseorder.trim();
  
      this.props.onPurchaseSubmit({
        purchaseid: purchaseid,
        purchaseinformation: purchaseinformation,
        purchasedatetime: purchasedatetime,
        purchaseorder: purchaseorder,
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
          <h2>Search Through Purchases</h2>
          <table>
            <tbody>
              <tr>
                <th>Purchase ID</th>
                <td>
                  <input
                    type="text"
                    name="purchaseid"
                    id="purchaseid"
                    value={this.state.purchaseid}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Purchase Information</th>
                <td>
                  <input
                    name="purchaseinformation"
                    id="purchaseinformation"
                    value={this.state.purchaseinformation}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Purchase Datetime</th>
                <td>
                  <input
                    name="purchasedatetime"
                    id="purchasedatetime"
                    value={this.state.purchasedatetime}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Purchase Order</th>
                <td>
                  <input
                    name="purchaseorder"
                    id="purchaseorder"
                    value={this.state.purchaseorder}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Search Purchase" />
        </form>
      );
    },
  });
  var PurchaseList = React.createClass({
    render: function () {
      var purchaseNodes = this.props.data.map(function (purchase) {
        //map the data to individual
        return (
          <Purchase
            key={purchase.purchaseid}
            purid={purchase.purchaseid}
            purinformation={purchase.purchaseinformation}
            purdatetime={purchase.purchasedatetime}
            purorder={purchase.purchaseorder}
          ></Purchase>
        );
      });
  
      //print all the nodes in the list
      return <tbody>{purchaseNodes}</tbody>;
    },
  });
  
  var Purchase = React.createClass({
    render: function () {
      return (
        <tr>
          <td>{this.props.purid}</td>
          <td>{this.props.purinformation}</td>
          <td>{this.props.purdatetime}</td>
          <td>{this.props.purorder}</td>
        </tr>
      );
    },
  });
  
  ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
  