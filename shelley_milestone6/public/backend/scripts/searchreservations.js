// Create Reservation Box
var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  // Load all reservation items from the database
  loadReservationsFromServer: function () {
    console.log(reservationidSS.value);
    $.ajax({
      url: "/getreservation",
      // Stores the data
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
  // When site is loaded, load reservations
  componentDidMount: function () {
    this.loadReservationsFromServer();
  },
  // Render Reservation Box
  render: function () {
    return (
      <div>
        {/* Page Title */}
        <div className="page_title">
          <h1>Reservations</h1>
        </div>
        {/* Reservation Form */}
        <Reservationform
          onReservationSubmit={this.loadReservationsFromServer}
        />
        <br />
        <div className="result_table">
          {/* Result Table */}
          <table>
            <thead>
              <tr className="result_headers">
                <th>ID</th>
                <th>Date Time</th>
                <th>Player</th>
                <th>User</th>
              </tr>
            </thead>
            <ReservationList data={this.state.data} />
          </table>
        </div>
      </div>
    );
  },
});

// Search Reservation Form to Page
var Reservationform = React.createClass({
  getInitialState: function () {
    return {
      reservationidSS: "",
      reservationdatetimeSS: "",
      reservationplayerSS: "",
      reservationuserSS: "",
    };
  },
  // Handle Search Submit Button
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
  // Handle change in focus
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Render Product Search Form
  render: function () {
    return (
      <form className="form_area" onSubmit={this.handleSubmit}>
        <h2>Search Through Reservations</h2>
        <div className="table_area">
          <table className="form_table">
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
                    type="text"
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
                    type="text"
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
                    type="text"
                    name="reservationuserSS"
                    id="reservationuserSS"
                    value={this.state.reservationuserSS}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <input
            type="submit"
            className="form_submit"
            value="Search Reservation"
          />
        </div>
      </form>
    );
  },
});

// Product List of Products
var ReservationList = React.createClass({
  render: function () {
    var reservationNodes = this.props.data.map(function (reservation) {
      //map the data to individual
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

// Reservation Entity to Fill Reservation List
var Reservation = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.resid}</td>
        <td>{this.props.resdatetime}</td>
        <td>{this.props.resplayer}</td>
        <td>{this.props.resuser}</td>
      </tr>
    );
  },
});

ReactDOM.render(<ReservationBox />, document.getElementById("content"));
