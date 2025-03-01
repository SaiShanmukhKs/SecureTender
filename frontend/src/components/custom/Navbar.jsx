import React from "react";
import { Button } from "../ui/button";
import { base, tenderer, bidder } from "@/utils/navbarlinks";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    // const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    let loggedin = true

    return (
        <div className="flex dark justify-between px-5 bg-secondary text-white h-16 items-center">
            <p className="text-2xl font-semibold">Secure-Tender</p>
            <div className="flex gap-52">
                {Object.entries(tenderer).map(([name, path], index) => (
                    <a key={index} href={path} className="text-lg">
                        {name}
                    </a>
                ))}
            </div>
            {
                loggedin ? (
                    <Button onClick={handleLogout} className="bg-primary-500 hover:bg-primary-700">
                        Logout
                    </Button>
                ) : (
                    <Button onClick={handleLogout} className="bg-primary-500 hover:bg-primary-700">
                        Login
                    </Button>
                )
            }
        </div>
    );
};

export default Navbar;
