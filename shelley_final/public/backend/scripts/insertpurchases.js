var PurchaseBox = React.createClass({
  // Get Login Status
  getInitialState: function () {
    return { data: [], viewthepage: "" };
  },
  // Check Status
  loadAllowLogin: function () {
    $.ajax({
      url: "/getloggedin",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ data: datalog });
        this.setState({ viewthepage: this.state.data[0].dbuser_role });
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
  },
  handlePurchaseSubmit: function (purchase) {
    $.ajax({
      url: "/purchase",
      dataType: "json",
      type: "POST",
      data: purchase,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },
  render: function () {
    if (this.state.viewthepage != "Manager") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
      return (
        <div className="PurchaseBox">
          <h1>Purchases</h1>
          <Purchaseform onPurchaseSubmit={this.handlePurchaseSubmit} />
        </div>
      );
    }
  },
});

var Purchaseform = React.createClass({
  getInitialState: function () {
    return {
      purchaseinformationSS: "",
      purchasedateSS: "",
      purchasetimeSS: "",
      orddataSS: [],
    };
  },
  // Handle the change when user interact with radio button
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  // Load Order Data
  loadOrdData: function () {
    $.ajax({
      url: "/getorddata",
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
  // Check to see if items from database are mounted
  componentDidMount: function () {
    this.loadOrdData();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var purchaseinformationSS = statusnum.value;
    var purchasedateSS = this.state.purchasedateSS.trim();
    var purchasetimeSS = this.state.purchasetimeSS.trim();
    var orderidSS = ordnum.value;

    if (!purchaseinformationSS || !purchasedateSS || !purchasetimeSS) {
      console.log("Field Missing");
      return;
    }

    this.props.onPurchaseSubmit({
      purchaseinformationSS: purchaseinformationSS,
      purchasedateSS: purchasedateSS,
      purchasetimeSS: purchasetimeSS,
      orderidSS: orderidSS,
    });
  },
  validateEmail: function (value) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },
  validateDollars: function (value) {
    var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    return regex.test(value);
  },
  commonValidate: function () {
    return true;
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  render: function () {
    return (
      <form className="PurchaseForm" onSubmit={this.handleSubmit}>
        <h2>Insert Purchase</h2>
        <table>
          <tbody>
            <tr>
              <th>Purchase Information</th>
              <td>
                <StatusList />
              </td>
            </tr>
            <tr>
              {/* Display the Purchase Date so the player can input a date */}
              <th>Purchase Date</th>
              <td>
                <DateInput
                  value={this.state.purchasedateSS}
                  uniqueName="purchasedate"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "purchasedateSS")}
                  errorMessage="Purchase Date is invalid"
                  emptyMessage="Purchase Date is Required"
                />
              </td>
            </tr>
            <tr>
              {/* Display the Purchase Time so the player can input a time */}
              <th>Purchase Time</th>
              <td>
                <TimeInput
                  value={this.state.purchasetimeSS}
                  uniqueName="purchasetime"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "purchasetimeSS")}
                  errorMessage="Purchase Time is invalid"
                  emptyMessage="Purchase Time is Required"
                />
              </td>
            </tr>
            {/* Display Order List to show the Orders at TCTG so player can select an order*/}
            <tr>
              <th>Order</th>
              <td>
                <OrderList data={this.state.orddataSS} />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Purchase" />
      </form>
    );
  },
});

var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: "Input is invalid",
    };
  },
  render: function () {
    var errorClass = classNames(this.props.className, {
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return <td> {this.props.errorMessage} </td>;
  },
});

var TextInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    if (this.props.textArea) {
      return (
        <div className={this.props.uniqueName}>
          <textarea
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    } else {
      return (
        <div className={this.props.uniqueName}>
          <input
            name={this.props.uniqueName}
            id={this.props.uniqueName}
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    }
  },
});

// Create a new class for DateInput component
// to allow the user/player to enter in a Date
var DateInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  // Handle the change when user/player interacts with Date Picker
  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  // Validate if the value in the Date Picker it valid or not
  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    // If the value is not valid in the date picker show an error
    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    // Set the value
    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  // Display the DatePicker onto Page
  render: function () {
    return (
      <div className={this.props.uniqueName}>
        <input
          name={this.props.uniqueName}
          type="date"
          id={this.props.uniqueName}
          placeholder={this.props.text}
          className={"input input-" + this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

var TimeInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    return (
      <div className={this.props.uniqueName}>
        <input
          name={this.props.uniqueName}
          type="time"
          id={this.props.uniqueName}
          placeholder={this.props.text}
          className={"input input-" + this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          min="08:00"
          max="16:00"
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

var StatusList = React.createClass({
  render: function () {
    return (
      <select name="statusnum" id="statusnum">
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

// A list to select an Order from database
var OrderList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (ordID) {
      return (
        <option key={ordID.dborder_id} value={ordID.dborder_id}>
          {ordID.dbplayer_lastname} {ordID.dborder_datetime}
        </option>
      );
    });
    return (
      <select name="ordnum" id="ordnum">
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
