let mockData = [
    { id: 1, name: 'helpdesk', members: [
        { userId: 1, role: 'owner' },
        { userId: 3, role: 'member' },
        { userId: 4, role: 'manager' }
    ]},
    {
       id: 2, name: 'customer support', members: [
           { userId: 2, role: 'owner' },
           { userId: 3, role: 'member' }
       ]
    }
]

const getNextId = (() => { 
    let seedId = mockData.length;
    return () => {
        seedId += 1;
        return seedId;
    }
})();

const teams = {
    getTeamDetails: (teamId) => {
        return mockData.find(teamRec => teamRec.id == teamId)
    },
    getTeamsByUser: (userId) => {
        return mockData.filter(teamRec => 
            teamRec.members.find(memberRec => memberRec.userId = userId)
        )
    },
    createTeam: (team) => {
      // TODO: validation - must have name and owner member
      team.id = getNextId();
      mockData.push(team);
      return team;
    },
    updateTeam: (team) => {
      let index = mockData.findIndex(teamRec => teamRec.id === team.id)
      if(index === -1) {
          return undefined;
      } else {
          // TODO: validation - must have name and owner member
          mockData[index] = team;
          return team;
      }
    },
      deleteTeam: (teamId) => {
        let index = mockData.findIndex(teamRec => teamRec.id === teamId)
        if(index === -1) {
            return false;
        } else {
            mockData.splice(index, 1)
            return true;
        }
    }
}

module.exports = teams;
