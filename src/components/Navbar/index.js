import React from "react";
import connectButton from "../ConnectWallet";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
return (
	<>
	<div>
	<Nav>
		<NavMenu>
		<NavLink to="/Market" activestyle="true">
			Market
		</NavLink>
		<NavLink to="/Owned" activestyle="true">
			Owned
		</NavLink>
		<NavLink to="/Create" activestyle="true">
			Create
		</NavLink>
		</NavMenu>
	</Nav>
	<div>
		
	</div>
	</div>
	</>
);
};

export default Navbar;