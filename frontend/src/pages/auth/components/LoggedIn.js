import React, {useState} from "react";
import Navbar from "../../Client/components/Navigation/Navbar";
import Sidebar from "../../Client/components/Navigation/Sidebar";
import "./LoggedIn.scss";

const LoggedIn = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return(
        <>
        <Sidebar isOpen={isOpen} toggle={toggle}/>
        <Navbar toggle={toggle}/>
        <div className="loggedIn">
            {children}
        </div>
        </>
    )
}

export default LoggedIn;