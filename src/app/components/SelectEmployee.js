import React, { useState, useEffect } from 'react';
import EmployeeUnit from './EmployeeUnit';

const SelectEmployee = ({ selectedEmployee, setSelectedEmployee, employeeList, onClose, handleSave, type }) => {
    const [searchValue, setSearchValue] = useState('');
    const [orderChoice, setOrderChoice] = useState('desc');
    const [sortChoice, setSortChoice] = useState('id');

    const [collectionData, setCollectionData] = useState(employeeList);
    const [newStaff, setNewStaff] = useState(selectedEmployee?.manager_of || []);

    const handleSortChange = (e) => {
        setSortChoice(e.target.value);
    };

    const filteredSets = collectionData
        .filter((set) =>
            `${set.first_name} ${set.last_name}`
                .toLowerCase()
                .includes(searchValue.toLowerCase()) &&
            (type !== "manage" || set.id !== selectedEmployee.id)
        )
        .sort((a, b) => {
            let comparison = 0;

            if (sortChoice === 'id') {
                comparison = a.id - b.id;
            } else if (sortChoice === 'last_name') {
                comparison = a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name);
            } else if (sortChoice === 'hire_date') {
                comparison = new Date(a.hire_date) - new Date(b.hire_date);
            } else if (sortChoice === 'manager_count') {
                comparison = (a.manager_of?.length || 0) - (b.manager_of?.length || 0);
            } else if (sortChoice === 'birthday') {
                comparison = new Date(a.birthday) - new Date(b.birthday);
            } else if (sortChoice === 'job') {
                comparison = a.job.localeCompare(b.job);
            } else if (sortChoice === 'sex') {
                comparison = a.sex.localeCompare(b.sex);
            } else if (sortChoice === 'city') {
                comparison = a.city.localeCompare(b.city);
            } else if (sortChoice === 'salary') {
                comparison = a.monthly_salary - b.monthly_salary;
            }

            return orderChoice === 'desc' ? -comparison : comparison;
        });


    const toggleStaff = (id) => {
        setNewStaff((prev) =>
            prev.includes(id) ? prev.filter((staffId) => staffId !== id) : [...prev, id]
        );
    };

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="select-patient-form" onClick={(e) => e.stopPropagation()}>
                <div className='select-menu'>
                    <h2 className="text-large-white-bold">{type === "manage" ? "MODIFY MANAGEMENT" : "SELECT EMPLOYEE"}</h2>
                    {type === "manage" && <h2 className="text-medium-white"><span className="text-medium-white-bold">Modifying:</span> {selectedEmployee.last_name}, {selectedEmployee.first_name}, {selectedEmployee.job}</h2>}
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
                                    <option value="id">Newest</option>
                                    <option value="last_name">Name</option>
                                    <option value="hire_date">Hire Date</option>
                                    <option value="manager_count">Manager</option>
                                    <option value="birthday">Age</option>
                                    <option value="job">Job</option>
                                    <option value="salary">Salary</option>
                                    <option value="sex">Sex</option>
                                    <option value="city">City</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className='selection-grid'>
                        {filteredSets.map((set, index) => (
                            <div key={index} onClick={() => {
                                if (type === "manage") {
                                    toggleStaff(set.id);
                                } else if (type === "select") {
                                    handleSave(set);
                                }
                            }} className={`object-selector`}>
                                <EmployeeUnit set={set} included={newStaff.includes(set.id)} manager={employeeList.find((employee) => employee.id === set.manager) || null} />
                            </div>
                        ))}
                    </div>

                    <div className='form-row'>
                        <button type="button" style={{ margin: "2rem" }} className='large-button-outline detail-text-white' onClick={onClose}>
                            Cancel
                        </button>
                        <button className='large-button-neon detail-text-dark' onClick={() => handleSave(newStaff)}>Save</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default SelectEmployee;
