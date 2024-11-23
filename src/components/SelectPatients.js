import React, { useState, useEffect } from 'react';
import PatientSet from './PatientSet';

// WHERE EMPLOYEES ARE SELECTED, NOT EDITED
const SelectPatients = ({ onClose, handleSave }) => {
    const [collectionData, setCollectionData] = useState([]);
    // HOLDS EMPLOYEE DATAS
    const fetchPatients = async () => {
        const tableName = "person";
        const newJoins = [{ type: "INNER", table: "patient", on: "patient.person_id = person.person_id " }]

        try {
            const response = await fetch(
                `/api/getData?type=query&table=${encodeURIComponent(tableName)}&joins=${encodeURIComponent(JSON.stringify(newJoins))}`
            );
            if (!response.ok) throw new Error('Failed kilms');

            const result = await response.json();
            setCollectionData(result);
        } catch (error) {
            console.log('Error fetching revenue trends:', error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // SORTERS AND SEARHERS
    const [searchValue, setSearchValue] = useState('');
    const [orderChoice, setOrderChoice] = useState('desc');
    const [sortChoice, setSortChoice] = useState('person_id');

    const handleSortChange = (e) => {
        setSortChoice(e.target.value);
    };

    console.log(collectionData);

    const filteredSets = collectionData.filter((set) => `${set.first_name || ''} ${set.last_name || ''}`.toLowerCase()
        .includes(searchValue.toLowerCase())).sort((a, b) => {
            let comparison = 0;

            if (sortChoice === 'person_id') {
                comparison = a.person_id - b.person_id;
            } else if (sortChoice === 'last_name') {
                comparison = a.last_name?.localeCompare(b.last_name) || a.first_name?.localeCompare(b.first_name);
            } else if (sortChoice === 'date_of_birth') {
                const dateA = a.date_of_birth ? new Date(a.date_of_birth).toISOString().split('T')[0] : '';
                const dateB = b.date_of_birth ? new Date(b.date_of_birth).toISOString().split('T')[0] : '';

                comparison = dateA.localeCompare(dateB);
            } else if (sortChoice === 'sex') {
                comparison = a.sex?.localeCompare(b.sex);
            } else if (sortChoice === 'city_name') {
                comparison = a.city_name?.localeCompare(b.city_name);
            }

            return orderChoice === 'desc' ? -comparison : comparison;
        });

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="select-patient-form" onClick={(e) => e.stopPropagation()}>
                <div className='select-menu'>
                    <div className='view-nav' style={{ justifyContent: "space-between" }}>

                        <div className='search-pair'>
                            <h2 className='text-medium-white-bold'>SEARCH</h2>
                            <input className='search-bar detail-text-dark' placeholder='Input Patient Name' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}></input>

                        </div>

                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <div className='view-sort-by'>
                                <div className='view-order'>
                                    <h3 className='text-medium-white-bold' style={{ marginRight: "auto", fontSize: "1.5rem" }}>SORT BY</h3>
                                    <button className='order-choice text-medium-dark-bold'
                                        onClick={() => setOrderChoice(orderChoice == "desc" ? '' : "desc")}
                                        style={{ fontSize: "1.5rem" }}>
                                        {orderChoice == "desc" ? "DESCENDING" : "ASCENDING"}</button>
                                </div>

                                <select
                                    value={sortChoice}
                                    onChange={handleSortChange}
                                    className="dropdown-item-2 detail-text-dark">
                                    <option value="id">Newest</option>
                                    <option value="last_name">Name</option>
                                    <option value="date_of_birth">Age</option>
                                    <option value="sex">Sex</option>
                                    <option value="city_name">City</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {filteredSets.map((set, index) => (
                        <div key={index} onClick={() => { handleSave(set); onClose(); }} className='object-selector'>
                            <PatientSet set={set} type="select" />
                        </div>
                    ))}

                    <button type="button" style={{ margin: "2rem auto" }} className='large-button-outline detail-text-white' onClick={onClose}>
                        Cancel
                    </button>

                </div>
            </div>
        </>
    );
};

export default SelectPatients;
