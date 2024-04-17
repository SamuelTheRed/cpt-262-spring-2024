var PlayerBox = React.createClass({
  getInitialState: function () {
    return { data: [], datalog: [], viewthepage: "" };
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
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  loadPlayersFromServer: function () {
    console.log(playeridSS.value);
    $.ajax({
      url: "/getplayer",
      data: {
        'playeridSS': playeridSS.value,
        'playerfirstnameSS': playerfirstnameSS.value,
        'playerlastnameSS': playerlastnameSS.value,
        'playeremailSS': playeremailSS.value,
        'playerphoneSS': playerphoneSS.value,
        'playerrewardsSS': rewardnum.value
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
  // On load run function
  componentDidMount: function () {
    this.loadAllowLogin();
    this.loadPlayersFromServer();
  },

  render: function () {
    if (this.state.viewthepage != "Manager") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
      return (
        <div>
          <h1>Players</h1>
          <Playerform onPlayerSubmit={this.loadPlayersFromServer} />
          <br />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Rewards Tier</th>
              </tr>
            </thead>
            <PlayerList data={this.state.data} />
          </table>
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
  handleSubmit: function (e) {
    e.preventDefault();

    var playeridSS = this.state.playeridSS.trim();
    var playerfirstnameSS = this.state.playerfirstnameSS.trim();
    var playerlastnameSS = this.state.playerlastnameSS.trim();
    var playeremailSS = this.state.playeremailSS.trim();
    var playerphoneSS = this.state.playerphoneSS.trim();
    var playerrewardsSS = rewardnum.value;

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
    );
  },
});
var PlayerList = React.createClass({
  render: function () {
    var playerNodes = this.props.data.map(function (player) {
      //map the data to individual
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
  render: function () {
    return (
      <tr>
        <td>{this.props.plrid}</td>
        <td>{this.props.plrfirstname}</td>
        <td>{this.props.plrlastname}</td>
        <td>{this.props.plremail}</td>
        <td>{this.props.plrphone}</td>
        <td>{this.props.plrrewards}</td>
      </tr>
    );
  },
});

var RewardsList = React.createClass({
  render: function () {
    return (
      <select name="rewardnum" id="rewardnum">
        <option key="0" value="">
          --
        </option>
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
