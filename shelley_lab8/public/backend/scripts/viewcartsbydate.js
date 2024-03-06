var CartBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    loadCartFromServer: function () {
       
        $.ajax({
            url: '/getcartbydate',
            data: {
                'datestart': startdate.value,
                'dateend': enddate.value,
                'employeeid': empnum.value
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
    componentDidMount: function () {
        this.loadCartFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>View Carts</h1>
                <Cartform onCartSubmit={this.loadCartFromServer} />
                <br />
                <div id="theresults">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Employee</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Daily ID</th>
                                <th>Pickup</th>
                                <th>Made</th>
                            </tr>
                        </thead>
                        <CartList data={this.state.data} />
                    </table>
                </div>
            </div>
        );
    }
});

var Cartform = React.createClass({
    getInitialState: function () {
        return {
           DateStart: "",
           DateEnd: "",
           data: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadEmps: function () {
        $.ajax({
            url: '/getemps',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadEmps();
        
    },
    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var DateStart = startdate.value;
        var DateEnd = enddate.value;
        
        console.log("Start Date: " + DateStart);
        console.log("End Date: " + DateEnd);

        this.props.onCartSubmit({
           
            DateStart: DateStart,
            DateEnd: DateEnd
        });

    },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
            <div>
                <div id="theform">
            <form onSubmit={this.handleSubmit}>
                <table>
                    <tbody>
                           <tr>
                            <th>Start Date</th>
                            <td>
                                <input type = "date" name="startdate" id="startdate" value={this.state.startdate} onChange={this.handleChange}  />
                            </td>
                            </tr>
                            <tr>
                                <th>End Date</th>
                                <td>
                                    <input type = "date" name="enddate" id="enddate" value={this.state.enddate} onChange={this.handleChange} />
                                </td>
                            </tr>
                            <tr>
                            <th>
                                Cart Employee
                            </th>
                            <td>
                                <SelectList data={this.state.data} />
                            </td>
                        </tr>

                    </tbody>
                </table><br/>
                <input type="submit" value="View Cart" />

                </form>
                </div>
            </div>
        );
    }
});

var CartList = React.createClass({
    render: function () {
        var cartNodes = this.props.data.map(function (cart) {
            return (
                <Cart
                    key={cart.dbcartid}
                    cartid={cart.dbcartid}
                    cartemp={cart.dbemployeename}
                    cartcust={cart.dbcustomername}
                    cartdate={cart.dbcartdate}
                    cartdailyid={cart.dbcartdailyid}
                    cartpickup={cart.dbcartpickup}
                    cartmade={cart.dbcartmade}
                >
                </Cart>
            );
        });

        //print all the nodes in the list
        return (
            <tbody>
                {cartNodes}
            </tbody>
        );
    }
});



var Cart = React.createClass({

    render: function () {

        if (this.props.cartpickup == 1) {
            var thepickup = "YES";
        } else {
            var thepickup = "NO";
        }

        if (this.props.cartmade == 1) {
            var themade = "YES";
        } else {
            var themade = "NO";
        }

        return (

            <tr>
                <td>
                    {this.props.cartid}
                </td>
                <td>
                    {this.props.cartemp}
                </td>
                <td>
                    {this.props.cartcust}
                </td>
                <td>
                    {this.props.cartdate}
                </td>
                <td>
                    {this.props.cartdailyid}
                </td>
                <td>
                    {thepickup}
                </td>
                <td>
                    {themade}
                </td>
            </tr>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empID) {
            return (
                <option
                    key={empID.dbemployeekey}
                    value={empID.dbemployeekey}
                >
                    {empID.dbemployeekey} - {empID.dbemployeename} 
                </option>
            );
        });
        return (
            <select name="empnum" id="empnum">
                <option key = "0" value = "0">Select All</option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <CartBox />,
    document.getElementById('content')
);

