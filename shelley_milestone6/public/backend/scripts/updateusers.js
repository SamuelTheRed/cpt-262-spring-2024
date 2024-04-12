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
  updateSingleUsrFromServer: function (user) {
    $.ajax({
      url: "/updatesingleusr",
      dataType: "json",
      data: user,
      type: "POST",
      cache: false,
      success: function (upsingledata) {
        this.setState({ upsingledata: upsingledata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },
  componentDidMount: function () {
    this.loadUsersFromServer();
    // setInterval(this.loadUsersFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <h1>Update Users</h1>
        <Userform onUserSubmit={this.loadUsersFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <UserList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <UserUpdateform onUpdateSubmit={this.updateSingleUsrFromServer} />
          </div>
        </div>
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
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var useridSS = this.state.useridSS.trim();
    var userfirstnameSS = this.state.userfirstnameSS.trim();
    var userlastnameSS = this.state.userlastnameSS.trim();
    var useremailSS = this.state.useremailSS.trim();
    var userphoneSS = this.state.userphoneSS.trim();
    var userroleSS = this.state.userroleSS.trim();

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
      <div>
        <div id="theform">
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
                  <th>User Roles Tier</th>
                  <td>
                    <RolesList data={this.state.data} />
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Search User" />
          </form>
        </div>
        <div>
          <br />
          <form onSubmit={this.getInitialState}>
            <input type="submit" value="Clear Form" />
          </form>
        </div>
      </div>
    );
  },
});

var UserUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upuseridSS: "",
      upuserfirstnameSS: "",
      upuserlastnameSS: "",
      upuseremailSS: "",
      upuserphoneSS: "",
      upuserroleSS: "",
      updata: [],
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upuseridSS = upusridSS.value;
    var upuseremailSS = upusremailSS.value;
    var upuserfirstnameSS = upusrfirstnameSS.value;
    var upuserlastnameSS = upusrlastnameSS.value;
    var upuserphoneSS = upusrphoneSS.value;
    var upuserroleSS = uprolenum.value;

    this.props.onUpdateSubmit({
      upuseridSS: upuseridSS,
      upuserfirstnameSS: upuserfirstnameSS,
      upuserlastnameSS: upuserlastnameSS,
      upuseremailSS: upuseremailSS,
      upuserphoneSS: upuserphoneSS,
      upuserroleSS: upuserroleSS,
    });
  },
  handleUpChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <div>
        <div id="theform">
          <form onSubmit={this.handleUpSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>User First Name</th>
                  <td>
                    <input
                      name="upusrfirstnameSS"
                      id="upusrfirstnameSS"
                      value={this.state.upusrfirstnameSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>User Last Name</th>
                  <td>
                    <input
                      name="upusrlastnameSS"
                      id="upusrlastnameSS"
                      value={this.state.upusrlastnameSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>User Email</th>
                  <td>
                    <input
                      name="upusremailSS"
                      id="upusremailSS"
                      value={this.state.upusremailSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>User Phone</th>
                  <td>
                    <input
                      name="upusrphoneSS"
                      id="upusrphoneSS"
                      value={this.state.upusrphoneSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>User Roles Tier</th>
                  <td>
                    <UpRolesList data={this.state.updata} />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upusridSS"
              id="upusridSS"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update User" />
          </form>
        </div>
      </div>
    );
  },
});

var UserList = React.createClass({
  render: function () {
    var userNodes = this.props.data.map(function (user) {
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
  getInitialState: function () {
    return {
      upusridSS: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupusrid = this.props.usrid;

    this.loadSingleUsr(theupusrid);
  },
  loadSingleUsr: function (theupusrid) {
    $.ajax({
      url: "/getsingleusr",
      data: {
        upusridSS: theupusrid,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateUsr = this.state.singledata.map(function (user) {
          upusridSS.value = theupusrid;
          upusrfirstnameSS.value = user.dbuser_firstname;
          upusrlastnameSS.value = user.dbuser_lastname;
          upusremailSS.value = user.dbuser_email;
          upusrphoneSS.value = user.dbuser_phone;
          uprolenum.value = user.dbuser_role;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    return (
      <tr>
        <td>{this.props.usrid}</td>
        <td>{this.props.usrfirstname}</td>
        <td>{this.props.usremail}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
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
        <option key="1" value="Manager">
          Manager
        </option>
        <option key="2" value="Front-Desk">
          Front-Desk
        </option>
        <option key="3" value="Assistant">
          Assistant
        </option>
      </select>
    );
  },
});
var UpRolesList = React.createClass({
  render: function () {
    return (
      <select name="uprolenum" id="uprolenum">
        <option key="0" value="">
          --
        </option>
        <option key="1" value="Manager">
          Manager
        </option>
        <option key="2" value="Front-Desk">
          Front-Desk
        </option>
        <option key="3" value="Assistant">
          Assistant
        </option>
      </select>
    );
  },
});

ReactDOM.render(<UserBox />, document.getElementById("content"));
