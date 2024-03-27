// Create Reservation Box
var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  // Load all reservation items from the database
  loadReservationsFromServer: function () {
    console.log(reservationid.value);
    $.ajax({
      url: "/getreservation",
      // Stores the data
      data: {
        reservationid: reservationid.value,
        reservationdatetime: reservationdatetime.value,
        reservationplayer: reservationplayer.value,
        reservationuser: reservationuser.value,
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
  // Render Product Box
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
      reservationid: "",
      reservationdatetime: "",
      reservationplayer: "",
      reservationuser: "",
    };
  },
  // Handle Search Submit Button
  handleSubmit: function (e) {
    e.preventDefault();

    var reservationid = this.state.reservationid.trim();
    var reservationdatetime = this.state.reservationdatetime.trim();
    var reservationplayer = this.state.reservationplayer.trim();
    var reservationuser = this.state.reservationuser.trim();

    this.props.onReservationSubmit({
      reservationid: reservationid,
      reservationdatetime: reservationdatetime,
      reservationplayer: reservationplayer,
      reservationuser: reservationuser,
    });
  },
  // Handle change in focus
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Render Reservations Search Form
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
                    name="reservationid"
                    id="reservationid"
                    value={this.state.reservationid}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Reservation Date Time</th>
                <td>
                  <input
                    type="text"
                    name="reservationdatetime"
                    id="reservationdatetime"
                    value={this.state.reservationdatetime}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Reservation Player</th>
                <td>
                  <input
                    type="text"
                    name="reservationplayer"
                    id="reservationplayer"
                    value={this.state.reservationplayer}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Reservation User</th>
                <td>
                  <input
                    type="text"
                    name="reservationuser"
                    id="reservationuser"
                    value={this.state.reservationuser}
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

// Reservsation List of Reservations
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
