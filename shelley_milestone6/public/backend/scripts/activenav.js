var ShowNav = React.createClass({
  render: function () {
    return (
      <nav>
        <div className="itemdropdown">
          <button className="itembtn">Order</button>
          <div className="item-actions">
            <a href="searchorder.html">Search Order</a>
            <a href="insertorder.html">Insert Order</a>
            <a href="updateorder.html">Update Order</a>
          </div>
        </div>

        <div className="itemdropdown">
          <button className="itembtn">Player</button>
          <div className="item-actions">
            <a href="searchplayers.html">Search Player</a>
            <a href="insertplayers.html">Insert Player</a>
            <a href="updateplayers.html">Update Player</a>
          </div>
        </div>

        <div className="itemdropdown">
          <button className="itembtn">Product</button>
          <div className="item-actions">
            <a href="searchproducts.html">Search Product</a>
            <a href="insertproducts.html">Insert Product</a>
            <a href="updateproducts.html">Update Product</a>
          </div>
        </div>

        <div className="itemdropdown">
          <button className="itembtn">Purchase</button>
          <div className="item-actions">
            <a href="searchpurchases.html">Search Purchase</a>
            <a href="insertpurchases.html">Insert Purchase</a>
            <a href="updatepurchases.html">Update Purchase</a>
          </div>
        </div>

        <div className="itemdropdown">
          <button className="itembtn">Reservation</button>
          <div className="item-actions">
            <a href="searchreservations.html">Search Reservation</a>
            <a href="insertreservations.html">Insert Reservation</a>
            <a href="updatereservations.html">Update Reservation</a>
          </div>
        </div>

        <div className="itemdropdown">
          <button className="itembtn">User</button>
          <div className="item-actions">
            <a href="searchusers.html">Search User</a>
            <a href="insertusers.html">Insert User</a>
            <a href="updateusers.html">Update User</a>
          </div>
        </div>

        <div className="itemdropdown">
          <button className="itembtn">My Account</button>
          <div className="item-actions">
            <a href="index.html">Login</a>
            <a href="logoutuser.html">Logout</a>
          </div>
        </div>
      </nav>
    );
  },
});

ReactDOM.render(<ShowNav />, document.getElementById("activenav"));
