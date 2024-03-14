var ReservationBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadReservationsFromServer: function () {

        var emailervalue = 2;
        if (resmaileryes.checked) {
            emailervalue = 1;
        } 
        if (resmailerno.checked) {
            emailervalue = 0;
        }
        console.log(emailervalue);
        $.ajax({
            url: '/getres',
            data: {
                'reservationid': reservationid.value,
                'reservationname': reservationname.value,
                'reservationemail': reservationemail.value,
                'reservationphone': reservationphone.value,
                'reservationsalary': reservationsalary.value,
                'reservationmailer': emailervalue,
                'reservationtype': restype.value
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
    updateSingleEmpFromServer: function (reservation) {
        
        $.ajax({
            url: '/updatesingleres',
            dataType: 'json',
            data: reservation,
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
        this.loadReservationsFromServer();
       // setInterval(this.loadReservationsFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Update Reservations</h1>
                <Reservationform2 onReservationSubmit={this.loadReservationsFromServer} />
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
                        <ReservationList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <ReservationUpdateform onUpdateSubmit={this.updateSingleEmpFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Reservationform2 = React.createClass({
    getInitialState: function () {
        return {
            reservationkey: "",
            reservationid: "",
            reservationname: "",
            reservationemail: "",
            reservationphone: "",
            reservationsalary: "",
            reservationMailer: "",
            data: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadEmpTypes: function () {
        $.ajax({
            url: '/getrestypes',
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
        this.loadEmpTypes();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var reservationid = this.state.reservationid.trim();
        var reservationemail = this.state.reservationemail.trim();
        var reservationname = this.state.reservationname.trim();
        var reservationphone = this.state.reservationphone.trim();
        var reservationsalary = this.state.reservationsalary;
        var reservationmailer = this.state.selectedOption;
        var reservationtype = restype.value;

        this.props.onReservationSubmit({ 
            reservationid: reservationid,
            reservationname: reservationname,
            reservationemail: reservationemail,
            reservationphone: reservationphone,
            reservationsalary: reservationsalary,
            reservationmailer: reservationmailer,
            reservationtype: reservationtype
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
                <h2>Reservations</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Reservation ID</th>
                            <td>
                                <input type="text" name="reservationid" id="reservationid" value={this.state.reservationid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Reservation Name</th>
                            <td>
                                <input name="reservationname" id="reservationname" value={this.state.reservationname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Reservation Email</th>
                            <td>
                                <input name="reservationemail" id="reservationemail" value={this.state.reservationemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Reservation Phone</th>
                            <td>
                                <input name="reservationphone" id="reservationphone" value={this.state.reservationphone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Reservation Salary</th>
                            <td>
                                <input name="reservationsalary" id="reservationsalary" value={this.state.reservationsalary} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Join Mailing List</th>
                            <td>
                                <input 
                                    type = "radio"
                                    name = "resmailer"
                                    id = "resmaileryes"
                                    value = "1"
                                    checked = {this.state.selectedOption === "1"}
                                    onChange ={this.handleOptionChange}
                                    className = "form-check-input"
                                /> YES
                                <input 
                                    type = "radio"
                                    name = "resmailer"
                                    id = "resmailerno"
                                    value = "0"
                                    checked = {this.state.selectedOption === "0"}
                                    onChange ={this.handleOptionChange}
                                    className = "form-check-input"
                                /> NO
                            </td>
                        </tr>
                        <tr>
                            <th>Reservation Type</th>
                            <td><SelectList data = {this.state.data} /></td>
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
    }
});

var ReservationUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upreservationkey: "",
            upreservationid: "",
            upreservationname: "",
            upreservationemail: "",
            upreservationphone: "",
            upreservationsalary: "",
            upreservationMailer: "",
            upselectedOption: "",
            updata: []
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadEmpTypes: function () {
        $.ajax({
            url: '/getrestypes',
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
        this.loadEmpTypes();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upreservationkey = upreskey.value;
        var upreservationid = upresid.value;
        var upreservationemail = upresemail.value;
        var upreservationname = upresname.value;
        var upreservationphone = upresphone.value;
        var upreservationsalary = upressalary.value;
        var upreservationmailer = this.state.upselectedOption;
        var upreservationtype = uprestype.value;

        this.props.onUpdateSubmit({
            upreservationkey: upreservationkey,
            upreservationid: upreservationid,
            upreservationname: upreservationname,
            upreservationemail: upreservationemail,
            upreservationphone: upreservationphone,
            upreservationsalary: upreservationsalary,
            upreservationmailer: upreservationmailer,
            upreservationtype: upreservationtype
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
        <th>Reservation ID</th>
        <td>
<input type="text" name="upresid" id="upresid" value={this.state.upresid} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Reservation Name</th>
        <td>
<input name="upresname" id="upresname" value={this.state.upresname} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Reservation Email</th>
        <td>
<input name="upresemail" id="upresemail" value={this.state.upresemail} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Reservation Phone</th>
        <td>
<input name="upresphone" id="upresphone" value={this.state.upresphone} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Reservation Salary</th>
        <td>
<input name="upressalary" id="upressalary" value={this.state.upressalary} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Join Mailing List
        </th>
        <td>
            <input
                type="radio"
                name="upresmailer"
                id="upresmaileryes"
                value="1"
                checked={this.state.upselectedOption === "1"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />Yes
                <input
                type="radio"
                name="upresmailer"
                id="upresmailerno"
                value="0"
                checked={this.state.upselectedOption === "0"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />No
        </td>
    </tr>
    <tr>
        <th>
            Reservation Type
        </th>
        <td>
            <SelectUpdateList data={this.state.updata} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upreskey" id="upreskey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Reservation" />
                    </form>
                </div>
            </div>
        );
    }
});

var ReservationList = React.createClass({
    render: function () {
        var reservationNodes = this.props.data.map(function (reservation) {
            return (
                <Reservation
                    key={reservation.dbreservationkey}
                    reskey={reservation.dbreservationkey}
                    resid={reservation.dbreservationid}
                    resname={reservation.dbreservationname}
                    resemail={reservation.dbreservationemail}
                >
                </Reservation>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {reservationNodes}
            </tbody>
        );
    }
});

var Reservation = React.createClass({
    getInitialState: function () {
        return {
            upreskey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupreskey = this.props.reskey;
        
        this.loadSingleEmp(theupreskey);
    },
    loadSingleEmp: function (theupreskey) {
        $.ajax({
            url: '/getsingleres',
            data: {
                'upreskey': theupreskey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (reservation) {
                    upreskey.value = theupreskey;
                    upresemail.value = reservation.dbreservationemail;
                    upresid.value = reservation.dbreservationid;
                    upresphone.value = reservation.dbreservationphone;
                    upressalary.value = reservation.dbreservationsalary;
                    upresname.value = reservation.dbreservationname;
                    if (reservation.dbreservationmailer == 1) {
                        upresmaileryes.checked = true;
                    } else {
                        upresmailerno.checked = true;
                    }
                    uprestype.value = reservation.dbreservationtype;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        
        if (this.props.resmailer == 1) {
            var themailer = "YES";
        } else {
            var themailer = "NO";
        }

        return (

            <tr>
                            <td>
                                {this.props.reskey} 
                            </td>
                            <td>
                                {this.props.resid}
                            </td>
                            <td>
                                {this.props.resname}
                            </td>
                            <td>
                                {this.props.resemail}
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
        var optionNodes = this.props.data.map(function (resTypes) {
            return (
                <option
                    key = {resTypes.dbrestypeid}
                    value= {resTypes.dbrestypeid}
                >
                    {resTypes.dbrestypename}        
                </option>
            );
        });
        return (
            <select name = "restype" id = "restype">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (resTypes) {
            return (
                <option
                    key={resTypes.dbrestypeid}
                    value={resTypes.dbrestypeid}
                >
                    {resTypes.dbrestypename}
                </option>
            );
        });
        return (
            <select name="uprestype" id="uprestype">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <ReservationBox />,
    document.getElementById('content')
);