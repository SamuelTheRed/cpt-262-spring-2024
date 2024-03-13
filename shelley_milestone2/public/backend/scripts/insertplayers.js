var PlayerBox = React.createClass({
    handlePlayerSubmit: function (player) {
      $.ajax({
        url: "/player",
        dataType: "json",
        type: "POST",
        data: player,
        success: function (data) {
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    render: function () {
      return (
        <div className="PlayerBox">
          <h1>Players</h1>
          <Playerform onPlayerSubmit={this.handlePlayerSubmit} />
        </div>
      );
    },
  });
  
  var Playerform = React.createClass({
    getInitialState: function () {
      return {
        playerfirstname: "",
        playerlastname: "",
        playeremail: "",
        playerphone: ""
      };
    },
    handleSubmit: function (e) {
      e.preventDefault();
  
      var playerfirstname = this.state.playerfirstname.trim();
      var playerlastname = this.state.playerlastname.trim();
      var playeremail = this.state.playeremail.trim();
      var playerphone = this.state.playerphone.trim();
  
      if (!playerfirstname || !playerlastname || !playeremail) {
        console.log("Field Missing");
        return;
      }
  
      this.props.onPlayerSubmit({
        playerfirstname: playerfirstname,
        playerlastname: playerlastname,
        playeremail: playeremail,
        playerphone: playerphone
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
        <form className="PlayerForm" onSubmit={this.handleSubmit}>
          <h2>Insert Player</h2>
          <table>
            <tbody>
              <tr>
                <th>Player First Name</th>
                <td>
                  <TextInput
                    value={this.state.playerfirstname}
                    uniqueName="playerfirstname"
                    textArea={false}
                    required={true}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerfirstname")}
                    errorMessage="Player Name is invalid"
                    emptyMessage="Player Name is Required"
                  />
                </td>
              </tr>
              <tr>
                <th>Player Last Name</th>
                <td>
                  <TextInput
                    value={this.state.playerlastname}
                    uniqueName="playerlastname"
                    textArea={false}
                    required={true}
                    minCharacters={2}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerlastname")}
                    errorMessage="Invalid Player Last Name"
                    emptyMessage="Player Last Name is Required"
                  />
                </td>
              </tr>
              <tr>
                <th>Player Email</th>
                <td>
                  <TextInput
                    value={this.state.playeremail}
                    uniqueName="playeremail"
                    textArea={false}
                    required={false}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playeremail")}
                    errorMessage="Player Email is invalid"
                  />
                </td>
              </tr>
              <tr>
                <th>Player Phone</th>
                <td>
                  <TextInput
                    value={this.state.playerphone}
                    uniqueName="playerphone"
                    textArea={false}
                    required={false}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerphone")}
                    errorMessage="Player Phone is invalid"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Insert Player"/>
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
  
  var TextInput = React.createClass({
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
      if (this.props.textArea) {
        return (
          <div className={this.props.uniqueName}>
            <textarea
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
      } else {
        return (
          <div className={this.props.uniqueName}>
            <input
              name={this.props.uniqueName}
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
      }
    },
  });
  
  ReactDOM.render(<PlayerBox />, document.getElementById("content"));
  