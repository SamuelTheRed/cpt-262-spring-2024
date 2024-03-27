var ShowNav = React.createClass({
    render: function () {
        return (
            <div>
                <a href="insertemployee.html">Insert Employee</a> |
                <a href="insertcart.html">Insert Cart</a> |
                <a href="searchemployee.html">Search Employee</a> |
                <a href="updateemployee.html">Update Employee</a> |
                <a href="viewcart.html">View Carts</a> |
                <a href="viewcartbydate.html">View Carts By Date</a>|
                <a href="logout.html">Logout</a>
            </div>
        );
    }
});

ReactDOM.render(
        <ShowNav />,
        document.getElementById('thenav')
);    
