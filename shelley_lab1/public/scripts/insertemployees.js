var EmployeeBox = React.createClass({ // --v
    handleEmployeeSubmit: function (employee) {

        $.ajax({
            url: '/employee',
            dataType: 'json',
            type: 'POST',
            data: employee,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }, // --^
    render: function () {
        return (
            <div className="EmployeeBox">
                <h1>Employees</h1>
                <Employeeform2 onEmployeeSubmit={this.handleEmployeeSubmit}/>
            </div>
        );
    }
});

var Employeeform2 = React.createClass({
    getInitialState: function () {
        return {
            employeeid: "",
            employeename: "",
            employeeemail: "",
            employeephone: "",
            employeesalary: ""
        };
    },
    // --v
    handleSubmit: function (e) {
        
        e.preventDefault();

        var employeeid = this.state.employeeid.trim();
        var employeename = this.state.employeename.trim();
        var employeeemail = this.state.employeeemail.trim();
        var employeephone = this.state.employeephone.trim();
        var employeesalary = this.state.employeesalary.trim();

        if (!this.validateEmail(employeeemail)) {
            console.log("Bad Email " + this.validateEmail(employeeemail));
            return;
        }
        if (isNaN(employeeid)) {
            console.log("Not a number " + employeeid);
            return;
        }
        if (!this.validateDollars(employeesalary)) {
            console.log("Not a dollar amount " + employeesalary);
            return;
        }
        if (!employeename || !employeeemail || !employeeid || !employeephone) {
            console.log("Field Missing");
            return;
        }

        this.props.onEmployeeSubmit({
            employeeid: employeeid,
            employeename: employeename,
            employeeemail: employeeemail,
            employeephone: employeephone,
            employeesalary: employeesalary
        });
    }, // --^
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
            <form className="EmployeeForm" onSubmit={this.handleSubmit}>
                <h2>Employees</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Employee ID</th>
                            <td>
                                <TextInput
                                    value={this.state.employeeid}
                                    uniqueName="employeeid"
                                    textArea={false}
                                    required={true}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeeid')}
                                    errorMessage="Employee ID is invalid"
                                    emptyMessage="Employee ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Name</th>
                            <td>
                                <TextInput
                                    value={this.state.employeename}
                                    uniqueName="employeename"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeename')}
                                    errorMessage="Employee Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee E-Mail</th>
                            <td>
                                <TextInput
                                    value={this.state.employeeemail}
                                    uniqueName="employeeemail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'employeeemail')}
                                    errorMessage="Invalid E-Mail Address"
                                    emptyMessage="E-Mail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Phone</th>
                            <td>
                                <TextInput
                                    value={this.state.employeephone}
                                    uniqueName="employeephone"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeephone')}
                                    errorMessage="Employee Phone is invalid" />
                            </td>
                        </tr>
                              <tr>
                            <th>Employee Salary</th>
                            <td>

                                <TextInput
                                    value={this.state.employeesalary}
                                    uniqueName="employeesalary"
                                    textArea={false}
                                    required={false}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'employeesalary')}
                                    errorMessage="Did not enter a correct salary value"
                                    emptyMessage="" />
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                <input type="submit" value="Insert Employee" />

            </form>
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
                    <input // --v
                        name={this.props.uniqueName}
                        id={this.props.uniqueName} // --^
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
    <EmployeeBox />,
    document.getElementById('content')
);
