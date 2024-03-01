var ScheduleBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadSchedulesFromServer: function () {
    console.log(resultid.value);
    $.ajax({
      url: "/getresults",
      data: {
        'resultid': resultid.value,
        'courseprefix': courseprefix.value,
        'coursenumber': coursenumber.value,
        'coursesection': coursesection.value,
        'schedulesemester': schedulesemesteroption.value,
        'scheduleyear': scheduleyear.value,
        'resultslo': resultslo.value,
        'resultindicator': resultindicator.value,
        'resultthree': resultthree.value,
        'resulttwo': resulttwo.value,
        'resultone': resultone.value,
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
              <th>SLO</th>
              <th>Indicator</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
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
      resultid: "",
      courseprefix: "",
      coursenumber: "",
      coursesection: "",
      scheduleyear: "",
      resultslo: "",
      resultindicator: "",
      resultthree: "",
      resulttwo: "",
      resultone: ""
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var resultid = this.state.resultid.trim();
    var courseprefix = this.state.courseprefix.trim();
    var coursenumber = this.state.coursenumber.trim();
    var coursesection = this.state.coursesection.trim();
    var schedulesemester = schedulesemesteroption.value;
    var scheduleyear = this.state.scheduleyear.trim();
    var resultslo = this.state.resultslo.trim();
    var resultindicator = this.state.resultindicator.trim();
    var resultthree = this.state.resultthree.trim();
    var resulttwo = this.state.resulttwo.trim();
    var resultone = this.state.resultone.trim();

    this.props.onCourseSubmit({
      resultid: resultid,
      courseprefix: courseprefix,
      coursenumber: coursenumber,
      coursesection: coursesection,
      schedulesemester: schedulesemester,
      scheduleyear: scheduleyear,
      resultslo: resultslo,
      resultindicator: resultindicator,
      resultthree: resultthree,
      resulttwo: resulttwo,
      resultone: resultone
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
              <th>Result ID</th>
              <td>
                <input
                  type="text"
                  name="resultid"
                  id="resultid"
                  value={this.state.resultid}
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
              <th>Result SLO</th>
              <td>
                <input
                  name="resultslo"
                  id="resultslo"
                  value={this.state.resultslo}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Result Indicator</th>
              <td>
                <input
                  name="resultindicator"
                  id="resultindicator"
                  value={this.state.resultindicator}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Result One</th>
              <td>
                <input
                  name="resultone"
                  id="resultone"
                  value={this.state.resultone}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Result Two</th>
              <td>
                <input
                  name="resulttwo"
                  id="resulttwo"
                  value={this.state.resulttwo}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Result Three</th>
              <td>
                <input
                  name="resultthree"
                  id="resultthree"
                  value={this.state.resultthree}
                  onChange={this.handleChange}
                />
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
          key={course.resultid}
          resid={course.resultid}
          crsprefix={course.courseprefix}
          crsnumber={course.coursenumber}
          crssection={course.coursesection}
          schsemester={course.schedulesemester}
          schyear={course.scheduleyear}
          resslo={course.resultslo}
          resindicator={course.resultindicator}
          resthree={course.resultthree}
          restwo={course.resulttwo}
          resone={course.resultone}
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
        <td>{this.props.resid}</td>
        <td>{this.props.crsprefix}</td>
        <td>{this.props.crsnumber}</td>
        <td>{this.props.crssection}</td>
        <td>{this.props.schsemester}</td>
        <td>{this.props.schyear}</td>
        <td>{this.props.resslo}</td>
        <td>{this.props.resindicator}</td>
        <td>{this.props.resthree}</td>
        <td>{this.props.restwo}</td>
        <td>{this.props.resone}</td>
      </tr>
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
