var ProductBox = React.createClass({
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
  handleProductSubmit: function (product) {
    $.ajax({
      url: "/product",
      dataType: "json",
      type: "POST",
      data: product,
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
        <div className="ProductBox">
          <h1>Products</h1>
          <Productform onProductSubmit={this.handleProductSubmit} />
        </div>
      );
    }
  },
});

var Productform = React.createClass({
  getInitialState: function () {
    return {
      productnameSS: "",
      productdescriptionSS: "",
      productpriceSS: "",
      productquantitySS: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var productnameSS = this.state.productnameSS.trim();
    var productdescriptionSS = this.state.productdescriptionSS.trim();
    var productpriceSS = this.state.productpriceSS.trim();
    var productquantitySS = this.state.productquantitySS.trim();

    if (!productnameSS || !productdescriptionSS || !productpriceSS) {
      console.log("Field Missing");
      return;
    }

    this.props.onProductSubmit({
      productnameSS: productnameSS,
      productdescriptionSS: productdescriptionSS,
      productpriceSS: productpriceSS,
      productquantitySS: productquantitySS,
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
      <form className="ProductForm" onSubmit={this.handleSubmit}>
        <h2>Insert Product</h2>
        <table>
          <tbody>
            <tr>
              <th>Product Name</th>
              <td>
                <TextInput
                  value={this.state.productnameSS}
                  uniqueName="productname"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "productnameSS")}
                  errorMessage="Product Name is invalid"
                  emptyMessage="Product Name is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Product Description</th>
              <td>
                <TextInput
                  value={this.state.productdescriptionSS}
                  uniqueName="productdescription"
                  textArea={false}
                  required={true}
                  minCharacters={2}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "productdescriptionSS")}
                  errorMessage="Invalid Product Description"
                  emptyMessage="Product Description is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Product Price</th>
              <td>
                <TextInput
                  value={this.state.productpriceSS}
                  uniqueName="productprice"
                  textArea={false}
                  required={false}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "productpriceSS")}
                  errorMessage="Product Price is invalid"
                />
              </td>
            </tr>
            <tr>
              <th>Product Quantity</th>
              <td>
                <TextInput
                  value={this.state.productquantitySS}
                  uniqueName="productquantity"
                  textArea={false}
                  required={false}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "productquantitySS")}
                  errorMessage="Product Quantity is invalid"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Product" />
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

ReactDOM.render(<ProductBox />, document.getElementById("content"));
