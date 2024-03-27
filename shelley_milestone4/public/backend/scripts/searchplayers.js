var PlayerBox = React.createClass({
    getInitialState: function () {
      return { data: [] };
    },
    loadPlayersFromServer: function () {
      console.log(playerid.value);
      $.ajax({
        url: "/getplayer",
        data: {
            'playerid': playerid.value,
            'playerfirstname': playerfirstname.value,
            'playerlastname': playerlastname.value,
            'playeremail': playeremail.value,
            'playerphone': playerphone.value
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
      this.loadPlayersFromServer();
    },
  
    render: function () {
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
              </tr>
            </thead>
            <PlayerList data={this.state.data} />
          </table>
        </div>
      );
    },
  });
  
  var Playerform = React.createClass({
    getInitialState: function () {
      return {
        playerid: "",
        playerfirstname: "",
        playerlastname: "",
        playeremail: "",
        playerphone: ""
      };
    },
    handleSubmit: function (e) {
      e.preventDefault();
  
      var playerid = this.state.playerid.trim();
      var playerfirstname = this.state.playerfirstname.trim();
      var playerlastname = this.state.playerlastname.trim();
      var playeremail = this.state.playeremail.trim();
      var playerphone = this.state.playerphone.trim();
  
      this.props.onPlayerSubmit({
        playerid: playerid,
        playerfirstname: playerfirstname,
        playerlastname: playerlastname,
        playeremail: playeremail,
        playerphone: playerphone
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
                    name="playerid"
                    id="playerid"
                    value={this.state.playerid}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Player First Name</th>
                <td>
                  <input
                    name="playerfirstname"
                    id="playerfirstname"
                    value={this.state.playerfirstname}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Player Last Name</th>
                <td>
                  <input
                    name="playerlastname"
                    id="playerlastname"
                    value={this.state.playerlastname}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Player Email</th>
                <td>
                  <input
                    name="playeremail"
                    id="playeremail"
                    value={this.state.playeremail}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Player Phone</th>
                <td>
                  <input
                    name="playerphone"
                    id="playerphone"
                    value={this.state.playerphone}
                    onChange={this.handleChange}
                  />
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
            key={player.playerid}
            plrid={player.playerid}
            plrfirstname={player.playerfirstname}
            plrlastname={player.playerlastname}
            plremail={player.playeremail}
            plrphone={player.playerphone}
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
        </tr>
      );
    },
  });
  
  ReactDOM.render(<PlayerBox />, document.getElementById("content"));
  