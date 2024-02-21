var CustomerBox = React.createClass({
	getInitialState: function () {
		return { data: [] };
	},
	loadCustomersFromServer: function () {

		var cclubvalue = 2;
		if (custclubdiscount.checked) {
			cclubvalue = 1;
		}
		if (custclubstandard.checked) {
			cclubvalue = 0;
		}

		$.ajax({
			url: '/getcust',
			data: {
				'customerid': customerid.value,
				'customername': customername.value,
				'customerzip': customerzip.value,
				'customeraddress': customeraddress.value,
				'customercredit': customercredit.value,
				'customeremail': customeremail.value,
				'customerrewards': custrewards.value,
				'customerclub': cclubvalue
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
	updateSingleCustFromServer: function (customer) {

		$.ajax({
			url: '/updatesinglecust',
			dataType: 'json',
			data: customer,
			type: 'POST',
			cache: false,
			success: function (upsingledata) {
				({ upsingledata: upsingledata });
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
		window.location.reload(true);
	},
	componentDidMount: function () {
		this.loadCustomersFromServer();
		// setInterval(this.loadCustomersFromServer, this.props.pollInterval);
	},

	render: function () {
		return (
			<div>
				<h1>Update Customers</h1>
				<Customerform onCustomerSubmit={this.loadCustomersFromServer} />
				<br />
				<div id="theresults">
					<div id="theleft"><table>
						<thead><tr>
							<th>Key</th>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
						</tr></thead>
						<CustomerList data={this.state.data} />
					</table></div>
					<div id="theright">
						<CustomerUpdateform onUpdateSubmit={this.updateSingleCustFromServer} />
					</div>
				</div>
			</div>
		);
	}
});

var Customerform = React.createClass({
	getInitialState: function () {
		return {
			customerkey: "",
			customerid: "",
			customername: "",
			customeraddress: "",
			customerzip: "",
			customercredit: "",
			customeremail: "",
			customerclub: "",
			data: [],
		};
	},
	handleOptionChange: function (e) {
		this.setState({
			selectedOption: e.target.value
		});
	},
	loadCustRewards: function () {
		$.ajax({
			url: '/getcustrewards',
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
		this.loadCustRewards();

	},
	handleSubmit: function (e) {
		e.preventDefault();

		var customerid = this.state.customerid.trim();
		var customername = this.state.customername.trim();
		var customeraddress = this.state.customeraddress.trim();
		var customerzip = this.state.customerzip.trim();
		var customercredit = this.state.customercredit;
		var customeremail = this.state.customeremail.trim();
		var customerclub = this.state.selectedOption;
		var customerrewards = custrewards.value;

		this.props.onCustomerSubmit({
			customerid: customerid,
			customername: customername,
			customeraddress: customeraddress,
			customerzip: customerzip,
			customercredit: customercredit,
			customeremail: customeremail,
			customerrewards: customerrewards,
			customerclub: customerclub
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
										<input name="customername" id="customername" value={this.state.customername} onChange={this.handleChange} />
									</td>
								</tr>
								<tr>
									<th>Customer Address</th>
									<td>
										<input name="customeraddress" id="customeraddress" value={this.state.customeraddress} onChange={this.handleChange} />
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
								<tr>
									<th>
										Club Participant Type
									</th>
									<td>
										<input
											type="radio"
											name="custclub"
											id="custclubdiscount"
											value="1"
											checked={this.state.selectedOption === "1"}
											onChange={this.handleOptionChange}
											className="form-check-input"
										/>Discount
										<input
											type="radio"
											name="custclub"
											id="custclubstandard"
											value="0"
											checked={this.state.selectedOption === "0"}
											onChange={this.handleOptionChange}
											className="form-check-input"
										/>Standard
									</td>
								</tr>
								<tr>
									<th>
										Customer Rewards Status
									</th>
									<td>
										<SelectList data={this.state.data} />
									</td>
								</tr>
							</tbody>
						</table>
						<input type="submit" value="Search Customer" />

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

var CustomerUpdateform = React.createClass({
	getInitialState: function () {
		return {
			upcustomerkey: "",
			upcustomerid: "",
			upcustomername: "",
			upcustomeraddress: "",
			upcustomerzip: "",
			upcustomercredit: "",
			upcustomeremail: "",
			upcustomerClub: "",
			upselectedOption: "",
			updata: []
		};
	},
	handleUpOptionChange: function (e) {
		this.setState({
			upselectedOption: e.target.value
		});
	},
	loadCustTypes: function () {
		$.ajax({
			url: '/getcusttypes',
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({ update: data });
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	componentDidMount: function () {
		this.loadCustTypes();

	},
	handleUpSubmit: function (e) {
		e.preventDefault();

		var upcustomerkey = upcustkey.value;
		var upcustomerid = upcustid.value;
		var upcustomername = upcustname.value;
		var upcustomeraddress = upcustaddress.value;
		var upcustomerzip = upcustzip.value;
		var upcustomercredit = upcustcredit.value;
		var upcustomeremail = upcustemail.value;
		var upcustomerclub = this.state.upselectedOption;
		var upcustomerrewards = upcustrewards.value;

		this.props.onCustomerSubmit({
			upcustomerkey: upcustomerkey,
			upcustomerid: upcustomerid,
			upcustomername: upcustomername,
			upcustomeraddress: upcustomeraddress,
			upcustomerzip: upcustomerzip,
			upcustomercredit: upcustomercredit,
			upcustomeremail: upcustomeremail,
			upcustomerrewards: upcustomerrewards,
			upcustomerclub: upcustomerclub
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
									<th>Customer ID</th>
									<td>
										<input type="text" name="upcustid" id="upcustid" value={this.state.upcustomerid} onChange={this.handleChange} />
									</td>
								</tr>
								<tr>
									<th>Customer Name</th>
									<td>
										<input name="upcustname" id="upcustname" value={this.state.upcustomername} onChange={this.handleChange} />
									</td>
								</tr>
								<tr>
									<th>Customer Address</th>
									<td>
										<input name="upcustaddress" id="upcustaddress" value={this.state.upcustomeraddress} onChange={this.handleChange} />
									</td>
								</tr>
								<tr>
									<th>Customer ZIP</th>
									<td>
										<input name="upcustzip" id="upcustzip" value={this.state.upcustomerzip} onChange={this.handleChange} />
									</td>
								</tr>
								<tr>
									<th>Customer Credit</th>
									<td>
										<input name="upcustcredit" id="upcustcredit" value={this.state.upcustomercredit} onChange={this.handleChange} />
									</td>
								</tr>
								<tr>
									<th>Customer Email</th>
									<td>
										<input name="upcustemail" id="upcustemail" value={this.state.upcustomeremail} onChange={this.handleChange} />
									</td>
								</tr>
								<tr>
									<th>
										Club Participant Type
									</th>
									<td>
										<input
											type="radio"
											name="upcustclub"
											id="upcustclubdiscount"
											value="1"
											checked={this.state.selectedOption === "1"}
											onChange={this.handleOptionChange}
											className="form-check-input"
										/>Discount
										<input
											type="radio"
											name="upcustclub"
											id="upcustclubstandard"
											value="0"
											checked={this.state.selectedOption === "0"}
											onChange={this.handleOptionChange}
											className="form-check-input"
										/>Standard
									</td>
								</tr>
								<tr>
									<th>
										Customer Rewards Status
									</th>
									<td>
										<SelectUpdateList data={this.state.updata} />
									</td>
								</tr>
							</tbody>
						</table>
						<br />
						<input type="hidden" name="upcustkey" id="upcustkey" onchange={this.handleUpChange} />
						<input type="submit" value="Update Customer" />
					</form>
				</div>
			</div>
		);
	}
});

var CustomerList = React.createClass({
	render: function () {
		var customerNodes = this.props.data.map(function (customer) {
			//map the data to individual donations
			return (
				<Customer
					key={customer.dbcustomerid}
					custkey={customer.dbcustomerid}
					custid={customer.dbcustomerid}
					custname={customer.dbcustomername}
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
    getInitialState: function () {
        return {
            upcustkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupcustkey = this.props.custkey;

        this.loadSingleCust(theupcustkey);
    },
    loadSingleCust: function (theupcustkey) {
        $.ajax({
            url: '/getsinglecust',
            data: {
                'upcustkey': theupcustkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateCust = this.state.singledata.map(function (customer) {
                    upcustkey.value = theupcustkey;
                    upcustemail.value = customer.dbcustomeremail;
                    upcustid.value = customer.dbcustomerid;
                    upcustname.value = customer.dbcustomername;
                    upcustaddress.value = customer.dbcustomeraddress;
					upcustcredit.value = customer.dbcustomercredit;
                    upcustzip.value = customer.dbcustomerzip;
                    if (customer.dbcustomerclub == 1) {
                        upcustclubdiscount.checked = true;
                    } else {
                        upcustclubstandard.checked = true;
                    }
                    upcustrewards.value = customer.dbcustomerrewards;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },

	render: function () {
		if (this.props.custclub == 1) {
			var theclub = "Discount";
		} else {
			var theclub = "Standard";
		}
		//display an individual donation
		return ( 

			<tr>
			<td>
				{this.props.custkey}
			</td>
				<td>
					{this.props.custid}
				</td>
				<td>
					{this.props.custname}
				</td>
				<td>
					{this.props.custemail}
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

var SelectList = React.createClass({
	render: function () {
		var optionNodes = this.props.data.map(function (custRewards) {
			return (
				<option
					key={custRewards.dbcustrewardsid}
					value={custRewards.dbcustrewardsid}
				>
					{custRewards.dbcustrewardsname}
				</option>
			);
		});
		return (
			<select name="custrewards" id="custrewards">
				<option value="0"></option>
				{optionNodes}
			</select>
		);
	}
});
var SelectUpdateList = React.createClass({
	render: function () {
		var optionNodes = this.props.data.map(function (custRewards) {
			return (
				<option
					key={custRewards.dbcustrewardsid}
					value={custRewards.dbcustrewardsid}
				>
					{custRewards.dbcustrewardsname}
				</option>
			);
		});
		return (
			<select name="upcustrewards" id="upcustrewards">
				<option value="0"></option>
				{optionNodes}
			</select>
		);
	}
});

ReactDOM.render(
	<CustomerBox />,
	document.getElementById('content')
);

