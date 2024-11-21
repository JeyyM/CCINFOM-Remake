import React from 'react';

const EmployeeUnit = ({ set, included, manager }) => {
    return (
        <div className="grid-item-set">
            <div className={`employee-choice ${included ? "selected" : ""}`} style={{ width: "100%" }}>
                <div className="set-name text-medium-dark-bold">{set.last_name.toUpperCase()}, {set.first_name.toUpperCase()}</div>
                <div className='set-detail-2' style={{ flexDirection: "column" }}>
                    <h2 className="text-small-white"><span className="text-small-white-bold">JOB:</span> {set.job}</h2>
                    <h2 className="text-small-white"><span className="text-small-white-bold">MONTHLY SALARY:</span> {set.monthly_salary}</h2>
                    <h2 className="text-small-white"><span className="text-small-white-bold">MANAGER: </span> 
                    {manager == null ? "None" : `${manager.last_name}, ${manager.first_name}`}</h2>
                </div>
            </div>
        </div>
    );
};

export default EmployeeUnit;
