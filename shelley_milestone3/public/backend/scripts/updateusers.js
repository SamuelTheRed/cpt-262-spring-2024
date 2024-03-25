// User Box Element for Update User HTML Page
var UserBox = React.createClass({
    // Sets Initial State of data
    getInitialState: function () {
      return { data: [] };
    },
    // Loads Users from Server into data
    loadUsersFromServer: function () {
      $.ajax({
        url: "/getusr",
        data: {
          userid: userid.value,
          userfirstname: userfirstname.value,
          useremail: useremail.value,
          userphone: userphone.value,
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
    // Run Post API call to update selected user
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
      // Reload Page
      window.location.reload(true);
    },
    // When page is loaded, load Users from server
    componentDidMount: function () {
      this.loadUsersFromServer();
      // setInterval(this.loadUsersFromServer, this.props.pollInterval);
    },
    // Renders User Box into HTML Page
    render: function () {
      return (
        <div>
          <h1>Update Users</h1>
          {/* User Form Element with added parameter for load users on submit */}
          <Userform onUserSubmit={this.loadUsersFromServer} />
          <br />
          {/* Results of Get API Call React Forms */}
          <div id="theresults">
            {/* Left Table to display information about available users to update */}
            <div id="theleft">
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                {/* User List of available users to update */}
                <UserList data={this.state.data} />
              </table>
            </div>
            {/* Individual User that will be updated */}
            <div id="theright">
              <UserUpdateform onUpdateSubmit={this.updateSingleUsrFromServer} />
            </div>
          </div>
        </div>
      );
    },
  });
  
  // User Form for User Box
  var Userform = React.createClass({
    // Sets initial state of all user data
    getInitialState: function () {
      return {
        userkey: "",
        userid: "",
        userfirstname: "",
        useremail: "",
        userphone: "",
        data: [],
      };
    },
    // Handles change in select list
    handleOptionChange: function (e) {
      this.setState({
        selectedOption: e.target.value,
      });
    },
    // Loads User Types on load
    loadUsrTypes: function () {
      $.ajax({
        url: "/getusrtypes",
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
    // When page is ready, loads users
    componentDidMount: function () {
      this.loadUsrTypes();
    },
    // Handles form submit
    handleSubmit: function (e) {
      e.preventDefault();
  
      var userid = this.state.userid.trim();
      var useremail = this.state.useremail.trim();
      var userfirstname = this.state.userfirstname.trim();
      var userphone = this.state.userphone.trim();
      // On submit, use user-specified information
      this.props.onUserSubmit({
        userid: userid,
        userfirstname: userfirstname,
        useremail: useremail,
        userphone: userphone,
      });
    },
    // Handles changes in text inputs
    handleChange: function (event) {
      this.setState({
        [event.target.id]: event.target.value,
      });
    },
    // Renders User Form
    render: function () {
      return (
        <div>
          <div id="theform">
            <form onSubmit={this.handleSubmit}>
              <h2>Users</h2>
              <table>
                <tbody>
                  <tr>
                    {/* User ID Search */}
                    <th>User ID</th>
                    <td>
                      <input
                        type="text"
                        name="userid"
                        id="userid"
                        value={this.state.userid}
                        onChange={this.handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    {/* User Name Search */}
                    <th>User Name</th>
                    <td>
                      <input
                        name="userfirstname"
                        id="userfirstname"
                        value={this.state.userfirstname}
                        onChange={this.handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    {/* User Email Search */}
                    <th>User Email</th>
                    <td>
                      <input
                        name="useremail"
                        id="useremail"
                        value={this.state.useremail}
                        onChange={this.handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    {/* User Phone Search */}
                    <th>User Phone</th>
                    <td>
                      <input
                        name="userphone"
                        id="userphone"
                        value={this.state.userphone}
                        onChange={this.handleChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Updated User Submit */}
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
  
  // User Update Form for User Box
  var UserUpdateform = React.createClass({
    // Sets Initial state for updated user information
    getInitialState: function () {
      return {
        upuserkey: "",
        upuserid: "",
        upuserfirstname: "",
        upuseremail: "",
        upuserphone: "",
        updata: [],
      };
    },
    // Handles select list option change
    handleUpOptionChange: function (e) {
      this.setState({
        upselectedOption: e.target.value,
      });
    },
    // Loads user types form database
    loadUsrTypes: function () {
      $.ajax({
        url: "/getusrtypes",
        dataType: "json",
        cache: false,
        success: function (data) {
          this.setState({ updata: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this),
      });
    },
    // When page is ready, load user types
    componentDidMount: function () {
      this.loadUsrTypes();
    },
    // Handle form submit
    handleUpSubmit: function (e) {
      e.preventDefault();
  
      var upuserkey = upusrkey.value;
      var upuserid = upusrid.value;
      var upuseremail = upusremail.value;
      var upuserfirstname = upusrfirstname.value;
      var upuserphone = upusrphone.value;
  
      // Set props to user-specified information
      this.props.onUpdateSubmit({
        upuserkey: upuserkey,
        upuserid: upuserid,
        upuserfirstname: upuserfirstname,
        upuseremail: upuseremail,
        upuserphone: upuserphone,
      });
    },
    // Handles change in text inputs
    handleUpChange: function (event) {
      this.setState({
        [event.target.id]: event.target.value,
      });
    },
    // Renders Update User Form
    render: function () {
      return (
        <div>
          <div id="theform">
            <form onSubmit={this.handleUpSubmit}>
              <table>
                <tbody>
                  <tr>
                    {/* User ID Change */}
                    <th>User ID</th>
                    <td>
                      <input
                        type="text"
                        name="upusrid"
                        id="upusrid"
                        value={this.state.upusrid}
                        onChange={this.state.handleUpChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    {/* User Name Change */}
                    <th>User Name</th>
                    <td>
                      <input
                        name="upusrfirstname"
                        id="upusrfirstname"
                        value={this.state.upusrfirstname}
                        onChange={this.state.handleUpChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    {/* User Email Change */}
                    <th>User Email</th>
                    <td>
                      <input
                        name="upusremail"
                        id="upusremail"
                        value={this.state.upusremail}
                        onChange={this.state.handleUpChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    {/* User Phone Change */}
                    <th>User Phone</th>
                    <td>
                      <input
                        name="upusrphone"
                        id="upusrphone"
                        value={this.state.upusrphone}
                        onChange={this.state.handleUpChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              {/* Submit User Input */}
              <input
                type="hidden"
                name="upusrkey"
                id="upusrkey"
                onChange={this.handleUpChange}
              />
              <input type="submit" value="Update User" />
            </form>
          </div>
        </div>
      );
    },
  });
  
  // User List for The Left Table of Available users to update
  var UserList = React.createClass({
    render: function () {
      var userNodes = this.props.data.map(function (user) {
        return (
          <User
            key={user.dbuserkey}
            usrkey={user.dbuserkey}
            usrid={user.dbuserid}
            usrfirstname={user.dbuserfirstname}
            usremail={user.dbuseremail}
          ></User>
        );
      });
  
      //print all the nodes in the list
      return <tbody>{userNodes}</tbody>;
    },
  });
  
  // User Class to initialize a user object react component
  var User = React.createClass({
    // Sets initial state of user
    getInitialState: function () {
      return {
        upusrkey: "",
        singledata: [],
      };
    },
    // updates record of specified user
    updateRecord: function (e) {
      e.preventDefault();
      var theupusrkey = this.props.usrkey;
  
      this.loadSingleUsr(theupusrkey);
    },
    // Loads queried user from the database
    loadSingleUsr: function (theupusrkey) {
      $.ajax({
        url: "/getsingleusr",
        data: {
          upusrkey: theupusrkey,
        },
        dataType: "json",
        cache: false,
        success: function (data) {
          this.setState({ singledata: data });
          console.log(this.state.singledata);
          var populateUsr = this.state.singledata.map(function (user) {
            upusrkey.value = theupusrkey;
            upusremail.value = user.dbuseremail;
            upusrid.value = user.dbuserid;
            upusrphone.value = user.dbuserphone;
            upusrsalary.value = user.dbusersalary;
            upusrfirstname.value = user.dbuserfirstname;
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this),
      });
    },
    // Renders the User as an HTMl segment
    render: function () {
      return (
        <tr>
          <td>{this.props.usrkey}</td>
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
  
  // Select List for Spefified User type
  var SelectList = React.createClass({
    render: function () {
      var optionNodes = this.props.data.map(function (usrTypes) {
        return (
          <option key={usrTypes.dbusrtypeid} value={usrTypes.dbusrtypeid}>
            {usrTypes.dbusrtypefirstname}
          </option>
        );
      });
      return (
        <select name="usrtype" id="usrtype">
          <option value="0"></option>
          {optionNodes}
        </select>
      );
    },
  });
  // Update List User type
  var SelectUpdateList = React.createClass({
    render: function () {
      var optionNodes = this.props.data.map(function (usrTypes) {
        return (
          <option key={usrTypes.dbusrtypeid} value={usrTypes.dbusrtypeid}>
            {usrTypes.dbusrtypefirstname}
          </option>
        );
      });
      return (
        <select name="upusrtype" id="upusrtype">
          <option value="0"></option>
          {optionNodes}
        </select>
      );
    },
  });
  // Renders User Box
  ReactDOM.render(<UserBox />, document.getElementById("content"));
  