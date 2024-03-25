// Create Order Box
var OrderBox = React.createClass({
  // Submit information to database
  handleOrderSubmit: function (order) {
    $.ajax({
      url: "/order",
      dataType: "json",
      type: "POST",
      data: order,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  render: function () {
    return (
      <div className="OrderBox">
        <h1>Orders</h1>
        <Orderform onOrderSubmit={this.handleOrderSubmit} />
      </div>
    );
  },
});

var Orderform = React.createClass({
  getInitialState: function () {
    return {
      orderdateSS: "",
      ordertimeSS: "",
      plrdataSS: [],
      usrdataSS: []
    };
  },
  // Handle the change when user interact with radio button
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  // Load Player Data
  loadPlrData: function () {
    $.ajax({
      url: "/getplrdata",
      dataType: "json",
      cache: false,
      success: function (plrdata) {
        this.setState({ plrdataSS: plrdata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Load User Data
  loadUsrData: function () {
    $.ajax({
      url: "/getusrdata",
      dataType: "json",
      cache: false,
      success: function (usrdata) {
        this.setState({ usrdataSS: usrdata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Check to see if items from database are mounted 
  componentDidMount: function () {
    this.loadPlrData();
    this.loadUsrData();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    // Assign the values from the text inputs to variables
    var orderdateSS = this.state.orderdate.trim();
    var ordertimeSS = this.state.ordertime.trim();
    var playeridSS = plrnum.value;
    var useridSS = usrnum.value;

    // Check to see if inputs are missing
    if (!orderdateSS || !ordertimeSS || !playeridSS) {
      console.log("Field Missing");
      return;
    }

    // Use the information form inputs and submit them to database
    this.props.onOrderSubmit({
      orderdateSS: orderdateSS,
      ordertimeSS: ordertimeSS,
      playeridSS: playeridSS,
      useridSS: useridSS,
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
      <form className="OrderForm" onSubmit={this.handleSubmit}>
        <h2>Insert Order</h2>
        <table>
          <tbody>
            <tr>
              {/* Display the Order Date so the player can input a date */}
              <th>Order Date</th>
              <td>
                <DateInput
                  value={this.state.orderdate}
                  uniqueName="orderdate"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "orderdate")}
                  errorMessage="Order Date is invalid"
                  emptyMessage="Order Date is Required"
                />
              </td>
            </tr>
            <tr>
              {/* Display the Order Time so the player can input a time */}
              <th>Order Time</th>
              <td>
                <TimeInput
                  value={this.state.ordertime}
                  uniqueName="ordertime"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "ordertime")}
                  errorMessage="Order Time is invalid"
                  emptyMessage="Order Time is Required"
                />
              </td>
            </tr>
            {/* Display PlayerList to show the Players at TCTG so player can select a player*/}
            <tr>
              <th>Order Player</th>
              <td>
                <PlayerList data={this.state.plrdata} />
              </td>
            </tr>
            {/* Display UserList to show the Users at TCTG so player can select a  user */}
            <tr>
              <th>Order User</th>
              <td>
                <UserList data={this.state.usrdata} />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button and allow player to interact with it to submit information */}
        <input type="submit" value="Insert Order" />
      </form>
    );
  },
});

var OrderItemform = React.createClass({
  getInitialState: function () {
    return {
      itemquantitySS: "",
      orddataSS: "",
    };
  },
  // Handle the change when user interact with radio button
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  // Load Player Data
  loadPlrData: function () {
    $.ajax({
      url: "/getplrdata",
      dataType: "json",
      cache: false,
      success: function (orddata) {
        this.setState({ orddata: orddata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Load User Data
  loadUsrData: function () {
    $.ajax({
      url: "/getusrdata",
      dataType: "json",
      cache: false,
      success: function (usrdata) {
        this.setState({ usrdataSS: usrdata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Check to see if items from database are mounted 
  componentDidMount: function () {
    this.loadPlrData();
    this.loadUsrData();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    // Assign the values from the text inputs to variables
    var orderdateSS = this.state.orderdate.trim();
    var ordertimeSS = this.state.ordertime.trim();
    var playeridSS = plrnum.value;
    var useridSS = usrnum.value;

    // Check to see if inputs are missing
    if (!orderdateSS || !ordertimeSS || !playeridSS) {
      console.log("Field Missing");
      return;
    }

    // Use the information form inputs and submit them to database
    this.props.onOrderSubmit({
      orderdateSS: orderdateSS,
      ordertimeSS: ordertimeSS,
      playeridSS: playeridSS,
      useridSS: useridSS,
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
      <form className="OrderForm" onSubmit={this.handleSubmit}>
        <h2>Insert Order</h2>
        <table>
          <tbody>
            <tr>
              {/* Display the Order Date so the player can input a date */}
              <th>Order Date</th>
              <td>
                <DateInput
                  value={this.state.orderdate}
                  uniqueName="orderdate"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "orderdate")}
                  errorMessage="Order Date is invalid"
                  emptyMessage="Order Date is Required"
                />
              </td>
            </tr>
            <tr>
              {/* Display the Order Time so the player can input a time */}
              <th>Order Time</th>
              <td>
                <TimeInput
                  value={this.state.ordertime}
                  uniqueName="ordertime"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "ordertime")}
                  errorMessage="Order Time is invalid"
                  emptyMessage="Order Time is Required"
                />
              </td>
            </tr>
            {/* Display PlayerList to show the Players at TCTG so player can select a player*/}
            <tr>
              <th>Order Player</th>
              <td>
                <PlayerList data={this.state.plrdata} />
              </td>
            </tr>
            {/* Display UserList to show the Users at TCTG so player can select a  user */}
            <tr>
              <th>Order User</th>
              <td>
                <UserList data={this.state.usrdata} />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button and allow player to interact with it to submit information */}
        <input type="submit" value="Insert Order" />
      </form>
    );
  },
});

// Create a new class for Input Error to display any errors
// that an Input may have
var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: "Input is invalid",
    };
  },
  // Display the Input Error onto Page
  render: function () {
    var errorClass = classNames(this.props.className, {
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return <td> {this.props.errorMessage} </td>;
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
          step="480"
          min="10:00"
          max="18:00"
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

// A list to select a Player from database
var PlayerList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (plrID) {
      return (
        <option key={plrID.dbplayer_id} value={plrID.dbplayer_id}>
          {plrID.dbplayer_firstname} {plrID.dbplayer_lastname}
        </option>
      );
    });
    return (
      <select name="plrnum" id="plrnum">
        {optionNodes}
      </select>
    );
  },
});

// A list to select a User from database
var UserList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (usrID) {
      return (
        <option key={usrID.dbuser_id} value={usrID.dbuser_id}>
          {usrID.dbuser_firstname} {usrID.dbuser_lastname}
        </option>
      );
    });
    return (
      <select name="usrnum" id="usrnum">
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<OrderBox />, document.getElementById("content"));
