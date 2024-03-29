var OrderBox = React.createClass({
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
      orderdate: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var orderdate = this.state.orderdate.trim();

    if (!orderdate) {
      console.log("Field Missing");
      return;
    }

    this.props.onOrderSubmit({
      orderdate: orderdate,
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
              <th>Order Date</th>
              <td>
                <TextInput
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
              <th>Order Customer</th>
              <td>
                <PlayerList />
              </td>
            </tr>
            <tr>
              <th>Order Employee</th>
              <td>
                <UserList />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Order" />
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

var PlayerList = React.createClass({
  render: function () {
    return (
      <select name="playernum" id="playernum">
        <option key="1" value="Player 1">
          Player 1
        </option>
        <option key="2" value="Player 2">
          Player 2
        </option>
        <option key="3" value="Player 3">
          Player 3
        </option>
      </select>
    );
  },
});

var UserList = React.createClass({
  render: function () {
    return (
      <select name="usernum" id="usernum">
        <option key="1" value="User 1">
          User 1
        </option>
        <option key="2" value="User 2">
          User 2
        </option>
        <option key="3" value="User 3">
          User 3
        </option>
      </select>
    );
  },
});

ReactDOM.render(<OrderBox />, document.getElementById("content"));
