var PlayerBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadPlayersFromServer: function () {

        $.ajax({
            url: '/getplr',
            data: {
                'playerid': playerid.value,
                'playerfirstname': playerfirstname.value,
                'playeremail': playeremail.value,
                'playerphone': playerphone.value,
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
    updateSinglePlrFromServer: function (player) {
        
        $.ajax({
            url: '/updatesingleplr',
            dataType: 'json',
            data: player,
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
        this.loadPlayersFromServer();
       // setInterval(this.loadPlayersFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Update Players</h1>
                <Playerform2 onPlayerSubmit={this.loadPlayersFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                         </thead>
                        <PlayerList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <PlayerUpdateform onUpdateSubmit={this.updateSinglePlrFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Playerform2 = React.createClass({
    getInitialState: function () {
        return {
            playerkey: "",
            playerid: "",
            playerfirstname: "",
            playeremail: "",
            playerphone: "",
            data: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadPlrTypes: function () {
        $.ajax({
            url: '/getplrtypes',
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
        this.loadPlrTypes();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var playerid = this.state.playerid.trim();
        var playeremail = this.state.playeremail.trim();
        var playerfirstname = this.state.playerfirstname.trim();
        var playerphone = this.state.playerphone.trim();

        this.props.onPlayerSubmit({ 
            playerid: playerid,
            playerfirstname: playerfirstname,
            playeremail: playeremail,
            playerphone: playerphone,
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
                <h2>Players</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Player ID</th>
                            <td>
                                <input type="text" name="playerid" id="playerid" value={this.state.playerid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Player First Name</th>
                            <td>
                                <input name="playerfirstname" id="playerfirstname" value={this.state.playerfirstname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Player Email</th>
                            <td>
                                <input name="playeremail" id="playeremail" value={this.state.playeremail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Player Phone</th>
                            <td>
                                <input name="playerphone" id="playerphone" value={this.state.playerphone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Player" />

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

var PlayerUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upplayerkey: "",
            upplayerid: "",
            upplayerfirstname: "",
            upplayeremail: "",
            upplayerphone: "",
            updata: []
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadPlrTypes: function () {
        $.ajax({
            url: '/getplrtypes',
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
        this.loadPlrTypes();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upplayerkey = upplrkey.value;
        var upplayerid = upplrid.value;
        var upplayeremail = upplremail.value;
        var upplayerfirstname = upplrfirstname.value;
        var upplayerphone = upplrphone.value;

        this.props.onUpdateSubmit({
            upplayerkey: upplayerkey,
            upplayerid: upplayerid,
            upplayerfirstname: upplayerfirstname,
            upplayeremail: upplayeremail,
            upplayerphone: upplayerphone,
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
        <th>Player ID</th>
        <td>
<input type="text" name="upplrid" id="upplrid" value={this.state.upplrid} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Player First Name</th>
        <td>
<input name="upplrfirstname" id="upplrfirstname" value={this.state.upplrfirstname} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Player Email</th>
        <td>
<input name="upplremail" id="upplremail" value={this.state.upplremail} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Player Phone</th>
        <td>
<input name="upplrphone" id="upplrphone" value={this.state.upplrphone} onChange={this.state.handleUpChange} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upplrkey" id="upplrkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Player" />
                    </form>
                </div>
            </div>
        );
    }
});

var PlayerList = React.createClass({
    render: function () {
        var playerNodes = this.props.data.map(function (player) {
            return (
                <Player
                    key={player.dbplayerkey}
                    plrkey={player.dbplayerkey}
                    plrid={player.dbplayerid}
                    plrfirstname={player.dbplayerfirstname}
                    plremail={player.dbplayeremail}
                >
                </Player>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {playerNodes}
            </tbody>
        );
    }
});

var Player = React.createClass({
    getInitialState: function () {
        return {
            upplrkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupplrkey = this.props.plrkey;
        
        this.loadSinglePlr(theupplrkey);
    },
    loadSinglePlr: function (theupplrkey) {
        $.ajax({
            url: '/getsingleplr',
            data: {
                'upplrkey': theupplrkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populatePlr = this.state.singledata.map(function (player) {
                    upplrkey.value = theupplrkey;
                    upplremail.value = player.dbplayeremail;
                    upplrid.value = player.dbplayerid;
                    upplrphone.value = player.dbplayerphone;

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
                                {this.props.plrkey} 
                            </td>
                            <td>
                                {this.props.plrid}
                            </td>
                            <td>
                                {this.props.plrfirstname}
                            </td>
                            <td>
                                {this.props.plremail}
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
        var optionNodes = this.props.data.map(function (plrTypes) {
            return (
                <option
                    key = {plrTypes.dbplrtypeid}
                    value= {plrTypes.dbplrtypeid}
                >
                    {plrTypes.dbplrtypefirstname}        
                </option>
            );
        });
        return (
            <select name = "plrtype" id = "plrtype">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (plrTypes) {
            return (
                <option
                    key={plrTypes.dbplrtypeid}
                    value={plrTypes.dbplrtypeid}
                >
                    {plrTypes.dbplrtypefirstname}
                </option>
            );
        });
        return (
            <select name="upplrtype" id="upplrtype">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PlayerBox />,
    document.getElementById('content')
);