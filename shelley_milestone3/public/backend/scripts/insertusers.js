var UserBox = React.createClass({
  handleUserSubmit: function (user) {
    $.ajax({
      url: "/user",
      dataType: "json",
      type: "POST",
      data: user,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
      <div className="UserBox">
        <h1>Users</h1>
        <Userform onUserSubmit={this.handleUserSubmit} />
      </div>
    );
  },
});

var Userform = React.createClass({
  getInitialState: function () {
    return {
      userfirstname: "",
      userlastname: "",
      useremail: "",
      userphone: ""
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var userfirstname = this.state.userfirstname.trim();
    var userlastname = this.state.userlastname.trim();
    var useremail = this.state.useremail.trim();
    var userphone = this.state.userphone.trim();

    if (!userfirstname || !userlastname || !useremail) {
      console.log("Field Missing");
      return;
    }

    this.props.onUserSubmit({
      userfirstname: userfirstname,
      userlastname: userlastname,
      useremail: useremail,
      userphone: userphone
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
      <form className="UserForm" onSubmit={this.handleSubmit}>
        <h2>Insert User</h2>
        <table>
          <tbody>
            <tr>
              <th>User First Name</th>
              <td>
                <TextInput
                  value={this.state.userfirstname}
                  uniqueName="userfirstname"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userfirstname")}
                  errorMessage="User Name is invalid"
                  emptyMessage="User Name is Required"
                />
              </td>
            </tr>
            <tr>
              <th>User Last Name</th>
              <td>
                <TextInput
                  value={this.state.userlastname}
                  uniqueName="userlastname"
                  textArea={false}
                  required={true}
                  minCharacters={2}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userlastname")}
                  errorMessage="Invalid User Last Name"
                  emptyMessage="User Last Name is Required"
                />
              </td>
            </tr>
            <tr>
              <th>User Email</th>
              <td>
                <TextInput
                  value={this.state.useremail}
                  uniqueName="useremail"
                  textArea={false}
                  required={false}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "useremail")}
                  errorMessage="User Email is invalid"
                />
              </td>
            </tr>
            <tr>
              <th>User Phone</th>
              <td>
                <TextInput
                  value={this.state.userphone}
                  uniqueName="userphone"
                  textArea={false}
                  required={false}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userphone")}
                  errorMessage="User Phone is invalid"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert User" />
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

ReactDOM.render(<UserBox />, document.getElementById("content"));
