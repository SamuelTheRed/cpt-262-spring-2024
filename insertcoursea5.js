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
        <Courseform onCourseSubmit={this.handleCourseSubmit} />
      </div>
    );
  },
});

var Courseform = React.createClass({
  getInitialState: function () {
    return {
      coursesemester: "",
      courseyear: "",
      data: [],
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadData: function () {
    $.ajax({
      url: "/getcourses",
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
  loadFac: function () {
    $.ajax({
      url: "/getfac",
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
  componentDidMount: function () {
    this.loadFac();
    this.loadCourses();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var courseid = this.state.courseid;
    var courseprefix = this.state.courseprefix.trim();
    var coursenumber = this.state.coursenumber.trim();
    var coursesection = this.state.coursesection.trim();
    var coursesemester = this.state.coursesemester.trim();
    var courseyear = this.state.courseyear.trim();

    if (!coursesemester || !courseyear) {
      console.log("Field Missing");
      return;
    }

    this.props.onCourseSubmit({
      courseid: courseid,
      courseprefix: courseprefix,
      coursenumber: coursenumber,
      coursesection: coursesection,
      coursesemester: coursesemester,
      courseyear: courseyear,
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
              <th>Course Select</th>
              <td>
                <CourseSelectList data={this.state.data} />
              </td>
            </tr>
            <tr>
              <th>Course Semester</th>
              <td>
                <TextInput
                  value={this.state.coursesemester}
                  uniqueName="coursesemester"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "coursesemester")}
                  errorMessage="Course Section is invalid"
                  emptyMessage="Course Section is required"
                />
              </td>
            </tr>
            <tr>
              <th>Course Year</th>
              <td>
                <TextInput
                  value={this.state.courseyear}
                  uniqueName="courseyear"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "courseyear")}
                  errorMessage="Course Year is invalid"
                  emptyMessage="Course Year is required"
                />
              </td>
            </tr>
            <tr>
              <th>Course Faculty</th>
              <td>
                <SelectList data={this.state.data} />
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

var CourseSelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (courseID) {
      return (
        <option key={courseID.courseid} value={courseID.courseid}>
          {courseID.courseprefix} {courseID.coursenumber} {courseID.coursesection}
        </option>
      );
    });
    return (
      <select name="coursenum" id="coursenum">
        {optionNodes}
      </select>
    );
  },
});

var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (facID) {
      return (
        <option key={facID.facultyid} value={facID.facultyid}>
          {facID.facultyfirstname} {facID.facultylastname}
        </option>
      );
    });
    return (
      <select name="facnum" id="facnum">
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<CourseBox />, document.getElementById("content"));
