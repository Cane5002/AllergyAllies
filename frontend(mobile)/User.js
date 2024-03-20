import { useContext } from 'react'
import AuthContext from './AuthContext';
import jwt_decode from 'jwt-decode';

export default function User() {
    const authContext = useContext(AuthContext);
    const decodedToken = jwt_decode(authContext.userToken);

    return decodedToken.UserInfo;
}