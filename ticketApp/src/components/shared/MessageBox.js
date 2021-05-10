const MessageBox = ({ type, msg, onDismiss }) => {
    switch(type.toUpperCase()) {
        case 'INFO':
            return <div>Info</div>
        case 'ERROR':
            return <div>Error</div>
        default:
            return ''
    }
}

export default MessageBox;