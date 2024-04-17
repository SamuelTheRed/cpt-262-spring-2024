var PlayerBox = React.createClass({
  getInitialState: function () {
    return { data: [], datalog: [], viewthepage: "" };
  },
  loadPlayersFromServer: function () {
    console.log(playeridSS.value);
    $.ajax({
      url: "/getplayer",
      data: {
        playeridSS: playeridSS.value,
        playerfirstnameSS: playerfirstnameSS.value,
        playerlastnameSS: playerlastnameSS.value,
        playeremailSS: playeremailSS.value,
        playerphoneSS: playerphoneSS.value,
        playerrewardsSS: rewardnum.value,
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
  updateSinglePlrFromServer: function (player) {
    $.ajax({
      url: "/updatesingleplr",
      dataType: "json",
      data: player,
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
  // Check Status
  loadAllowLogin: function () {
    $.ajax({
      url: "/getloggedin",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ datalog: datalog });
        this.setState({ viewthepage: this.state.datalog[0].dbuser_role });
        console.log("Logged in:" + this.state.viewthepage);
        this.loadPlayersFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // On load run function
  componentDidMount: function () {
    this.loadAllowLogin();
    // setInterval(this.loadPlayersFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage != "Manager") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
      return (
        <div>
          <h1>Update Players</h1>
          <Playerform onPlayerSubmit={this.loadPlayersFromServer} />
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
                <PlayerList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              <PlayerUpdateform
                onUpdateSubmit={this.updateSinglePlrFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
  },
});

var Playerform = React.createClass({
  getInitialState: function () {
    return {
      playeridSS: "",
      playerfirstnameSS: "",
      playerlastnameSS: "",
      playeremailSS: "",
      playerphoneSS: "",
      playerrewardsSS: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var playeridSS = this.state.playeridSS.trim();
    var playerfirstnameSS = this.state.playerfirstnameSS.trim();
    var playerlastnameSS = this.state.playerlastnameSS.trim();
    var playeremailSS = this.state.playeremailSS.trim();
    var playerphoneSS = this.state.playerphoneSS.trim();
    var playerrewardsSS = this.state.playerrewardsSS.trim();

    this.props.onPlayerSubmit({
      playeridSS: playeridSS,
      playerfirstnameSS: playerfirstnameSS,
      playerlastnameSS: playerlastnameSS,
      playeremailSS: playeremailSS,
      playerphoneSS: playerphoneSS,
      playerrewardsSS: playerrewardsSS,
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
            <h2>Search Through Players</h2>
            <table>
              <tbody>
                <tr>
                  <th>Player ID</th>
                  <td>
                    <input
                      type="text"
                      name="playeridSS"
                      id="playeridSS"
                      value={this.state.playeridSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player First Name</th>
                  <td>
                    <input
                      name="playerfirstnameSS"
                      id="playerfirstnameSS"
                      value={this.state.playerfirstnameSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Last Name</th>
                  <td>
                    <input
                      name="playerlastnameSS"
                      id="playerlastnameSS"
                      value={this.state.playerlastnameSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Email</th>
                  <td>
                    <input
                      name="playeremailSS"
                      id="playeremailSS"
                      value={this.state.playeremailSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Phone</th>
                  <td>
                    <input
                      name="playerphoneSS"
                      id="playerphoneSS"
                      value={this.state.playerphoneSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Rewards Tier</th>
                  <td>
                    <RewardsList data={this.state.data} />
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
  },
});

var PlayerUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upplayeridSS: "",
      upplayerfirstnameSS: "",
      upplayerlastnameSS: "",
      upplayeremailSS: "",
      upplayerphoneSS: "",
      upplayerrewardsSS: "",
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

    var upplayeridSS = upplridSS.value;
    var upplayeremailSS = upplremailSS.value;
    var upplayerfirstnameSS = upplrfirstnameSS.value;
    var upplayerlastnameSS = upplrlastnameSS.value;
    var upplayerphoneSS = upplrphoneSS.value;
    var upplayerrewardsSS = uprewardnum.value;

    this.props.onUpdateSubmit({
      upplayeridSS: upplayeridSS,
      upplayerfirstnameSS: upplayerfirstnameSS,
      upplayerlastnameSS: upplayerlastnameSS,
      upplayeremailSS: upplayeremailSS,
      upplayerphoneSS: upplayerphoneSS,
      upplayerrewardsSS: upplayerrewardsSS,
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
                  <th>Player First Name</th>
                  <td>
                    <input
                      name="upplrfirstnameSS"
                      id="upplrfirstnameSS"
                      value={this.state.upplrfirstnameSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Last Name</th>
                  <td>
                    <input
                      name="upplrlastnameSS"
                      id="upplrlastnameSS"
                      value={this.state.upplrlastnameSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Email</th>
                  <td>
                    <input
                      name="upplremailSS"
                      id="upplremailSS"
                      value={this.state.upplremailSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Phone</th>
                  <td>
                    <input
                      name="upplrphoneSS"
                      id="upplrphoneSS"
                      value={this.state.upplrphoneSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Player Rewards Tier</th>
                  <td>
                    <UpRewardsList data={this.state.updata} />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upplridSS"
              id="upplridSS"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Player" />
          </form>
        </div>
      </div>
    );
  },
});

var PlayerList = React.createClass({
  render: function () {
    var playerNodes = this.props.data.map(function (player) {
      return (
        <Player
          key={player.dbplayer_id}
          plrid={player.dbplayer_id}
          plrfirstname={player.dbplayer_firstname}
          plrlastname={player.dbplayer_lastname}
          plremail={player.dbplayer_email}
          plrphone={player.dbplayer_phone}
          plrrewards={player.dbplayer_rewardstier}
        ></Player>
      );
    });

    //print all the nodes in the list
    return <tbody>{playerNodes}</tbody>;
  },
});

var Player = React.createClass({
  getInitialState: function () {
    return {
      upplridSS: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupplrid = this.props.plrid;

    this.loadSinglePlr(theupplrid);
  },
  loadSinglePlr: function (theupplrid) {
    $.ajax({
      url: "/getsingleplr",
      data: {
        upplridSS: theupplrid,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populatePlr = this.state.singledata.map(function (player) {
          upplridSS.value = theupplrid;
          upplrfirstnameSS.value = player.dbplayer_firstname;
          upplrlastnameSS.value = player.dbplayer_lastname;
          upplremailSS.value = player.dbplayer_email;
          upplrphoneSS.value = player.dbplayer_phone;
          uprewardnum.value = player.dbplayer_rewardstier;
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
        <td>{this.props.plrid}</td>
        <td>{this.props.plrfirstname}</td>
        <td>{this.props.plremail}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  },
});

var RewardsList = React.createClass({
  render: function () {
    return (
      <select name="rewardnum" id="rewardnum">
        <option key="" value=""></option>
        <option key="1" value="Standard">
          Standard
        </option>
        <option key="2" value="Plus">
          Plus
        </option>
        <option key="3" value="Premium">
          Premium
        </option>
      </select>
    );
  },
});

var UpRewardsList = React.createClass({
  render: function () {
    return (
      <select name="uprewardnum" id="uprewardnum">
        <option key="" value=""></option>
        <option key="1" value="Standard">
          Standard
        </option>
        <option key="2" value="Plus">
          Plus
        </option>
        <option key="3" value="Premium">
          Premium
        </option>
      </select>
    );
  },
});

ReactDOM.render(<PlayerBox />, document.getElementById("content"));
