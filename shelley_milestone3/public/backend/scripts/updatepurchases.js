var PurchaseBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadPurchasesFromServer: function () {

        var emailervalue = 2;
        if (purmaileryes.checked) {
            emailervalue = 1;
        } 
        if (purmailerno.checked) {
            emailervalue = 0;
        }
        console.log(emailervalue);
        $.ajax({
            url: '/getpur',
            data: {
                'purchaseid': purchaseid.value,
                'purchasename': purchasename.value,
                'purchaseemail': purchaseemail.value,
                'purchasephone': purchasephone.value,
                'purchasesalary': purchasesalary.value,
                'purchasemailer': emailervalue,
                'purchasetype': purtype.value
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
    updateSingleEmpFromServer: function (purchase) {
        
        $.ajax({
            url: '/updatesinglepur',
            dataType: 'json',
            data: purchase,
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
        this.loadPurchasesFromServer();
       // setInterval(this.loadPurchasesFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Update Purchases</h1>
                <Purchaseform2 onPurchaseSubmit={this.loadPurchasesFromServer} />
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
                        <PurchaseList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <PurchaseUpdateform onUpdateSubmit={this.updateSingleEmpFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Purchaseform2 = React.createClass({
    getInitialState: function () {
        return {
            purchasekey: "",
            purchaseid: "",
            purchasename: "",
            purchaseemail: "",
            purchasephone: "",
            purchasesalary: "",
            purchaseMailer: "",
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
            url: '/getpurtypes',
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

        var purchaseid = this.state.purchaseid.trim();
        var purchaseemail = this.state.purchaseemail.trim();
        var purchasename = this.state.purchasename.trim();
        var purchasephone = this.state.purchasephone.trim();
        var purchasesalary = this.state.purchasesalary;
        var purchasemailer = this.state.selectedOption;
        var purchasetype = purtype.value;

        this.props.onPurchaseSubmit({ 
            purchaseid: purchaseid,
            purchasename: purchasename,
            purchaseemail: purchaseemail,
            purchasephone: purchasephone,
            purchasesalary: purchasesalary,
            purchasemailer: purchasemailer,
            purchasetype: purchasetype
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
                <h2>Purchases</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Purchase ID</th>
                            <td>
                                <input type="text" name="purchaseid" id="purchaseid" value={this.state.purchaseid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Name</th>
                            <td>
                                <input name="purchasename" id="purchasename" value={this.state.purchasename} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Email</th>
                            <td>
                                <input name="purchaseemail" id="purchaseemail" value={this.state.purchaseemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Phone</th>
                            <td>
                                <input name="purchasephone" id="purchasephone" value={this.state.purchasephone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Salary</th>
                            <td>
                                <input name="purchasesalary" id="purchasesalary" value={this.state.purchasesalary} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Join Mailing List</th>
                            <td>
                                <input 
                                    type = "radio"
                                    name = "purmailer"
                                    id = "purmaileryes"
                                    value = "1"
                                    checked = {this.state.selectedOption === "1"}
                                    onChange ={this.handleOptionChange}
                                    className = "form-check-input"
                                /> YES
                                <input 
                                    type = "radio"
                                    name = "purmailer"
                                    id = "purmailerno"
                                    value = "0"
                                    checked = {this.state.selectedOption === "0"}
                                    onChange ={this.handleOptionChange}
                                    className = "form-check-input"
                                /> NO
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Type</th>
                            <td><SelectList data = {this.state.data} /></td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Purchase" />

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

var PurchaseUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uppurchasekey: "",
            uppurchaseid: "",
            uppurchasename: "",
            uppurchaseemail: "",
            uppurchasephone: "",
            uppurchasesalary: "",
            uppurchaseMailer: "",
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
            url: '/getpurtypes',
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

        var uppurchasekey = uppurkey.value;
        var uppurchaseid = uppurid.value;
        var uppurchaseemail = uppuremail.value;
        var uppurchasename = uppurname.value;
        var uppurchasephone = uppurphone.value;
        var uppurchasesalary = uppursalary.value;
        var uppurchasemailer = this.state.upselectedOption;
        var uppurchasetype = uppurtype.value;

        this.props.onUpdateSubmit({
            uppurchasekey: uppurchasekey,
            uppurchaseid: uppurchaseid,
            uppurchasename: uppurchasename,
            uppurchaseemail: uppurchaseemail,
            uppurchasephone: uppurchasephone,
            uppurchasesalary: uppurchasesalary,
            uppurchasemailer: uppurchasemailer,
            uppurchasetype: uppurchasetype
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
        <th>Purchase ID</th>
        <td>
<input type="text" name="uppurid" id="uppurid" value={this.state.uppurid} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Purchase Name</th>
        <td>
<input name="uppurname" id="uppurname" value={this.state.uppurname} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Purchase Email</th>
        <td>
<input name="uppuremail" id="uppuremail" value={this.state.uppuremail} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Purchase Phone</th>
        <td>
<input name="uppurphone" id="uppurphone" value={this.state.uppurphone} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Purchase Salary</th>
        <td>
<input name="uppursalary" id="uppursalary" value={this.state.uppursalary} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Join Mailing List
        </th>
        <td>
            <input
                type="radio"
                name="uppurmailer"
                id="uppurmaileryes"
                value="1"
                checked={this.state.upselectedOption === "1"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />Yes
                <input
                type="radio"
                name="uppurmailer"
                id="uppurmailerno"
                value="0"
                checked={this.state.upselectedOption === "0"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />No
        </td>
    </tr>
    <tr>
        <th>
            Purchase Type
        </th>
        <td>
            <SelectUpdateList data={this.state.updata} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="uppurkey" id="uppurkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Purchase" />
                    </form>
                </div>
            </div>
        );
    }
});

var PurchaseList = React.createClass({
    render: function () {
        var purchaseNodes = this.props.data.map(function (purchase) {
            return (
                <Purchase
                    key={purchase.dbpurchasekey}
                    purkey={purchase.dbpurchasekey}
                    purid={purchase.dbpurchaseid}
                    purname={purchase.dbpurchasename}
                    puremail={purchase.dbpurchaseemail}
                >
                </Purchase>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {purchaseNodes}
            </tbody>
        );
    }
});

var Purchase = React.createClass({
    getInitialState: function () {
        return {
            uppurkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuppurkey = this.props.purkey;
        
        this.loadSingleEmp(theuppurkey);
    },
    loadSingleEmp: function (theuppurkey) {
        $.ajax({
            url: '/getsinglepur',
            data: {
                'uppurkey': theuppurkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (purchase) {
                    uppurkey.value = theuppurkey;
                    uppuremail.value = purchase.dbpurchaseemail;
                    uppurid.value = purchase.dbpurchaseid;
                    uppurphone.value = purchase.dbpurchasephone;
                    uppursalary.value = purchase.dbpurchasesalary;
                    uppurname.value = purchase.dbpurchasename;
                    if (purchase.dbpurchasemailer == 1) {
                        uppurmaileryes.checked = true;
                    } else {
                        uppurmailerno.checked = true;
                    }
                    uppurtype.value = purchase.dbpurchasetype;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        
        if (this.props.purmailer == 1) {
            var themailer = "YES";
        } else {
            var themailer = "NO";
        }

        return (

            <tr>
                            <td>
                                {this.props.purkey} 
                            </td>
                            <td>
                                {this.props.purid}
                            </td>
                            <td>
                                {this.props.purname}
                            </td>
                            <td>
                                {this.props.puremail}
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
        var optionNodes = this.props.data.map(function (purTypes) {
            return (
                <option
                    key = {purTypes.dbpurtypeid}
                    value= {purTypes.dbpurtypeid}
                >
                    {purTypes.dbpurtypename}        
                </option>
            );
        });
        return (
            <select name = "purtype" id = "purtype">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (purTypes) {
            return (
                <option
                    key={purTypes.dbpurtypeid}
                    value={purTypes.dbpurtypeid}
                >
                    {purTypes.dbpurtypename}
                </option>
            );
        });
        return (
            <select name="uppurtype" id="uppurtype">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PurchaseBox />,
    document.getElementById('content')
);