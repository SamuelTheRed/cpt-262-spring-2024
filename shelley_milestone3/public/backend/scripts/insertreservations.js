var ReservationBox = React.createClass({
  handleReservationSubmit: function (reservation) {
    $.ajax({
      url: "/reservation",
      dataType: "json",
      type: "POST",
      data: reservation,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  render: function () {
    return (
      <div className="ReservationBox">
        <div className="page_title">
          <h1>Reservations</h1>
        </div>
        <Reservationform onReservationSubmit={this.handleReservationSubmit} />
      </div>
    );
  },
});

var Reservationform = React.createClass({
  getInitialState: function () {
    return {
      reservationdate: "",
      reservationtime: "",
      plrdata: [],
      usrdata: [],
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadPlrData: function () {
    $.ajax({
      url: "/getplrdata",
      dataType: "json",
      cache: false,
      success: function (plrdata) {
        this.setState({ plrdata: plrdata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  loadUsrData: function () {
    $.ajax({
      url: "/getusrdata",
      dataType: "json",
      cache: false,
      success: function (usrdata) {
        this.setState({ usrdata: usrdata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadPlrData();
    this.loadUsrData();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var reservationdate = this.state.reservationdate.trim();
    var reservationtime = this.state.reservationtime.trim();
    var playerid = plrnum.value;
    var userid = usrnum.value;

    if (!reservationdate || !reservationtime || !playerid) {
      console.log("Field Missing");
      return;
    }

    this.props.onReservationSubmit({
      reservationdate: reservationdate,
      reservationtime: reservationtime,
      playerid: playerid,
      userid: userid,
    });
  },
  validateEmail: function (value) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },
  validateDollars: function (value) {
    var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    return regex.test(value);
  },
  commonValidate: function () {
    return true;
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  render: function () {
    return (
      <form className="form_area" onSubmit={this.handleSubmit}>
        <h2>Insert Reservation</h2>
        <div className="table_area">
          <table className="form_table">
            <tbody>
              <tr>
                <th>Reservation Date</th>
                <td>
                  <DateInput
                    value={this.state.reservationdate}
                    uniqueName="reservationdate"
                    textArea={false}
                    required={true}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "reservationdate")}
                    errorMessage="Reservation Date is invalid"
                    emptyMessage="Reservation Date is Required"
                  />
                </td>
              </tr>
              <tr>
                <th>Reservation Time</th>
                <td>
                  <TimeInput
                    value={this.state.reservationtime}
                    uniqueName="reservationtime"
                    textArea={false}
                    required={true}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "reservationtime")}
                    errorMessage="Reservation Time is invalid"
                    emptyMessage="Reservation Time is Required"
                  />
                </td>
              </tr>
              <tr>
                <th>Reservation Player</th>
                <td>
                  <PlayerList data={this.state.plrdata} />
                </td>
              </tr>
              <tr>
                <th>Reservation User</th>
                <td>
                  <UserList data={this.state.usrdata} />
                </td>
              </tr>
            </tbody>
          </table>
          <input
            type="submit"
            className="form_submit"
            value="Insert Reservation"
          />
        </div>
      </form>
    );
  },
});

var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: "Input is invalid",
    };
  },
  render: function () {
    var errorClass = classNames(this.props.className, {
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return <td> {this.props.errorMessage} </td>;
  },
});

var DateInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    return (
      <div className={this.props.uniqueName}>
        <input
          name={this.props.uniqueName}
          type="date"
          id={this.props.uniqueName}
          placeholder={this.props.text}
          className={"input input-" + this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

var TimeInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    return (
      <div className={this.props.uniqueName}>
        <input
          name={this.props.uniqueName}
          type="time"
          id={this.props.uniqueName}
          placeholder={this.props.text}
          className={"input input-" + this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          step="480"
          min="10:00"
          max="18:00"
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

var PlayerList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (plrID) {
      return (
        <option key={plrID.dbplayer_id} value={plrID.dbplayer_id}>
          {plrID.dbplayer_firstname} {plrID.dbplayer_lastname}
        </option>
      );
    });
    return (
      <select name="plrnum" id="plrnum">
        {optionNodes}
      </select>
    );
  },
});

var UserList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (usrID) {
      return (
        <option key={usrID.dbuser_id} value={usrID.dbuser_id}>
          {usrID.dbuser_firstname} {usrID.dbuser_lastname}
        </option>
      );
    });
    return (
      <select name="usrnum" id="usrnum">
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<ReservationBox />, document.getElementById("content"));
