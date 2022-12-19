import { faArrowRightFromBracket, faBlog, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar } from '@mui/material'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoutAPI } from '../api/AuthAPI'

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const MenuDropdown = (props) => {
    const location = useLocation()
    const navigation = useNavigate();
    const handleBeforeUnload = (e) => {
        e.preventDefault();
        const message =
            "Are you sure you want to leave? All provided data will be lost.";
        e.returnValue = message;
        return message;
    };

    return (
        <div className={`${props.open ? 'flex' : 'hidden'} w-full h-screen absolute`}
            onClick={(e) => {
                if (e.currentTarget === e.target) {
                    props.onClose();
                }
            }}        
        >
            <div className={` rounded-lg w-72
                absolute bg-teal top-20 right-12 shadow-white shadow-inner
            `}>
                <span className="absolute right-3 -top-2.5"
                    style={{
                        borderLeft: '10px solid transparent',
                        borderRight: "10px solid transparent",
                        borderBottom: '10px solid #649393'
                    }}
                ></span>
                {props.user && <div className="flex pl-2 py-2 border-b-white border-b-2 w-full">
                    <Avatar {...stringAvatar(`${props.user.lastName} ${props.user.firstName}`)} className='my-3' />
                    <div className="flex flex-col text-sm my-3 pl-2">
                        <p className="text-white "
                        >{props.user.lastName} {props.user.firstName}</p>
                        <p className="text-white w-2/3"
                        >{props.user.userEmail}</p>
                    </div>
                </div>}
                <div className="flex max-w-full flex-col ml-4"
                >
                    <div className="flex mt-4"
                    >
                        <FontAwesomeIcon icon={faUser} size="lg" color="white" />
                        <Link className="text-white no-underline ml-4 hover:underline underline-offset-4 decoration-2"
                            to='/profile'
                            onClick={() => {
                                if (location.pathname === '/add/init')
                                    handleBeforeUnload()
                                props.onClose()
                            }}
                        >
                            Edit Profile
                    </Link>
                    </div>
                    <div className="flex my-4"

                    >
                        <FontAwesomeIcon icon={faBlog} size="lg" color="white" />
                        <Link className="text-white no-underline ml-4
                        hover:underline underline-offset-4 decoration-2"
                            to='my-blogs'
                            onClick={() => {
                                if (location.pathname === '/add/init')
                                    handleBeforeUnload()
                                props.onClose()
                            }}

                        >
                            My Blogs
                    </Link>
                    </div>
                    <div className="flex mb-4"
                    >
                        <FontAwesomeIcon icon={faKey} size="lg" color="white" />
                        <Link className="text-white no-underline ml-4 
                        hover:underline underline-offset-4 decoration-2"
                            to='/password'
                            onClick={() => {
                                if (location.pathname === '/add/init')
                                    handleBeforeUnload()
                                props.onClose()
                            }}
                        >
                            Change Password
                    </Link>
                    </div>
                    <div className="flex mb-4" onClick={() => {
                        LogoutAPI()
                        navigation('/')
                        window.location.reload()
                    }}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" color="white" />
                        <Link className="text-white no-underline ml-4 
                        hover:underline underline-offset-4 decoration-2">
                            Log out
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default MenuDropdown