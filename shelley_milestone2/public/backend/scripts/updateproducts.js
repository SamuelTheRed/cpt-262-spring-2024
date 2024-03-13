var ProductBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadProductsFromServer: function () {

        var emailervalue = 2;
        if (pdcmaileryes.checked) {
            emailervalue = 1;
        } 
        if (pdcmailerno.checked) {
            emailervalue = 0;
        }
        console.log(emailervalue);
        $.ajax({
            url: '/getpdc',
            data: {
                'productid': productid.value,
                'productname': productname.value,
                'productemail': productemail.value,
                'productphone': productphone.value,
                'productsalary': productsalary.value,
                'productmailer': emailervalue,
                'producttype': pdctype.value
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
    updateSingleEmpFromServer: function (product) {
        
        $.ajax({
            url: '/updatesinglepdc',
            dataType: 'json',
            data: product,
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
        this.loadProductsFromServer();
       // setInterval(this.loadProductsFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Update Products</h1>
                <Productform2 onProductSubmit={this.loadProductsFromServer} />
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
                        <ProductList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <ProductUpdateform onUpdateSubmit={this.updateSingleEmpFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Productform2 = React.createClass({
    getInitialState: function () {
        return {
            productkey: "",
            productid: "",
            productname: "",
            productemail: "",
            productphone: "",
            productsalary: "",
            productMailer: "",
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
            url: '/getpdctypes',
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

        var productid = this.state.productid.trim();
        var productemail = this.state.productemail.trim();
        var productname = this.state.productname.trim();
        var productphone = this.state.productphone.trim();
        var productsalary = this.state.productsalary;
        var productmailer = this.state.selectedOption;
        var producttype = pdctype.value;

        this.props.onProductSubmit({ 
            productid: productid,
            productname: productname,
            productemail: productemail,
            productphone: productphone,
            productsalary: productsalary,
            productmailer: productmailer,
            producttype: producttype
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
                <h2>Products</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Product ID</th>
                            <td>
                                <input type="text" name="productid" id="productid" value={this.state.productid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <input name="productname" id="productname" value={this.state.productname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Email</th>
                            <td>
                                <input name="productemail" id="productemail" value={this.state.productemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Phone</th>
                            <td>
                                <input name="productphone" id="productphone" value={this.state.productphone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Salary</th>
                            <td>
                                <input name="productsalary" id="productsalary" value={this.state.productsalary} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Join Mailing List</th>
                            <td>
                                <input 
                                    type = "radio"
                                    name = "pdcmailer"
                                    id = "pdcmaileryes"
                                    value = "1"
                                    checked = {this.state.selectedOption === "1"}
                                    onChange ={this.handleOptionChange}
                                    className = "form-check-input"
                                /> YES
                                <input 
                                    type = "radio"
                                    name = "pdcmailer"
                                    id = "pdcmailerno"
                                    value = "0"
                                    checked = {this.state.selectedOption === "0"}
                                    onChange ={this.handleOptionChange}
                                    className = "form-check-input"
                                /> NO
                            </td>
                        </tr>
                        <tr>
                            <th>Product Type</th>
                            <td><SelectList data = {this.state.data} /></td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Product" />

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

var ProductUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upproductkey: "",
            upproductid: "",
            upproductname: "",
            upproductemail: "",
            upproductphone: "",
            upproductsalary: "",
            upproductMailer: "",
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
            url: '/getpdctypes',
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

        var upproductkey = uppdckey.value;
        var upproductid = uppdcid.value;
        var upproductemail = uppdcemail.value;
        var upproductname = uppdcname.value;
        var upproductphone = uppdcphone.value;
        var upproductsalary = uppdcsalary.value;
        var upproductmailer = this.state.upselectedOption;
        var upproducttype = uppdctype.value;

        this.props.onUpdateSubmit({
            upproductkey: upproductkey,
            upproductid: upproductid,
            upproductname: upproductname,
            upproductemail: upproductemail,
            upproductphone: upproductphone,
            upproductsalary: upproductsalary,
            upproductmailer: upproductmailer,
            upproducttype: upproducttype
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
        <th>Product ID</th>
        <td>
<input type="text" name="uppdcid" id="uppdcid" value={this.state.uppdcid} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Product Name</th>
        <td>
<input name="uppdcname" id="uppdcname" value={this.state.uppdcname} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Product Email</th>
        <td>
<input name="uppdcemail" id="uppdcemail" value={this.state.uppdcemail} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Product Phone</th>
        <td>
<input name="uppdcphone" id="uppdcphone" value={this.state.uppdcphone} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Product Salary</th>
        <td>
<input name="uppdcsalary" id="uppdcsalary" value={this.state.uppdcsalary} onChange={this.state.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Join Mailing List
        </th>
        <td>
            <input
                type="radio"
                name="uppdcmailer"
                id="uppdcmaileryes"
                value="1"
                checked={this.state.upselectedOption === "1"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />Yes
                <input
                type="radio"
                name="uppdcmailer"
                id="uppdcmailerno"
                value="0"
                checked={this.state.upselectedOption === "0"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />No
        </td>
    </tr>
    <tr>
        <th>
            Product Type
        </th>
        <td>
            <SelectUpdateList data={this.state.updata} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="uppdckey" id="uppdckey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Product" />
                    </form>
                </div>
            </div>
        );
    }
});

var ProductList = React.createClass({
    render: function () {
        var productNodes = this.props.data.map(function (product) {
            return (
                <Product
                    key={product.dbproductkey}
                    pdckey={product.dbproductkey}
                    pdcid={product.dbproductid}
                    pdcname={product.dbproductname}
                    pdcemail={product.dbproductemail}
                >
                </Product>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {productNodes}
            </tbody>
        );
    }
});

var Product = React.createClass({
    getInitialState: function () {
        return {
            uppdckey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuppdckey = this.props.pdckey;
        
        this.loadSingleEmp(theuppdckey);
    },
    loadSingleEmp: function (theuppdckey) {
        $.ajax({
            url: '/getsinglepdc',
            data: {
                'uppdckey': theuppdckey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (product) {
                    uppdckey.value = theuppdckey;
                    uppdcemail.value = product.dbproductemail;
                    uppdcid.value = product.dbproductid;
                    uppdcphone.value = product.dbproductphone;
                    uppdcsalary.value = product.dbproductsalary;
                    uppdcname.value = product.dbproductname;
                    if (product.dbproductmailer == 1) {
                        uppdcmaileryes.checked = true;
                    } else {
                        uppdcmailerno.checked = true;
                    }
                    uppdctype.value = product.dbproducttype;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        
        if (this.props.pdcmailer == 1) {
            var themailer = "YES";
        } else {
            var themailer = "NO";
        }

        return (

            <tr>
                            <td>
                                {this.props.pdckey} 
                            </td>
                            <td>
                                {this.props.pdcid}
                            </td>
                            <td>
                                {this.props.pdcname}
                            </td>
                            <td>
                                {this.props.pdcemail}
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
        var optionNodes = this.props.data.map(function (pdcTypes) {
            return (
                <option
                    key = {pdcTypes.dbpdctypeid}
                    value= {pdcTypes.dbpdctypeid}
                >
                    {pdcTypes.dbpdctypename}        
                </option>
            );
        });
        return (
            <select name = "pdctype" id = "pdctype">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (pdcTypes) {
            return (
                <option
                    key={pdcTypes.dbpdctypeid}
                    value={pdcTypes.dbpdctypeid}
                >
                    {pdcTypes.dbpdctypename}
                </option>
            );
        });
        return (
            <select name="uppdctype" id="uppdctype">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <ProductBox />,
    document.getElementById('content')
);