var ReservationBox = React.createClass({
    getInitialState: function () {
      return { data: [] };
    },
    loadReservationsFromServer: function () {
      console.log(reservationid.value);
      $.ajax({
        url: "/getreservation",
        data: {
            'reservationid': reservationid.value,
            'reservationdatetime': reservationdatetime.value,
            'reservationplayer': reservationplayer.value,
            'reservationuser': reservationuser.value,
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
      this.loadReservationsFromServer();
    },
  
    render: function () {
      return (
        <div>
          <h1>Reservations</h1>
          <Reservationform onReservationSubmit={this.loadReservationsFromServer} />
          <br />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date Time</th>
                <th>Player</th>
                <th>User</th>
              </tr>
            </thead>
            <ReservationList data={this.state.data} />
          </table>
        </div>
      );
    },
  });
  
  var Reservationform = React.createClass({
    getInitialState: function () {
      return {
        reservationid: "",
        reservationdatetime: "",
        reservationplayer: "",
        reservationuser: "",
      };
    },
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
    handleChange: function (event) {
      this.setState({
        [event.target.id]: event.target.value,
      });
    },
    render: function () {
      return (
        <form onSubmit={this.handleSubmit}>
          <h2>Search Through Reservations</h2>
          <table>
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
                    name="reservationuser"
                    id="reservationuser"
                    value={this.state.reservationuser}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Search Reservation" />
        </form>
      );
    },
  });
  var ReservationList = React.createClass({
    render: function () {
      var reservationNodes = this.props.data.map(function (reservation) {
        //map the data to individual
        return (
          <Reservation
            key={reservation.reservationid}
            resid={reservation.reservationid}
            resdatetime={reservation.reservationdatetime}
            resplayer={reservation.reservationplayer}
            resuser={reservation.reservationuser}
          ></Reservation>
        );
      });
  
      //print all the nodes in the list
      return <tbody>{reservationNodes}</tbody>;
    },
  });
  
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
  