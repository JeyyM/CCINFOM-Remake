import React, { useState, useEffect } from 'react';
import PersonSet from './PersonSet';

const SelectPatients = ({ patientList, onClose, handleSave }) => {
    const [searchValue, setSearchValue] = useState('');
    const [orderChoice, setOrderChoice] = useState('desc');
    const [sortChoice, setSortChoice] = useState('id');

    const [collectionData, setCollectionData] = useState(patientList);

    const handleSortChange = (e) => {
        setSortChoice(e.target.value);
    };

    const filteredSets = collectionData
    .filter((set) =>
      `${set.first_name} ${set.last_name}`
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortChoice === 'id') {
        comparison = a.id - b.id;
      } else if (sortChoice === 'last_name') {
        comparison = a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name);
      } else if (sortChoice === 'birthday') {
        comparison = new Date(a.birthday) - new Date(b.birthday);
      } else if (sortChoice === 'city') {
        comparison = a.city.localeCompare(b.city);
      } else if (sortChoice === 'sex') {
        comparison = a.sex.localeCompare(b.sex);
      }

      return orderChoice === 'desc' ? -comparison : comparison;
    });

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="select-patient-form">
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
                                    <option value="birthday">Age</option>
                                    <option value="sex">Sex</option>
                                    <option value="city">City</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {filteredSets.map((set, index) => (
                        <div key={index} onClick={() => {handleSave(set); onClose();}}>
                        <PersonSet set={set} type="select" />
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
