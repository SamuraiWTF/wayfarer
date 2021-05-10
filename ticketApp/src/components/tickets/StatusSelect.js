const StatusSelect = ({ value, onChange }) => {
    return <div className="select">
        <select value={value} onChange={onChange}>
            <option value="open">open</option>
            <option value="closed">closed</option>
        </select>
    </div>
}

export default StatusSelect