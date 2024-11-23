import React, { useState, useEffect } from 'react';
import EmployeeUnit from './EmployeeUnit';

// WHERE EMPLOYEES ARE SELECTED, NOT EDITED
const SelectEmployee = ({ selectedEmployee, setSelectedEmployee, employeeList, onClose, handleSave, type }) => {
    const [collectionData, setCollectionData] = useState([]);
    // HOLDS EMPLOYEE DATAS
    const fetchEmployees = async () => {
        const tableName = "person";
        const newJoins = [{ type: "INNER", table: "staff", on: "staff.person_id = person.person_id " }]

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
        fetchEmployees();
    }, []);

    // SORTERS AND SEARHERS
    const [searchValue, setSearchValue] = useState('');
    const [orderChoice, setOrderChoice] = useState('desc');
    const [sortChoice, setSortChoice] = useState('person_id');

    const handleSortChange = (e) => {
        setSortChoice(e.target.value);
    };

    const filteredSets = collectionData.filter((set) => `${set.first_name || ''} ${set.last_name || ''}`.toLowerCase()
    .includes(searchValue.toLowerCase())).sort((a, b) => {   
        let comparison = 0;

        if (sortChoice === 'person_id') {
            comparison = a.person_id - b.person_id;
        } else if (sortChoice === 'last_name') {
            comparison = a.last_name?.localeCompare(b.last_name) || a.first_name?.localeCompare(b.first_name);
        } else if (sortChoice === 'hire_date') {
            comparison = new Date(a.hire_date) - new Date(b.hire_date);
        } else if (sortChoice === 'date_of_birth') {
            const dateA = a.date_of_birth ? new Date(a.date_of_birth).toISOString().split('T')[0] : '';
            const dateB = b.date_of_birth ? new Date(b.date_of_birth).toISOString().split('T')[0] : '';

            comparison = dateA.localeCompare(dateB);
        } else if (sortChoice === 'job_name') {
            comparison = a.job_name?.localeCompare(b.job_name);
        } else if (sortChoice === 'sex') {
            comparison = a.sex?.localeCompare(b.sex);
        } else if (sortChoice === 'city_name') {
            comparison = a.city_name?.localeCompare(b.city_name);
        } else if (sortChoice === 'salary') {
            comparison = a.monthly_salary - b.monthly_salary;
        }

        return orderChoice === 'desc' ? -comparison : comparison;
    });

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="select-patient-form" onClick={(e) => e.stopPropagation()}>
                <div className='select-menu'>
                    <h2 className="text-large-white-bold">SELECT EMPLOYEE</h2>
                    <div className='view-nav' style={{ justifyContent: "space-between" }}>

                        <div className='search-pair'>
                            <h2 className='text-medium-white-bold'>SEARCH</h2>
                            <input className='search-bar detail-text-dark' placeholder='Input Employee Name' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}></input>

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
                                    <option value="person_id">Newest</option>
                                    <option value="last_name">Name</option>
                                    <option value="hire_date">Hire Date</option>
                                    <option value="date_of_birth">Age</option>
                                    <option value="job_name">Job</option>
                                    <option value="salary">Salary</option>
                                    <option value="sex">Sex</option>
                                    <option value="city_name">City</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className='selection-grid'>
                        {filteredSets.map((set, index) => {
                            {/* console.log(set); */}
                            return <div key={index} onClick={() => {handleSave(set);}} className={`object-selector`}>
                                <EmployeeUnit set={set} />
                            </div>
                        })}
                    </div>

                    <div className='form-row'>
                        <button type="button" style={{ margin: "2rem" }} className='large-button-outline detail-text-white' onClick={onClose}>
                            Cancel
                        </button>
                        <button className='large-button-neon detail-text-dark'>Save</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default SelectEmployee;
