var LoginBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    handleLogin: function (logininfo) {

        $.ajax({
            url: '/logincust/',
            dataType: 'json',
            type: 'POST',
            data: logininfo,
            success: function (data) {
                this.setState({ data: data });
                if (typeof data.redirect == 'string') {
                    window.location = data.redirect;
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div>
                <h1>Login</h1>
                <LoginForm onLoginSubmit={this.handleLogin} />
                <br />

            </div>
        );
    }
});

var LoginForm = React.createClass({
    getInitialState: function () {
        return {
            customeremail: "",
            customerpw: "",

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var customerpw = this.state.customerpw.trim();
        var customeremail = this.state.customeremail.trim();

        this.props.onLoginSubmit({
            customerpw: customerpw,
            customeremail: customeremail
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
                <div id="theform">
                    <form onSubmit={this.handleSubmit}>

                        <table>
                            <tbody>
                                <tr>
                                    <th>Customer Email</th>
                                    <td>
                                        <input name="customeremail" id="customeremail" value={this.state.customeremail} onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Customer Password</th>
                                    <td>
                                        <input type="password" name="customerpw" id="customerpw" value={this.state.customerpw} onChange={this.handleChange} />
                                    </td>
                                </tr>

                            </tbody>
                        </table><br />
                        <input type="submit" value="Enter Login" />
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

ReactDOM.render(
    <LoginBox />,
    document.getElementById('content')
);

