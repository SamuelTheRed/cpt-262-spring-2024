var CourseBox = React.createClass({
  handleCourseSubmit: function (course) {
    $.ajax({
      url: "/course",
      dataType: "json",
      type: "POST",
      data: course,
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
      <div className="CourseBox">
        <h1>Courses</h1>
        <Courseform />
      </div>
    );
  },
});

var Courseform = React.createClass({
  getInitialState: function () {
    return {
      courseid: "",
      courseprefix: "",
      coursenumber: "",
      coursesection: "",
      coursefaculty: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var courseprefix = this.state.courseprefix.trim();
    var coursenumber = this.state.coursenumber.trim();
    var coursesection = this.state.coursesection.trim();
    var coursefaculty = this.state.coursefaculty;

    if (!coursenumber || !courseprefix) {
      console.log("Field Missing");
      return;
    }

    this.props.onCourseSubmit({
      courseprefix: courseprefix,
      coursenumber: coursenumber,
      coursesection: coursesection,
      coursefaculty: coursefaculty,
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
      <form className="CourseForm" onSubmit={this.handleSubmit}>
        <h2>Insert Course</h2>
        <table>
          <tbody>
            <tr>
              <th>Course ID</th>
              <td>
                <TextInput
                  value={this.state.courseid}
                  uniqueName="courseid"
                  textArea={false}
                  required={false}
                  minCharacters={0}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "courseid")}
                  errorMessage="Course ID is invalid"
                  emptyMessage="Course ID is required"
                />
              </td>
            </tr>
            <tr>
              <th>Course Prefix</th>
              <td>
                <TextInput
                  value={this.state.courseprefix}
                  uniqueName="courseprefix"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "courseprefix")}
                  errorMessage="Course Name is invalid"
                  emptyMessage="Course Name is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Course Number</th>
              <td>
                <TextInput
                  value={this.state.coursenumber}
                  uniqueName="coursenumber"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.validateEmail}
                  onChange={this.setValue.bind(this, "coursenumber")}
                  errorMessage="Invalid Course Number"
                  emptyMessage="Course Number is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Course Section</th>
              <td>
                <TextInput
                  value={this.state.coursesection}
                  uniqueName="coursesection"
                  textArea={false}
                  required={false}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "coursesection")}
                  errorMessage="Course Section is invalid"
                />
              </td>
            </tr>
            <tr>
              <th>Course Faculty</th>
              <td>
                <TextInput
                  value={this.state.coursefaculty}
                  uniqueName="coursefaculty"
                  textArea={false}
                  required={false}
                  minCharacters={0}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "coursefaculty")}
                  errorMessage="Did not enter a faculty value"
                  emptyMessage=""
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Course" />
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

ReactDOM.render(<CourseBox />, document.getElementById("content"));
