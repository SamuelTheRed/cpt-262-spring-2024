var FacultyBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadFacultyFromServer: function () {
    console.log(facultyid.value);
    $.ajax({
      url: "/getfaculty",
      data: {
          'facultyid': facultyid.value,
          'facultytitle': facultytitle.value,
          'facultyfirstname': facultyfirstname.value,
          'facultylastname': facultylastname.value,
          'facultyemail': facultyemail.value
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
    this.loadFacultyFromServer();
  },

  render: function () {
    return (
      <div>
        <h1>Faculty</h1>
        <Facultyform onFacultySubmit={this.loadFacultyFromServer} />
        <br />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <FacultyList data={this.state.data} />
        </table>
      </div>
    );
  },
});

var Facultyform = React.createClass({
  getInitialState: function () {
    return {
      facultyid: "",
      facultytitle: "",
      facultyfirstname: "",
      facultylastname: "",
      facultyemail: ""
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var facultyid = this.state.facultyid.trim();
    var facultytitle = this.state.facultytitle.trim();
    var facultyfirstname = this.state.facultyfirstname.trim();
    var facultylastname = this.state.facultylastname.trim();
    var facultyemail = this.state.facultyemail.trim();

    this.props.onFacultySubmit({
      facultyid: facultyid,
      facultytitle: facultytitle,
      facultyfirstname: facultyfirstname,
      facultylastname: facultylastname,
      facultyemail: facultyemail
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
        <h2>Search Through Faculty</h2>
        <table>
          <tbody>
            <tr>
              <th>Faculty ID</th>
              <td>
                <input
                  type="text"
                  name="facultyid"
                  id="facultyid"
                  value={this.state.facultyid}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Faculty Title</th>
              <td>
                <input
                  name="facultytitle"
                  id="facultytitle"
                  value={this.state.facultytitle}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Faculty First Name</th>
              <td>
                <input
                  name="facultyfirstname"
                  id="facultyfirstname"
                  value={this.state.facultyfirstname}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Faculty Last Name</th>
              <td>
                <input
                  name="facultylastname"
                  id="facultylastname"
                  value={this.state.facultylastname}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>Faculty Email</th>
              <td>
                <input
                  name="facultyemail"
                  id="facultyemail"
                  value={this.state.facultyemail}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Faculty" />
      </form>
    );
  },
});
var FacultyList = React.createClass({
  render: function () {
    var facultyNodes = this.props.data.map(function (faculty) {
      //map the data to individual
      return (
        <Faculty
          key={faculty.facultyid}
          facid={faculty.facultyid}
          factitle={faculty.facultytitle}
          facfirstname={faculty.facultyfirstname}
          faclastname={faculty.facultylastname}
          facemail={faculty.facultyemail}
        ></Faculty>
      );
    });

    //print all the nodes in the list
    return <tbody>{facultyNodes}</tbody>;
  },
});

var Faculty = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.facid}</td>
        <td>{this.props.factitle}</td>
        <td>{this.props.facfirstname}</td>
        <td>{this.props.faclastname}</td>
        <td>{this.props.facemail}</td>
      </tr>
    );
  },
});

ReactDOM.render(<FacultyBox />, document.getElementById("content"));
