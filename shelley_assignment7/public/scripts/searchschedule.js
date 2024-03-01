var ScheduleBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadSchedulesFromServer: function () {
    console.log(scheduleid.value);
    $.ajax({
      url: "/getschedule",
      data: {
          'scheduleid': scheduleid.value,
          'courseprefix': courseprefix.value,
          'coursenumber': coursenumber.value,
          'coursesection': coursesection.value,
          'schedulesemester': schedulesemesteroption.value,
          'scheduleyear': scheduleyear.value,
          'coursefaculty': coursefacultyoption.value,
      },
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
    this.loadSchedulesFromServer();
    // setInterval(this.loadCoursesFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <h1>Schedule</h1>
        <Scheduleform onCourseSubmit={this.loadSchedulesFromServer} />
        <br />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Prefix</th>
              <th>Number</th>
              <th>Section</th>
              <th>Semester</th>
              <th>Year</th>
              <th>Faculty</th>
              <th>Started</th>
              <th>Entered</th>
            </tr>
          </thead>
          <ScheduleList data={this.state.data} />
        </table>
      </div>
    );
  },
});

var Scheduleform = React.createClass({
  getInitialState: function () {
    return {
      scheduleid: "",
      courseprefix: "",
      coursenumber: "",
      coursesection: "",
      scheduleyear: "",
      facdata: [],
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
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
    this.loadFacData();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var scheduleid = this.state.scheduleid.trim();
    var courseprefix = this.state.courseprefix.trim();
    var coursenumber = this.state.coursenumber.trim();
    var coursesection = this.state.coursesection.trim();
    var schedulesemester = schedulesemesteroption.value;
    var scheduleyear = this.state.scheduleyear.trim();
    var coursefaculty = coursefacultyoption.value;

    this.props.onCourseSubmit({
      scheduleid: scheduleid,
      courseprefix: courseprefix,
      coursenumber: coursenumber,
      coursesection: coursesection,
      schedulesemester: schedulesemester,
      scheduleyear: scheduleyear,
      coursefaculty: coursefaculty,
    });
  },
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Search Through Schedule</h2>
        <table>
          <tbody>
            <tr>
              <th>Schedule ID</th>
              <td>
                <input
                  type="text"
                  name="scheduleid"
                  id="scheduleid"
                  value={this.state.scheduleid}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Course Prefix</th>
              <td>
                <input
                  name="courseprefix"
                  id="courseprefix"
                  value={this.state.courseprefix}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Course Number</th>
              <td>
                <input
                  name="coursenumber"
                  id="coursenumber"
                  value={this.state.coursenumber}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Course Section</th>
              <td>
                <input
                  name="coursesection"
                  id="coursesection"
                  value={this.state.coursesection}
                  onChange={this.handleChange}
                />
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
                <input
                  name="scheduleyear"
                  id="scheduleyear"
                  value={this.state.scheduleyear}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Course Faculty</th>
              <td>
                <SelectList data={this.state.facdata} />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Schedule" />
      </form>
    );
  },
});
var ScheduleList = React.createClass({
  render: function () {
    var scheduleNodes = this.props.data.map(function (course) {
      //map the data to individual
      return (
        <Schedule
          key={course.scheduleid}
          schid={course.scheduleid}
          crsprefix={course.courseprefix}
          crsnumber={course.coursenumber}
          crssection={course.coursesection}
          schsemester={course.schedulesemester}
          schyear={course.scheduleyear}
          crsfaculty={course.facultyfirstname + " " + course.facultylastname}
          schstarted={course.schedulestarted === 0 ? "No": "Yes"}
          schentered={course.scheduleentered === 0 ? "No": "Yes"}
        ></Schedule>
      );
    });

    //print all the nodes in the list
    return <tbody>{scheduleNodes}</tbody>;
  },
});

var Schedule = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.schid}</td>
        <td>{this.props.crsprefix}</td>
        <td>{this.props.crsnumber}</td>
        <td>{this.props.crssection}</td>
        <td>{this.props.schsemester}</td>
        <td>{this.props.schyear}</td>
        <td>{this.props.crsfaculty}</td>
        <td>{this.props.schstarted}</td>
        <td>{this.props.schentered}</td>
      </tr>
    );
  },
});

var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (courseFaculty) {
      return (
        <option key={courseFaculty.facultyid} value={courseFaculty.facultyid}>
          {courseFaculty.facultyfirstname} {" "} {courseFaculty.facultylastname}
        </option>
      );
    });
    return (
      <select name="coursefacultyoption" id="coursefacultyoption">
        <option value=""></option>
        {optionNodes}
      </select>
    );
  },
});

var SelectSemesterList = React.createClass({
  render: function () {
    return (
      <select name="schedulesemesteroption" id="schedulesemesteroption">
        <option value=""></option>
        <option value="fall">Fall</option>
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
      </select>
    );
  },
});

ReactDOM.render(<ScheduleBox />, document.getElementById("content"));
