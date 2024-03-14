var UserBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadUsersFromServer: function () {
        $.ajax({
            url: '/getusr',
            data: {
                'userid': userid.value,
                'userfirstname': userfirstname.value,
                'useremail': useremail.value,
                'userphone': userphone.value,
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateSingleUsrFromServer: function (user) {
        
        $.ajax({
            url: '/updatesingleusr',
            dataType: 'json',
            data: user,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
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
                <Userform2 onUserSubmit={this.loadUsersFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
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
                        <UserList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <UserUpdateform onUpdateSubmit={this.updateSingleUsrFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Userform2 = React.createClass({
    getInitialState: function () {
        return {
            userkey: "",
            userid: "",
            userfirstname: "",
            useremail: "",
            userphone: "",
            data: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadUsrTypes: function () {
        $.ajax({
            url: '/getusrtypes',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadUsrTypes();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var userid = this.state.userid.trim();
        var useremail = this.state.useremail.trim();
        var userfirstname = this.state.userfirstname.trim();
        var userphone = this.state.userphone.trim();

        this.props.onUserSubmit({ 
            userid: userid,
            userfirstname: userfirstname,
            useremail: useremail,
            userphone: userphone,
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
        <div>
            <div id = "theform">
            <form onSubmit={this.handleSubmit}>
                <h2>Users</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>User ID</th>
                            <td>
                                <input type="text" name="userid" id="userid" value={this.state.userid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>User Name</th>
                            <td>
                                <input name="userfirstname" id="userfirstname" value={this.state.userfirstname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>User Email</th>
                            <td>
                                <input name="useremail" id="useremail" value={this.state.useremail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>User Phone</th>
                            <td>
                                <input name="userphone" id="userphone" value={this.state.userphone} onChange={this.handleChange}  />
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
    }
});

var UserUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upuserkey: "",
            upuserid: "",
            upuserfirstname: "",
            upuseremail: "",
            upuserphone: "",
            updata: []
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadUsrTypes: function () {
        $.ajax({
            url: '/getusrtypes',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ updata: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadUsrTypes();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upuserkey = upusrkey.value;
        var upuserid = upusrid.value;
        var upuseremail = upusremail.value;
        var upuserfirstname = upusrfirstname.value;
        var upuserphone = upusrphone.value;

        this.props.onUpdateSubmit({
            upuserkey: upuserkey,
            upuserid: upuserid,
            upuserfirstname: upuserfirstname,
            upuseremail: upuseremail,
            upuserphone: upuserphone,
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
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
        <th>User ID</th>
        <td>
<input type="text" name="upusrid" id="upusrid" value={this.state.upusrid} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>User Name</th>
        <td>
<input name="upusrfirstname" id="upusrfirstname" value={this.state.upusrfirstname} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>User Email</th>
        <td>
<input name="upusremail" id="upusremail" value={this.state.upusremail} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>User Phone</th>
        <td>
<input name="upusrphone" id="upusrphone" value={this.state.upusrphone} onChange={this.state.handleUpChange} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upusrkey" id="upusrkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update User" />
                    </form>
                </div>
            </div>
        );
    }
});

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
                >
                </User>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {userNodes}
            </tbody>
        );
    }
});

var User = React.createClass({
    getInitialState: function () {
        return {
            upusrkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupusrkey = this.props.usrkey;
        
        this.loadSingleUsr(theupusrkey);
    },
    loadSingleUsr: function (theupusrkey) {
        $.ajax({
            url: '/getsingleusr',
            data: {
                'upusrkey': theupusrkey
            },
            dataType: 'json',
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
            }.bind(this)
        });
        
    },

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.usrkey} 
                            </td>
                            <td>
                                {this.props.usrid}
                            </td>
                            <td>
                                {this.props.usrfirstname}
                            </td>
                            <td>
                                {this.props.usremail}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

var SelectList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (usrTypes) {
            return (
                <option
                    key = {usrTypes.dbusrtypeid}
                    value= {usrTypes.dbusrtypeid}
                >
                    {usrTypes.dbusrtypefirstname}        
                </option>
            );
        });
        return (
            <select name = "usrtype" id = "usrtype">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (usrTypes) {
            return (
                <option
                    key={usrTypes.dbusrtypeid}
                    value={usrTypes.dbusrtypeid}
                >
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
    }
});

ReactDOM.render(
    <UserBox />,
    document.getElementById('content')
);