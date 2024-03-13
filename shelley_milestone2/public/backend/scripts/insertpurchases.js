var PurchaseBox = React.createClass({
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
  },
  render: function () {
    return (
      <div className="PurchaseBox">
        <h1>Purchases</h1>
        <Purchaseform onPurchaseSubmit={this.handlePurchaseSubmit} />
      </div>
    );
  },
});

var Purchaseform = React.createClass({
  getInitialState: function () {
    return {
      purchaseinformation: "",
      purchasedatetime: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var purchaseinformation = this.state.purchaseinformation.trim();
    var purchasedatetime = this.state.purchasedatetime.trim();

    if (!purchaseinformation || !purchasedatetime) {
      console.log("Field Missing");
      return;
    }

    this.props.onPurchaseSubmit({
      purchaseinformation: purchaseinformation,
      purchasedatetime: purchasedatetime,
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
                <TextInput
                  value={this.state.purchaseinformation}
                  uniqueName="purchaseinformation"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "purchaseinformation")}
                  errorMessage="Purchase Name is invalid"
                  emptyMessage="Purchase Name is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Purchase Date Time</th>
              <td>
                <TextInput
                  value={this.state.purchasedatetime}
                  uniqueName="purchasedatetime"
                  textArea={false}
                  required={true}
                  minCharacters={2}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "purchasedatetime")}
                  errorMessage="Invalid Purchase Date Time"
                  emptyMessage="Purchase Date Time is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Purchase Order</th>
              <td>
                <OrderList />
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

var OrderList = React.createClass({
  render: function () {
    return (
      <select name="ordernum" id="ordernum">
        <option key="1" value="Order 1">
          Order 1
        </option>
        <option key="2" value="Order 2">
          Order 2
        </option>
        <option key="3" value="Order 3">
          Order 3
        </option>
      </select>
    );
  },
});

ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
