var ResultsBox = React.createClass({
  handleResultsSubmit: function (results) {
    $.ajax({
      url: "/results",
      dataType: "json",
      type: "POST",
      data: results,
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
      <div className="ResultsBox">
        <h1>Results</h1>
        <Resultsform onResultsSubmit={this.handleResultsSubmit} />
      </div>
    );
  },
});

var Resultsform = React.createClass({
  getInitialState: function () {
    return {
      schdata: [],
      resultslo: "",
      resultindicator: "",
      resultthree: "",
      resulttwo: "",
      resultone: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadSchData: function () {
    $.ajax({
      url: "/getschdata",
      dataType: "json",
      cache: false,
      success: function (schdata) {
        this.setState({ schdata: schdata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadSchData();
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var resultslo = this.state.resultslo.trim();
    var resultindicator = this.state.resultindicator.trim();
    var resultthree = this.state.resultthree.trim();
    var resulttwo = this.state.resulttwo.trim();
    var resultone = this.state.resultone.trim();
    var scheduleid = schnum.value;

    if (!resultslo || !resultindicator) {
      console.log("Field Missing");
      return;
    }

    this.props.onResultsSubmit({
      resultslo: resultslo,
      resultindicator: resultindicator,
      resultthree: resultthree,
      resulttwo: resulttwo,
      resultone: resultone,
      scheduleid: scheduleid
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
  numberValidate: function (value) {
    var reg = /^\d*$/;
    return reg.test(value);
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  render: function () {
    return (
      <form className="ResultsForm" onSubmit={this.handleSubmit}>
        <h2>Insert Results</h2>
        <table>
          <tbody>
            <tr>
              <th>Schedule</th>
              <td>
                <SelectList data={this.state.schdata} />
              </td>
            </tr>
            <tr>
              <th>Result SLO</th>
              <td>
                <TextInput
                  value={this.state.resultslo}
                  uniqueName="resultslo"
                  textArea={false}
                  required={true}
                  minCharacters={0}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "resultslo")}
                  errorMessage="Result SLO is invalid"
                  emptyMessage="Result SLO is required"
                />
              </td>
            </tr>
            <tr>
              <th>Result Indicator</th>
              <td>
                <TextInput
                  value={this.state.resultindicator}
                  uniqueName="resultindicator"
                  textArea={false}
                  required={true}
                  minCharacters={0}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "resultindicator")}
                  errorMessage="Result Indicator is invalid"
                  emptyMessage="Result Indicator is required"
                />
              </td>
            </tr>
            <tr>
              <th>Result One</th>
              <td>
                <TextInput
                  value={this.state.resultone}
                  uniqueName="resultone"
                  textArea={false}
                  required={true}
                  minCharacters={0}
                  validate={this.numberValidate}
                  onChange={this.setValue.bind(this, "resultone")}
                  errorMessage="Result One must be a number"
                  emptyMessage="Result One is required"
                />
              </td>
            </tr>
            <tr>
              <th>Result Two</th>
              <td>
                <TextInput
                  value={this.state.resulttwo}
                  uniqueName="resulttwo"
                  textArea={false}
                  required={true}
                  minCharacters={0}
                  validate={this.numberValidate}
                  onChange={this.setValue.bind(this, "resulttwo")}
                  errorMessage="Result Two must be a number"
                  emptyMessage="Result Two is required"
                />
              </td>
            </tr>
            <tr>
              <th>Result Three</th>
              <td>
                <TextInput
                  value={this.state.resultthree}
                  uniqueName="resultthree"
                  textArea={false}
                  required={true}
                  minCharacters={0}
                  validate={this.numberValidate}
                  onChange={this.setValue.bind(this, "resultthree")}
                  errorMessage="Result Three must be a number"
                  emptyMessage="Result Three is required"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Results" />
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

var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (schID) {
      return (
        <option key={schID.scheduleid} value={schID.scheduleid}>
          {schID.courseprefix}{schID.coursenumber}{schID.coursesection} - {schID.scheduleyear} {schID.schedulesemester} - {schID.facultyfirstname} {schID.facultylastname}
        </option>
      );
    });
    return (
      <select name="schnum" id="schnum">
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<ResultsBox />, document.getElementById("content"));
