var LogoutBox = React.createClass({
    loadAllowLogout: function () {
        $.ajax({
            url: '/getloggedout',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                if (typeof data.redirect == 'string') {
                    window.location = data.redirect;
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAllowLogout();
    },
    render: function () {
        return (
            <div>
                <h1>Logout</h1>
            </div>
        );
    }
});

ReactDOM.render(
    <LogoutBox />,
    document.getElementById('content')
);