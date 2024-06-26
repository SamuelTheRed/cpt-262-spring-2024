var UserBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadUsersFromServer: function () {
    console.log(useridSS.value);
    $.ajax({
      url: "/getuser",
      data: {
        useridSS: useridSS.value,
        userfirstnameSS: userfirstnameSS.value,
        userlastnameSS: userlastnameSS.value,
        useremailSS: useremailSS.value,
        userphoneSS: userphoneSS.value,
        userroleSS: rolenum.value,
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
    this.loadUsersFromServer();
  },

  render: function () {
    return (
      <div>
        <h1>Users</h1>
        <Userform onUserSubmit={this.loadUsersFromServer} />
        <br />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role Tier</th>
            </tr>
          </thead>
          <UserList data={this.state.data} />
        </table>
      </div>
    );
  },
});

var Userform = React.createClass({
  getInitialState: function () {
    return {
      useridSS: "",
      userfirstnameSS: "",
      userlastnameSS: "",
      useremailSS: "",
      userphoneSS: "",
      userroleSS: "",
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var useridSS = this.state.useridSS.trim();
    var userfirstnameSS = this.state.userfirstnameSS.trim();
    var userlastnameSS = this.state.userlastnameSS.trim();
    var useremailSS = this.state.useremailSS.trim();
    var userphoneSS = this.state.userphoneSS.trim();
    var userroleSS = rolenum.value;

    this.props.onUserSubmit({
      useridSS: useridSS,
      userfirstnameSS: userfirstnameSS,
      userlastnameSS: userlastnameSS,
      useremailSS: useremailSS,
      userphoneSS: userphoneSS,
      userroleSS: userroleSS,
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
        <h2>Search Through Users</h2>
        <table>
          <tbody>
            <tr>
              <th>User ID</th>
              <td>
                <input
                  type="text"
                  name="useridSS"
                  id="useridSS"
                  value={this.state.useridSS}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>User First Name</th>
              <td>
                <input
                  name="userfirstnameSS"
                  id="userfirstnameSS"
                  value={this.state.userfirstnameSS}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>User Last Name</th>
              <td>
                <input
                  name="userlastnameSS"
                  id="userlastnameSS"
                  value={this.state.userlastnameSS}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>User Email</th>
              <td>
                <input
                  name="useremailSS"
                  id="useremailSS"
                  value={this.state.useremailSS}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>User Phone</th>
              <td>
                <input
                  name="userphoneSS"
                  id="userphoneSS"
                  value={this.state.userphoneSS}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>User Role Tier</th>
              <td>
                <RolesList data={this.state.data} />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search User" />
      </form>
    );
  },
});
var UserList = React.createClass({
  render: function () {
    var userNodes = this.props.data.map(function (user) {
      //map the data to individual
      return (
        <User
          key={user.dbuser_id}
          usrid={user.dbuser_id}
          usrfirstname={user.dbuser_firstname}
          usrlastname={user.dbuser_lastname}
          usremail={user.dbuser_email}
          usrphone={user.dbuser_phone}
          usrrole={user.dbuser_role}
        ></User>
      );
    });

    //print all the nodes in the list
    return <tbody>{userNodes}</tbody>;
  },
});

var User = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.usrid}</td>
        <td>{this.props.usrfirstname}</td>
        <td>{this.props.usrlastname}</td>
        <td>{this.props.usremail}</td>
        <td>{this.props.usrphone}</td>
        <td>{this.props.usrrole}</td>
      </tr>
    );
  },
});

var RolesList = React.createClass({
  render: function () {
    return (
      <select name="rolenum" id="rolenum">
        <option key="0" value="">
          --
        </option>
        <option key="1" value="Admin">
          Admin
        </option>
        <option key="2" value="Privileged">
          Privileged
        </option>
        <option key="3" value="Player">
          Player
        </option>
      </select>
    );
  },
});

ReactDOM.render(<UserBox />, document.getElementById("content"));
