var FacultyBox = React.createClass({
  handleFacultySubmit: function (faculty) {
    $.ajax({
      url: "/faculty",
      dataType: "json",
      type: "POST",
      data: faculty,
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
      <div className="FacultyBox">
        <h1>Faculty</h1>
        <Facultyform onFacultySubmit={this.handleFacultySubmit}/>
      </div>
    );
  },
});

var Facultyform = React.createClass({
  getInitialState: function () {
    return {
      facultytitle: "",
      facultyfirstname: "",
      facultylastname: "",
      facultyemail: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var facultytitle = this.state.facultytitle.trim();
    var facultyfirstname = this.state.facultyfirstname.trim();
    var facultylastname = this.state.facultylastname.trim();
    var facultyemail = this.state.facultyemail.trim();

    if (!this.validateEmail(facultyemail)) {
      console.log("Bad Email " + this.validateEmail(facultyemail));
      return;
    }

    if (!facultyfirstname || !facultylastname || !facultyemail) {
      console.log("Field Missing");
      return;
    }

    this.props.onFacultySubmit({
      facultytitle: facultytitle,
      facultyfirstname: facultyfirstname,
      facultylastname: facultylastname,
      facultyemail: facultyemail,
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
      <form className="facultyForm" onSubmit={this.handleSubmit}>
        <h2>Insert Faculty</h2>
        <table>
          <tbody>
            <tr>
              <th>Faculty Title</th>
              <td>
                <TextInput
                  value={this.state.facultytitle}
                  uniqueName="facultytitle"
                  textArea={false}
                  required={false}
                  minCharacters={0}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "facultytitle")}
                  errorMessage="Faculty First Name is invalid"
                />
              </td>
            </tr>
            <tr>
              <th>Faculty First Name</th>
              <td>
                <TextInput
                  value={this.state.facultyfirstname}
                  uniqueName="facultyfirstname"
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "facultyfirstname")}
                  errorMessage="Faculty First Name is invalid"
                  emptyMessage="Faculty First Name is required"
                />
              </td>
            </tr>
            <tr>
              <th>Faculty Last Name</th>
              <td>
                <TextInput
                  value={this.state.facultylastname}
                  uniqueName="facultylastname"
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "facultylastname")}
                  errorMessage="Faculty Last Name is invalid"
                  emptyMessage="Faculty Last Name is required"
                />
              </td>
            </tr>
            <tr>
              <th>Faculty E-Mail</th>
              <td>
                <TextInput
                  value={this.state.facultyemail}
                  uniqueName="facultyemail"
                  textArea={false}
                  required={true}
                  validate={this.validateEmail}
                  onChange={this.setValue.bind(this, "facultyemail")}
                  errorMessage="Invalid E-Mail Address"
                  emptyMessage="E-Mail Address is Required"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Faculty" />
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

ReactDOM.render(<FacultyBox />, document.getElementById("content"));
