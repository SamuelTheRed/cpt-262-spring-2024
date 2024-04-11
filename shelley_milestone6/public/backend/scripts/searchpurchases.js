var PurchaseBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  // Load all purchases items from the database
  loadPurchasesFromServer: function () {
    console.log(purchaseidSS.value);
    $.ajax({
      url: "/getpurchase",
      // Stores the data
      data: {
        purchaseidSS: purchaseidSS.value,
        purchaseinformationSS: statusnum.value,
        purchasedatetimeSS: purchasedatetimeSS.value,
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
  // When site is loaded, load purchases
  componentDidMount: function () {
    this.loadPurchasesFromServer();
  },

  render: function () {
    return (
      <div>
        {/* Page Title */}
        <div className="page_title">
          <h1>Purchases</h1>
        </div>
        {/* Purchase Form */}
        <Purchaseform onPurchaseSubmit={this.loadPurchasesFromServer} />
        <br />
        <div className="result_table">
          {/* Result Table */}
          <table>
            <thead>
              <tr className="result_headers">
                <th>ID</th>
                <th>Information</th>
                <th>Datetime</th>
              </tr>
            </thead>
            <PurchaseList data={this.state.data} />
          </table>
        </div>
      </div>
    );
  },
});

var Purchaseform = React.createClass({
  getInitialState: function () {
    return {
      purchaseidSS: "",
      purchaseinformationSS: "",
      purchasedatetimeSS: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var purchaseidSS = this.state.purchaseidSS.trim();
    var purchaseinformationSS = this.state.purchaseinformationSS.trim();
    var purchasedatetimeSS = this.state.purchasedatetimeSS.trim();

    this.props.onPurchaseSubmit({
      purchaseidSS: purchaseidSS,
      purchaseinformationSS: purchaseinformationSS,
      purchasedatetimeSS: purchasedatetimeSS,
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
                  name="purchaseidSS"
                  id="purchaseidSS"
                  value={this.state.purchaseidSS}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Purchase Information</th>
              <td>
                <StatusList data={this.state.data}></StatusList>
              </td>
            </tr>
            <tr>
              <th>Purchase Datetime</th>
              <td>
                <input
                  name="purchasedatetimeSS"
                  id="purchasedatetimeSS"
                  value={this.state.purchasedatetimeSS}
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
          key={purchase.dborder_id}
          purid={purchase.dborder_id}
          purinformation={purchase.dbpurchase_status}
          purdatetime={purchase.dbpurchase_datetimefulfilled}
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
      </tr>
    );
  },
});
var StatusList = React.createClass({
  render: function () {
    return (
      <select name="statusnum" id="statusnum">
        <option key="0" value="">
          --
        </option>
        <option key="1" value="Pending">
          Pending
        </option>
        <option key="2" value="Fulfilled">
          Fulfilled
        </option>
        <option key="3" value="Cancelled">
          Cancelled
        </option>
      </select>
    );
  },
});
ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
