'use client';

import { useState } from 'react';
import Link from 'next/link';
import ResultPopup from '../components/ResultPopup';

export default function Appointments() {
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState('');
    const [whereClause, setWhereClause] = useState('');
    const [groupBy, setGroupBy] = useState('');
    const [havingClause, setHavingClause] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [limit, setLimit] = useState('');
    const [joins, setJoins] = useState([{ type: 'INNER', table: '', on: '' }]);
    
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    const addJoin = () => {
        setJoins([...joins, { type: 'INNER', table: '', on: '' }]);
    };

    const updateJoin = (index, key, value) => {
        const newJoins = [...joins];
        newJoins[index][key] = value;
        setJoins(newJoins);
    };

    async function fetchContent(tableName, columns, whereClause, groupBy, havingClause, orderBy, limit, joins) {
        const res = await fetch(
            `/api/getData?table=${tableName}&columns=${encodeURIComponent(columns)}&where=${encodeURIComponent(whereClause)}&groupBy=${encodeURIComponent(groupBy)}&having=${encodeURIComponent(havingClause)}&orderBy=${encodeURIComponent(orderBy)}&limit=${encodeURIComponent(limit)}&joins=${encodeURIComponent(JSON.stringify(joins))}`
        );
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();
    }

    const handleFetch = async () => {
        try {
            setError('');
            const result = await fetchContent(tableName, columns, whereClause, groupBy, havingClause, orderBy, limit, joins);
            setData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const closePopup = () => {
        setSelectedItem(null);
    };

    return (
        <div className='vertical'>
            <ResultPopup selectedItem={selectedItem} onClose={closePopup} />

            <h1>SQL SAMPLE</h1>
            <Link href="..">Back</Link>

            <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Enter table name"
            />
            <br />
            <input
                type="text"
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                placeholder="Enter column names (comma-separated)"
            />
            <br />
            <input
                type="text"
                value={whereClause}
                onChange={(e) => setWhereClause(e.target.value)}
                placeholder="Enter WHERE clause"
            />
            <br />
            <input
                type="text"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                placeholder="Enter GROUP BY clause"
            />
            <br />
            <input
                type="text"
                value={havingClause}
                onChange={(e) => setHavingClause(e.target.value)}
                placeholder="Enter HAVING clause"
            />
            <br />
            <input
                type="text"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                placeholder="Enter ORDER BY clause"
            />
            <br />
            <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Enter LIMIT"
            />
            <br />

            <h1>Joins</h1>
            <button onClick={addJoin}>+</button>
            {joins.map((join, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <select
                        value={join.type}
                        onChange={(e) => updateJoin(index, 'type', e.target.value)}
                    >
                        <option value="INNER">INNER</option>
                        <option value="LEFT">LEFT</option>
                        <option value="RIGHT">RIGHT</option>
                    </select>
                    <input
                        type="text"
                        value={join.table}
                        onChange={(e) => updateJoin(index, 'table', e.target.value)}
                        placeholder="Join table"
                    />
                    <input
                        type="text"
                        value={join.on}
                        onChange={(e) => updateJoin(index, 'on', e.target.value)}
                        placeholder="Join ON condition"
                    />
                </div>
            ))}
            <br />
            <button onClick={handleFetch}>Fetch Data</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h1>Count: {data.length}</h1>
            <ul>
                {data.length > 0 &&
                    data.map((item, index) => (
                        <div className='item-section' key={index} onClick={() => handleItemClick(item)}>
                            <li>
                                {Object.entries(item).map(([key, value]) => (
                                    <div key={key}>
                                        <strong>{key}:</strong> {value}
                                    </div>
                                ))}
                            </li>
                        </div>
                    ))}
            </ul>
        </div>
    );
}