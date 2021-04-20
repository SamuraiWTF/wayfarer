let mockData = [
    { ticketId: 1, title: 'Virus scanner blocking Notepad++', team: 1, assignedTo: 1, status: 'open', due: new Date()},
    { ticketId: 2, title: 'Monitor is broken', team: 1, assignedTo: 1, status: 'closed', due: new Date()},
    { ticketId: 3, title: 'Login isnt working', team: 2, assignedTo: 1, status: 'open', due: new Date()},
    { ticketId: 4, title: 'Cant checkout on website', team: 2, assignedTo: 3, status: 'open', due: new Date()}
]

let mockDataDetails = {
    1: {
        description: `The virus scanner keeps popping up when I try to open Notepad++. 
        Also, I can't find any of my files.
        `,
        comments: [
            { timestamp: new Date(), user: 1, text: 'Have you tried rebooting?' }
        ]
        
    }
}

const tickets = {
    getTicketsByAssignedUser: (userId) => {
        return mockData.filter(ticketRec => ticketRec.assignedTo == userId)
    },
    getTicketsByTeam: (teamId) => {
        return mockData.filter(ticketRec => ticketRec.team == teamId)
    }
}

module.exports = tickets;