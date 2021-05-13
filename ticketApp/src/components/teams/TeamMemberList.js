import TeamMemberCard from './TeamMemberCard';

const TeamMemberList = ({ data: members, onAction }) => {
    const sorter = (() => { 
        const order = ['owner', 'manager', 'member']; 
        return (a,b) => order.indexOf(a.role) - order.indexOf(b.role) || (a.name > b.name ? 1 : -1)
    })()

    return <ul style={{listStyle: 'none'}}>
        { members.sort(sorter).map(member => <li key={member.user_id}><TeamMemberCard data={member} editable={true} removable={true} onAction={onAction} /></li>) }
    </ul>
}

export default TeamMemberList