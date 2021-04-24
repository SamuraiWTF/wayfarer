import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import AuthContext from '../components/context/AuthContext';
import { useContext } from 'react';

const UserDetails = () => {
    const { token } = useContext(AuthContext);
    let { userId } = useParams();
    const { isLoading, error, data } = useQuery('userDetails', () => 
        fetch(`http://localhost:3001/user/${userId}`, { headers: { 'Authorization' : `Bearer ${token}`}}).then(res => { return res.json() })
    )

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

export default UserDetails;