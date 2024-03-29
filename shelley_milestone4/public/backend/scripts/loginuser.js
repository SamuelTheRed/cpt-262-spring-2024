// Login Box For Index HTML Page
var LoginBox = React.createClass({
  // Sets Initial State of data
  getInitialState: function () {
    return {
      data: [],
    };
  },
  // Handles User Login
  handleLogin: function (logininfo) {
    $.ajax({
      url: "/loginusr/",
      dataType: "json",
      type: "POST",
      data: logininfo,
      success: function (data) {
        this.setState({ data: data });
        if (typeof data.redirect == "string") {
          window.location = data.redirect;
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Render Login Box
  render: function () {
    return (
      <div>
        <h1>Login</h1>
        <LoginForm onLoginSubmit={this.handleLogin} />
        <br />
      </div>
    );
  },
});
// Login Form for Login Box
var LoginForm = React.createClass({
  // Sets Initial State of email and password
  getInitialState: function () {
    return {
      useremailSS: "",
      userpwSS: "",
    };
  },
  // Handles Login Form Submit
  handleSubmit: function (e) {
    e.preventDefault();

    var userpwSS = this.state.userpwSS.trim();
    var useremailSS = this.state.useremailSS.trim();

    // Sets variable to submitted information
    this.props.onLoginSubmit({
      userpwSS: userpwSS,
      useremailSS: useremailSS,
    });
  },
  // Handles when change occurs in any field
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Renders the Login Form
  render: function () {
    return (
      <div>
        <div id="theform">
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr>
                  {/* Email Input */}
                  <th>User Email</th>
                  <td>
                    <input
                      name="useremailSS"
                      id="useremailSS"
                      value={this.state.useremailSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Password Input */}
                  <th>User Password</th>
                  <td>
                    <input
                      type="password"
                      name="userpwSS"
                      id="userpwSS"
                      value={this.state.userpwSS}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            {/* Submit Input */}
            <input type="submit" value="Enter Login" />
          </form>
        </div>
        <div>
          <br />
          {/* Sets form clear when submitted */}
          <form onSubmit={this.getInitialState}>
            <input type="submit" value="Clear Form" />
          </form>
        </div>
      </div>
    );
  },
});
// Renders in HTML
ReactDOM.render(<LoginBox />, document.getElementById("content"));
