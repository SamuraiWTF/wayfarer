import { useQuery } from 'react-query';
import { Redirect, useParams } from 'react-router-dom';
import AuthContext from '../components/context/AuthContext';
import { useContext } from 'react';
import useApiOrigin from "../hooks/useApiOrigin";

const AdminUserMemberships = ({ hasAuth }) => {
    const { token } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    let { userId } = useParams();
    const { isLoading, error, data } = useQuery(['admin', 'memberships', userId], () => 
        fetch(`${apiOrigin}/admin/memberships/${userId}`, { headers: { 'Authorization' : `Bearer ${token}`}}).then(res => { return res.json() })
    )

    if(!hasAuth) {
        return <Redirect to={`/login?goto=${window.location.pathname}`} />
    }

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(data.error) {
        // Because for some reason react-query doesn't consider a 404 response an error.
        return data.error;
    }

    let user = data.data;

    return (
        <div>
            <h1 className="title">{user.name}</h1>
        </div>
    )
}

export default AdminUserMemberships;