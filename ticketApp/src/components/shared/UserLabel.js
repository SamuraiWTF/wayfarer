import { useQuery } from 'react-query';
import AuthContext from "../context/AuthContext";
import { useContext } from 'react';
import useApiOrigin from "../../hooks/useApiOrigin";

const UserLabel = ({ userId }) => {
    const { token, clearAuth } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();

    const { isLoading, error, data } = useQuery(['user', userId], () =>
        fetch(`${apiOrigin}/user/${userId}/`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        }),
        {
            onSettled: (res) => {
                if(res.reauth) {
                    clearAuth();
                }
            }
        }
    )

    if(isLoading || userId === undefined) {
        return <span>User {userId}</span>
    }
    if(error) {
        console.log('Error ', error);
        return <span>Err</span>
    }
    if(data.reauth) {
        return <span>Session Expired</span>
    }
    let user = data.data;
    return <span>{user.name}</span>
}

export default UserLabel;