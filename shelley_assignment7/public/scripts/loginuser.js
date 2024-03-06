var LoginBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    handleLogin: function (logininfo) {

        $.ajax({
            url: '/login/',
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
            useremail: "",
            userpw: "",

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var userpw = this.state.userpw.trim();
        var useremail = this.state.useremail.trim();

        this.props.onLoginSubmit({
            userpw: userpw,
            useremail: useremail
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
                                    <th>User Email</th>
                                    <td>
                                        <input name="useremail" id="useremail" value={this.state.useremail} onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>User Password</th>
                                    <td>
                                        <input type="password" name="userpw" id="userpw" value={this.state.userpw} onChange={this.handleChange} />
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

