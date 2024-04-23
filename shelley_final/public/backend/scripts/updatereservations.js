var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [], datalog: [], viewthepage: "" };
  },
  loadReservationsFromServer: function () {
    console.log(reservationidSS.value);
    $.ajax({
      url: "/getreservation",
      data: {
        reservationidSS: reservationidSS.value,
        reservationdatetimeSS: reservationdatetimeSS.value,
        reservationplayerSS: reservationplayerSS.value,
        reservationuserSS: reservationuserSS.value,
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
  updateSingleResFromServer: function (reservation) {
    $.ajax({
      url: "/updatesingleres",
      dataType: "json",
      data: reservation,
      type: "POST",
      cache: false,
      success: function (upsingledata) {
        this.setState({ upsingledata: upsingledata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    setTimeout(function(){
      window.location.reload(true);
    }, 500);
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
        this.loadReservationsFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // On load run function
  componentDidMount: function () {
    this.loadAllowLogin();
    // setInterval(this.loadReservationsFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage != "Manager") {
      console.log("This: " + this.state.viewthepage);
      return <div>You do not have access to this page</div>;
    } else {
      return (
        <div>
          <h1>Update Reservations</h1>
          <Reservationform onReservationSubmit={this.loadReservationsFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date Time</th>
                    <th>Player</th>
                    <th></th>
                  </tr>
                </thead>
                <ReservationList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              <ReservationUpdateform
                onUpdateSubmit={this.updateSingleResFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
  },
});

var Reservationform = React.createClass({
  getInitialState: function () {
    return {
      reservationidSS: "",
      reservationdatetimeSS: "",
      reservationplayerSS: "",
      reservationuserSS: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var reservationidSS = this.state.reservationidSS.trim();
    var reservationdatetimeSS = this.state.reservationdatetimeSS.trim();
    var reservationplayerSS = this.state.reservationplayerSS.trim();
    var reservationuserSS = this.state.reservationuserSS.trim();

    this.props.onReservationSubmit({
      reservationidSS: reservationidSS,
      reservationdatetimeSS: reservationdatetimeSS,
      reservationplayerSS: reservationplayerSS,
      reservationuserSS: reservationuserSS,
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
            <h2>Search Through Reservations</h2>
            <table>
              <tbody>
                <tr>
                  <th>Reservation ID</th>
                  <td>
                    <input
                      type="text"
                      name="reservationidSS"
                      id="reservationidSS"
                      value={this.state.reservationidSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Date Time</th>
                  <td>
                    <input
                      name="reservationdatetimeSS"
                      id="reservationdatetimeSS"
                      value={this.state.reservationdatetimeSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Player</th>
                  <td>
                    <input
                      name="reservationplayerSS"
                      id="reservationplayerSS"
                      value={this.state.reservationplayerSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Reservation User</th>
                  <td>
                    <input
                      name="reservationuserSS"
                      id="reservationuserSS"
                      value={this.state.reservationuserSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Search Reservation" />
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

var ReservationUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upreservationidSS: "",
      upreservationdatetimeSS: "",
      upreservationplayerSS: "",
      upreservationuserSS: "",
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upreservationidSS = upresidSS.value;
    var upreservationuserSS = upresuserSS.value;
    var upreservationdatetimeSS = upresdatetimeSS.value;
    var upreservationplayerSS = upresplayerSS.value;

    this.props.onUpdateSubmit({
      upreservationidSS: upreservationidSS,
      upreservationdatetimeSS: upreservationdatetimeSS,
      upreservationplayerSS: upreservationplayerSS,
      upreservationuserSS: upreservationuserSS,
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
                  <th>Reservation Date Time</th>
                  <td>
                    <input
                      name="upresdatetimeSS"
                      id="upresdatetimeSS"
                      value={this.state.upresdatetimeSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Player</th>
                  <td>
                    <input
                      name="upresplayerSS"
                      id="upresplayerSS"
                      value={this.state.upresplayerSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Reservation User</th>
                  <td>
                    <input
                      name="upresuserSS"
                      id="upresuserSS"
                      value={this.state.upresuserSS}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upresidSS"
              id="upresidSS"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Reservation" />
          </form>
        </div>
      </div>
    );
  },
});

var ReservationList = React.createClass({
  render: function () {
    var reservationNodes = this.props.data.map(function (reservation) {
      return (
        <Reservation
          key={reservation.dbreservation_id}
          resid={reservation.dbreservation_id}
          resdatetime={reservation.dbreservation_datetime}
          resplayer={reservation.dbplayer_email}
          resuser={reservation.dbuser_firstname}
        ></Reservation>
      );
    });

    //print all the nodes in the list
    return <tbody>{reservationNodes}</tbody>;
  },
});

var Reservation = React.createClass({
  getInitialState: function () {
    return {
      upresidSS: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupresid = this.props.resid;

    this.loadSingleRes(theupresid);
  },
  loadSingleRes: function (theupresid) {
    $.ajax({
      url: "/getsingleres",
      data: {
        upresidSS: theupresid,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateRes = this.state.singledata.map(function (reservation) {
          upresidSS.value = theupresid;
          upresdatetimeSS.value = reservation.dbreservation_datetime;
          upresplayerSS.value = reservation.dbplayer_id;
          upresuserSS.value = reservation.dbuser_id;
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
        <td>{this.props.resid}</td>
        <td>{this.props.resdatetime}</td>
        <td>{this.props.resplayer}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  },
});

ReactDOM.render(<ReservationBox />, document.getElementById("content"));
