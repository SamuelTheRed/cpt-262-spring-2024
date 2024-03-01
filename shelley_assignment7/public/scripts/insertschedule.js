var ScheduleBox = React.createClass({
  handleScheduleSubmit: function (schedule) {
    $.ajax({
      url: "/schedule",
      dataType: "json",
      type: "POST",
      data: schedule,
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
      <div className="ScheduleBox">
        <h1>Schedules</h1>
        <Scheduleform onScheduleSubmit={this.handleScheduleSubmit} />
      </div>
    );
  },
});

var Scheduleform = React.createClass({
  getInitialState: function () {
    return {
      scheduleyear: "",
      data: [],
      facdata: [],
      crsdata: [],
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadCrsData: function () {
    $.ajax({
      url: "/getcrsdata",
      dataType: "json",
      cache: false,
      success: function (crsdata) {
        this.setState({ crsdata: crsdata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  loadFacData: function () {
    $.ajax({
      url: "/getfacdata",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ facdata: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadCrsData();
    this.loadFacData();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var courseid = coursenum.value;
    var schedulesemester = semesternum.value;
    var scheduleyear = this.state.scheduleyear.trim();
    var facultyid = facnum.value;

    if (!schedulesemester || !scheduleyear) {
      console.log("Field Missing");
      return;
    }

    this.props.onScheduleSubmit({
      courseid: courseid,
      schedulesemester: schedulesemester,
      scheduleyear: scheduleyear,
      facultyid: facultyid,
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
      <form className="ScheduleForm" onSubmit={this.handleSubmit}>
        <h2>Insert Schedule</h2>
        <table>
          <tbody>
            <tr>
              <th>Schedule Course</th>
              <td>
                <SelectListCourse data={this.state.crsdata} />
              </td>
            </tr>
            <tr>
              <th>Schedule Semester</th>
              <td>
                <SelectSemesterList />
              </td>
            </tr>
            <tr>
              <th>Schedule Year</th>
              <td>
                <TextInput
                  value={this.state.scheduleyear}
                  uniqueName="scheduleyear"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "scheduleyear")}
                  errorMessage="Schedule Year is invalid"
                  emptyMessage="Schedule Year is required"
                />
              </td>
            </tr>
            <tr>
              <th>Schedule Faculty</th>
              <td>
                <SelectList data={this.state.facdata} />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Schedule" />
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

var SelectSemesterList = React.createClass({
  render: function () {
    return (
      <select name="semesternum" id="semesternum">
        <option key="Fall" value="Fall">Fall</option>
        <option key="Spring" value="Spring">Spring</option>
        <option key="Summer" value="Summer">Summer</option>
      </select>
    );
  },
});

var SelectListCourse = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (courseId) {
      return (
        <option key={courseId.courseid} value={courseId.courseid}>
          {courseId.courseprefix} {courseId.coursenumber}{" "}
          {courseId.coursesection} - id_{courseId.courseid}
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
ReactDOM.render(<ScheduleBox />, document.getElementById("content"));
