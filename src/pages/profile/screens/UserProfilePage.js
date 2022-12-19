import React, { useState } from 'react'
import { Alert, Avatar, TextField } from '@mui/material';
import AppButton from '../../../global_component/AppButton';
import isEmail from 'validator/lib/isEmail';
import { updateEmail, updateProfile } from '@firebase/auth';
import { authentication } from '../../../firebase-config';
import { UpdateData } from '../../../api/CRUD_API';
import RequiredAuth from '../../requiredAuth/screens/RequiredAuth';

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

const UpdateUserInfo = (currentUser, email, firstname, lastname, setFill) => {
    if (!isEmail(email) || lastname === '' || firstname === '') {
        setFill(false)
        return
    }
    var updateUser = {
        ...currentUser,'userEmail': email,
        'lastName': lastname,
        'firstName': firstname,
        'username': `${lastname} ${firstname}`,
    }
    updateEmail(authentication.currentUser, updateUser.userEmail).then(async () => {
        UpdateData(currentUser.uid, 'users', updateUser).then(() => {
            updateProfile(authentication.currentUser, {
                displayName: `${updateUser.lastName} ${updateUser.firstName}`,
            }).then(() => {
                localStorage.setItem('currentUser', JSON.stringify(updateUser))
                window.location.reload()
            })
        })
    })

    
}

const UserProfilePage = (props) => {
    const [email, setEmail] = useState(props.user.userEmail);
    const [lastname, setLastname] = useState(props.user.lastName);
    const [firstname, setFirstname] = useState(props.user.firstName);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const [isFilled, setFilled] = useState(true)

    return (
        <>
            {props.user ? (
                <>
                    {!isFilled && <Alert severity="warning" className="w-2/5 mt-4 ml-4">
                        Please don't empty any information field !!! Thank you
                    </Alert>}
                    <div className="flex flex-col items-center justify-center my-12">
                        <p className="text-brown text-3xl">Account Settings</p>
                        <div className="w-96 rounded-3xl my-6 pb-6 bg-dark-silver flex flex-col items-center justify-center">
                            <Avatar {...stringAvatar(`${lastname} ${firstname}`)} className='my-3' />
                            <TextField
                                id="outlined-firstname-input"
                                label="Firstname"
                                type="text"
                                size="small"
                                onChange={(event) => setFirstname(event.target.value)}
                                margin="normal"
                                value={firstname}
                                variant="standard"
                            />
                            <TextField
                                id="outlined-lastname-input"
                                label="Lastname"
                                type="text"
                                size="small"
                                value={lastname}
                                onChange={(event) => setLastname(event.target.value)}
                                variant="standard"
                                margin="normal"
                            />
                            <TextField
                                id="outlined-email-input"
                                label="Email"
                                type="email"
                                size="small"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                margin="normal"
                                variant="standard"
                            />
                        </div>
                        <AppButton content="Save Changes" onClick={() => {
                            UpdateUserInfo(currentUser, email, firstname, lastname, setFilled)
                        }} />
                    </div>
                </>
            ) : (
                <RequiredAuth />
            )}
        </>
    )
}

export default UserProfilePage
