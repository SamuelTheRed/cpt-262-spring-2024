var CourseBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadCoursesFromServer: function () {
    console.log(courseid.value);
    $.ajax({
      url: "/getcourse",
      data: {
          'courseid': courseid.value,
          'courseprefix': courseprefix.value,
          'coursenumber': coursenumber.value,
          'coursesection': coursesection.value,
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
              <th>Assignment</th>
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
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var courseid = this.state.courseid.trim();
    var courseprefix = this.state.courseprefix.trim();
    var coursenumber = this.state.coursenumber.trim();
    var coursesection = this.state.coursesection.trim();

    this.props.onCourseSubmit({
      courseid: courseid,
      courseprefix: courseprefix,
      coursenumber: coursenumber,
      coursesection: coursesection,
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
        <h2>Search Through Courses</h2>
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
          key={course.courseid}
          crsid={course.courseid}
          crsprefix={course.courseprefix}
          crsnumber={course.coursenumber}
          crssection={course.coursesection}
          crsassignment={course.courseassignment}
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
        <td>{this.props.crsid}</td>
        <td>{this.props.crsprefix}</td>
        <td>{this.props.crsnumber}</td>
        <td>{this.props.crssection}</td>
        <td>{this.props.crsassignment}</td>
      </tr>
    );
  },
});

ReactDOM.render(<CourseBox />, document.getElementById("content"));
