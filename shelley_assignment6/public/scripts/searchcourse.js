var CourseBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadCoursesFromServer: function () {
    console.log(courseid.value);

    $.ajax({
      url: "/getcourse",
      data: {
        courseprefix: courseprefix,
        coursenumber: coursenumber,
        coursesection: coursesection,
        coursefaculty: coursefaculty
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
    this.loadCoursesFromServer();
    // setInterval(this.loadCoursesFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <h1>Courses</h1>
        <Courseform onCourseSubmit={this.loadCoursesFromServer} />
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
            </tr>
          </thead>
          <CourseList data={this.state.data} />
        </table>
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
      data: [],
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadCourseTypes: function () {
    $.ajax({
      url: "/getdata",
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
    this.loadCourseTypes();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var courseid = this.state.courseid.trim();
    var courseprefix = this.state.courseprefix.trim();
    var coursenumber = this.state.coursenumber.trim();
    var coursesection = this.state.coursesection.trim();
    var coursefaculty = coursefaculty.value;

    this.props.onCourseSubmit({
      courseid: courseid,
      courseprefix: courseprefix,
      coursenumber: coursenumber,
      coursesection: coursesection,
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
        <h2>Search Courses</h2>
        <table>
          <tbody>
            <tr>
              <th>Course ID</th>
              <td>
                <input
                  type="text"
                  name="courseid"
                  id="courseid"
                  value={this.state.courseid}
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
              <td>
                <SelectSemesterList data={this.state.data} />
              </td>
              </td>
            </tr>
            <tr>
              <th>Schedule Year</th>
              <td>
                <SelectYearList data={this.state.data} />
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
        <input type="submit" value="Search Course" />
      </form>
    );
  },
});
var CourseList = React.createClass({
  render: function () {
    var courseNodes = this.props.data.map(function (course) {
      //map the data to individual 
      return (
        <Course
          key={course.dbcourseid}
          courseid={course.dbcourseid}
          courseprefix={course.courseprefix}
          coursenumber={course.coursenumber}
          coursesection={course.coursesection}
          schedulesemester={course.schedulesemester}
          scheduleyear={course.scheduleyear}
          facultyfirst={course.facultyfirstname} // From Faculty DB
          facultylast={course.facultylastname}

        ></Course>
      );
    });

    //print all the nodes in the list
    return <tbody>{courseNodes}</tbody>;
  },
});

var Course = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.courseid}</td>
        <td>{this.props.courseprefix}</td>
        <td>{this.props.coursenumber}</td>
        <td>{this.props.coursesection}</td>
        <td>{this.props.schedulesemester}</td>
        <td>{this.props.scheduleyear}</td>
        <td>{this.props.coursefaculty}</td>
      </tr>
    );
  },
});

var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (courseFaculty) {
      return (
        <option
          key={courseFaculty.dbcoursefacultyid}
          value={courseFaculty.dbcoursefacultyid}
        >
          {courseFaculty.dbcoursefacultyname}
        </option>
      );
    });
    return (
      <select name="coursefaculty" id="coursefaculty">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

var SelectSemesterList = React.createClass({
  render: function () {
    return (
      <select name="schedulesemester" id="schedulesemester">
        <option value="fall">Fall</option>
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
      </select>
    );
  },
});

var SelectYearList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (scheduleYear) {
      return (
        <option
          key={scheduleYear.scheduleyear}
          value={scheduleYear.scheduleyear}
        >
          {scheduleYear.scheduleyear}
        </option>
      );
    });
    return (
      <select name="scheduleyear" id="scheduleyear">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<CourseBox />, document.getElementById("content"));
