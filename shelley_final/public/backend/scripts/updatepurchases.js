var PurchaseBox = React.createClass({
  getInitialState: function () {
    return { data: [], datalog: [], viewthepage: "" };
  },
  loadPurchasesFromServer: function () {
    console.log(purchaseidSS.value);
    $.ajax({
      url: "/getpurchase",
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
  updateSinglePurFromServer: function (purchase) {
    $.ajax({
      url: "/updatesinglepur",
      dataType: "json",
      data: purchase,
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
        this.loadPurchasesFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // On load run function
  componentDidMount: function () {
    this.loadAllowLogin();
    // setInterval(this.loadPurchasesFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage != "Manager") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
      return (
        <div>
          <h1>Update Purchases</h1>
          <Purchaseform onPurchaseSubmit={this.loadPurchasesFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <PurchaseList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              <PurchaseUpdateform
                onUpdateSubmit={this.updateSinglePurFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
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
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
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
      <div>
        <div id="theform">
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
                  <th>Purchase Status</th>
                  <td>
                    <StatusList data={this.state.data} />
                  </td>
                </tr>
                <tr>
                  <th>Purchase Date Time Fulfilled</th>
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

var PurchaseUpdateform = React.createClass({
  getInitialState: function () {
    return {
      uppurchaseidSS: "",
      uppurchasestatusSS: "",
      uppurchasedatetimeSS: "",
      updata: [],
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var uppurchaseidSS = uppuridSS.value
    var uppurchasestatusSS = upstatusnum.value;
    var uppurchasedatetimeSS = uppurdatetimeSS.value;

    this.props.onUpdateSubmit({
      uppurchaseidSS: uppurchaseidSS,
      uppurchasestatusSS: uppurchasestatusSS,
      uppurchasedatetimeSS: uppurchasedatetimeSS,
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
                  <th>Purchase Status</th>
                  <td>
                    <UpStatusList data={this.state.updata} />
                  </td>
                </tr>
                <tr>
                  <th>Purchase Date Time Fulfilled</th>
                  <td>
                    <input
                      name="uppurdatetimeSS"
                      id="uppurdatetimeSS"
                      value={this.state.uppurdatetimeSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="uppuridSS"
              id="uppuridSS"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Purchase" />
          </form>
        </div>
      </div>
    );
  },
});

var PurchaseList = React.createClass({
  render: function () {
    var purchaseNodes = this.props.data.map(function (purchase) {
      return (
        <Purchase
          key={purchase.dborder_id}
          purid={purchase.dborder_id}
          purstatus={purchase.dbpurchase_status}
          purdatetime={purchase.dbpurchase_datetimefulfilled}
        ></Purchase>
      );
    });

    //print all the nodes in the list
    return <tbody>{purchaseNodes}</tbody>;
  },
});

var Purchase = React.createClass({
  getInitialState: function () {
    return {
      uppuridSS: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theuppurid = this.props.purid;

    this.loadSinglePur(theuppurid);
  },
  loadSinglePur: function (theuppurid) {
    $.ajax({
      url: "/getsinglepur",
      data: {
        uppuridSS: theuppurid,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populatePur = this.state.singledata.map(function (purchase) {
          uppuridSS.value = theuppurid;
          upstatusnum.value = purchase.dbpurchase_status;
          uppurdatetimeSS.value = purchase.dbpurchase_datetimefulfilled;
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
        <td>{this.props.purid}</td>
        <td>{this.props.purstatus}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  },
});

var StatusList = React.createClass({
  render: function () {
    return (
      <select name="statusnum" id="statusnum">
      <option key="" value=""></option>
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

var UpStatusList = React.createClass({
  render: function () {
    return (
      <select name="upstatusnum" id="upstatusnum">
      <option key="" value=""></option>
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
