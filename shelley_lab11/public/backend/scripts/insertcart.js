var empuser = 0;
var CartBox = React.createClass({
    getInitialState: function () {
        return { data: [],
                viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                empuser = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },    
    handleCartSubmit: function (Cart) {

        $.ajax({
            url: '/Cart',
            dataType: 'json',
            type: 'POST',
            data: Cart,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAllowLogin();
    },
    render: function () {
        if (this.state.viewthepage == 0) {
            return (
                <div>NOOOOOOO!</div>
            );
        } else {
            return (
                <div className="CartBox">
                    <h1>Insert Carts</h1>
                    <Cartform onCartSubmit={this.handleCartSubmit} />
                </div>
            );
        }
    }
});

var Cartform = React.createClass({
    getInitialState: function () {
        return {
           CartEmp: "",
           CartCust: "",
           data: [],
           custdata: []
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
    loadCusts: function () {
        $.ajax({
            url: '/getcusts',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ custdata: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadEmps();
        this.loadCusts();
        
    },

    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        
        var CartEmp = empnum.value;
        var CartCust = custnum.value;

        console.log("Emp Num: " + CartEmp);
       
        if (!CartEmp) {
            return;
        }

        this.props.onCartSubmit({
           
            CartEmp: CartEmp,
            CartCust: CartCust
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
                            <th>
                                Cart Employee
                            </th>
                            <td>
                                <SelectList data={this.state.data}  />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Cart Customer
                            </th>
                            <td>
                                <SelectCust data={this.state.custdata} />
                            </td>
                        </tr>
                    </tbody>
                </table><br/>
                <input type="submit" value="Insert Cart" />

                </form>
                </div>
            </div>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empID) {
            console.log("EU" + empuser);
            var selValue = false;
            if (empuser == empID.dbemployeekey) {
                selValue = true;
            }
            return (
                <option
                    key={empID.dbemployeekey}
                    value={empID.dbemployeekey}
                    selected={selValue}
                >
                    {empID.dbemployeename}
                </option>
            );
        });
        return (
            <select name="empnum" id="empnum">
                {optionNodes}
            </select>
        );
    }
});

var SelectCust = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (custID) {
            return (
                <option
                    key={custID.dbcustomerid}
                    value={custID.dbcustomerid}
                >
                    {custID.dbcustomername}
                </option>
            );
        });
        return (
            <select name="custnum" id="custnum">
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
            <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        type={this.props.inputType}
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <CartBox />,
    document.getElementById('content')
);

