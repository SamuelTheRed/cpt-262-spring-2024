var CustomerBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadCustomersFromServer: function () {
        console.log(customerid.value),
        $.ajax({
            url: '/getcust',
            data: {
                'customerid': customerid.value,
                'customername': customername.value,
                'customerzip': customerzip.value,
                'customeraddress': customeraddress.value,
                'customercredit': customercredit.value,
                'customeremail': customeremail.value
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
        this.loadCustomersFromServer();
       // setInterval(this.loadCustomersFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Customers</h1>
                <Customerform onCustomerSubmit={this.loadCustomersFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>ZIP</th>
                                <th>Credit Limit</th>
                                <th>Email</th>
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
});

var Customerform = React.createClass({
    getInitialState: function () {
        return {
            customerid: "",
            customername: "",
            customeraddress: "",
            customerzip: "",
            customercredit: "",
            customeremail: ""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var customerid = this.state.customerid.trim();
        var customername = this.state.customername.trim();
        var customeraddress = this.state.customeraddress.trim();
        var customerzip = this.state.customerzip.trim();
        var customercredit = this.state.customercredit;
        var customeremail = this.state.customeremail.trim();

        this.props.onCustomerSubmit({ customerid: customerid, customername: customername, customeraddress: customeraddress, customerzip: customerzip, customercredit: customercredit, customeremail: customeremail });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Customers</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Customer ID</th>
                            <td>
                                <input type="text" name="customerid" id="customerid" value={this.state.customerid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Name</th>
                            <td>
                                <input name="customername" id="customername" value={this.state.customername} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                                <input name="customeraddress" id="customeraddress" value={this.state.customeraddress} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer ZIP</th>
                            <td>
                                <input name="customerzip" id="customerzip" value={this.state.customerzip} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Credit</th>
                            <td>
                                <input name="customercredit" id="customercredit" value={this.state.customercredit} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>
                                <input name="customeremail" id="customeremail" value={this.state.customeremail} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Customer" />

            </form>
        );
    }
});

var CustomerList = React.createClass({
    render: function () {
        var customerNodes = this.props.data.map(function (customer) {
            //map the data to individual donations
            return (
                <Customer
                    custid={customer.dbcustomerid}
                    custname={customer.dbcustomername}
                    custaddress={customer.dbcustomeraddress}
                    custzip={customer.dbcustomerzip}
                    custcredit={customer.dbcustomercredit}
                    custemail={customer.dbcustomeremail}
                >
                </Customer>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {customerNodes}
            </tbody>
        );
    }
});



var Customer = React.createClass({

    render: function () {
        //display an individual donation
        return (

            <tr>
                            <td>
                                {this.props.custid}
                            </td>
                            <td>
                                {this.props.custname}
                            </td>
                            <td>
                                {this.props.custaddress}
                            </td>
                            <td>
                                {this.props.custzip} 
                            </td>
                            <td>
                                {this.props.custcredit}
                            </td>
                            <td>
                                {this.props.custemail}
                            </td>
                </tr>
        );
    }
});


ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);

