'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResultPopup from '../components/ResultPopup';

export default function Query() {
    // FORM STATES
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState('');
    const [whereClause, setWhereClause] = useState('');
    const [groupBy, setGroupBy] = useState('');
    const [havingClause, setHavingClause] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [limit, setLimit] = useState('');
    const [joins, setJoins] = useState([{ type: 'INNER', table: '', on: '' }]);

    // DATA AND ERROR MESSAGE
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    // FOR REFRESHING UPON EDITS
    const [refreshData, setRefreshData] = useState(false);

    // JOIN EDITORS
    const addJoin = () => {
        // think of this like an append
        setJoins([...joins, { type: 'INNER', table: '', on: '' }]);
    };

    const updateJoin = (index, key, value) => {
        const newJoins = [...joins];
        newJoins[index][key] = value;
        setJoins(newJoins);
    };

    const removeJoin = (id) => {
        // changes the joins to ones NOT the current index
        const newJoins = joins.filter((item, index) => index != id);
        setJoins(newJoins);
    };

    // FOR THE SPECIFICATION OF PRIMARY KEYS FOR EDITING
    const [primaryKey, setPrimaryKey] = useState('');

    // SELECTED ITEM SETTERS AND POPUP
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const closePopup = () => {
        setSelectedItem(null);
        setRefreshData((prev) => !prev);
    };

    useEffect(() => {
        if (tableName) {
            handleFetch();
        }
    }, [refreshData]);


    // TO FORMAT TO SQL DATE
    function formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // API FETCHERS
    // FOR GETTING THE VALUES
    async function fetchContent(tableName, columns, whereClause, groupBy, havingClause, orderBy, limit, joins) {
        //There are different types for different request types
        // query is for querying
        const type = "query"

        const res = await fetch(
            `/api/getData?type=${type}&table=${tableName}&columns=${encodeURIComponent(columns)}&where=${encodeURIComponent(whereClause)}&groupBy=${encodeURIComponent(groupBy)}&having=${encodeURIComponent(havingClause)}&orderBy=${encodeURIComponent(orderBy)}&limit=${encodeURIComponent(limit)}&joins=${encodeURIComponent(JSON.stringify(joins))}`
        );
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();
    }

    const fetchPrimaryKey = async (tableName) => {
        // gets the specific table's primary key
        if (!tableName) return;
        try {
            const res = await fetch(`/api/getData?type=primaryKey&table=${tableName}`);
            const data = await res.json();
            if (res.ok && data.primaryKey) {
                setPrimaryKey(data.primaryKey);
            } else {
                setPrimaryKey('');
            }
        } catch (error) {
            console.error('Failed to fetch primary key:', error);
        }
    };

    // TRIGGERS THE UPDATE
    const handleFetch = async () => {
        // changes active primary key
        fetchPrimaryKey(tableName);

        // changes the data
        try {
            setError('');
            const result = await fetchContent(tableName, columns, whereClause, groupBy, havingClause, orderBy, limit, joins);

            // Formats data if the words date or timestamp are in the key to specify
            // makes them to the sql format 9999-11-22
            const formattedData = result.map((item) => {
                const newItem = { ...item };
                Object.keys(newItem).forEach((key) => {
                    if (typeof newItem[key] === 'string' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('timestamp'))) {
                        newItem[key] = formatDate(newItem[key]);
                    }
                });
                return newItem;
            });

            setData(formattedData);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='vertical'>
            {selectedItem && (
                <ResultPopup
                    selectedItem={selectedItem}
                    tableName={tableName}
                    primaryKey={primaryKey}
                    onClose={closePopup}
                />
            )}

            <h1>QUERY SAMPLE</h1>
            <h1>UPDATE DATA BY SELECTING THEM (DO NOT DO IT WHILE JOINED)</h1>
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

            <div className='horizontal'>
                <h1>Joins</h1>
                <button onClick={addJoin}>+</button>
            </div>
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
                    <button onClick={() => removeJoin(index)}>-</button>
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