import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ selectedEmployee, setSelectedEmployee, onClose, handleSave }) => {
    if (!selectedEmployee) return null;

    const [formData, setFormData] = useState({ ...selectedEmployee,
        status: selectedEmployee.status !== null && selectedEmployee.status !== undefined ? selectedEmployee.status : true,
     });
    const [errorState, setErrorState] = useState({});

    useEffect(() => {
        setFormData({ ...selectedEmployee,
            status: selectedEmployee.status !== null && selectedEmployee.status !== undefined ? selectedEmployee.status : true});
        setErrorState({});
    }, [selectedEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrorState((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.first_name) errors.first_name = 'First name is required.';
        if (!formData.last_name) errors.last_name = 'Last name is required.';
        if (!formData.birthday) errors.birthday = 'Birthday is required.';
        if (!formData.phone) errors.phone = 'Phone is required.';
        if (!formData.email) errors.email = 'Email is required.';
        if (!formData.sex) errors.sex = 'Sex is required.';
        if (!formData.street) errors.street = 'Street is required.';
        if (!formData.city) errors.city = 'City is required.';
        if (!formData.province) errors.province = 'Province is required.';
        if (!formData.hire_date) errors.hire_date = 'Hire date is required.';
        if (!formData.job) errors.job = 'Job is required.';
        if (!formData.monthly_salary) errors.monthly_salary = 'Monthly salary is required.';
        // if (formData.status === undefined || formData.status === null)
        //     errors.status = 'Status is required.';

        setErrorState(errors);

        return Object.keys(errors).length === 0;
    };

    const toggleStatus = () => {
        setFormData((prev) => ({ ...prev, status: !prev.status }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            handleSave(formData);
            onClose();
        }
    };

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="employee-form">
                <form className="pop-up-form" onSubmit={handleSubmit}>
                    <h2 className="text-large-white-bold">EMPLOYEE FORM</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="text-medium-white-bold">First Name</label>
                            <input
                                name="first_name"
                                value={formData.first_name || ''}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="form-input detail-text-dark"
                            />
                            {errorState.first_name && <span className="warning-text">{errorState.first_name}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Last Name</label>
                            <input
                                name="last_name"
                                value={formData.last_name || ''}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="form-input detail-text-dark"
                            />
                            {errorState.last_name && <span className="warning-text">{errorState.last_name}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Birthday</label>
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday || ''}
                                onChange={handleChange}
                                className="form-input detail-text-dark"
                            />
                            {errorState.birthday && <span className="warning-text">{errorState.birthday}</span>}
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                placeholder="Phone"
                                className="form-input detail-text-dark"
                            />
                            {errorState.phone && <span className="warning-text">{errorState.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label className="text-medium-white-bold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                placeholder="Email"
                                className="form-input detail-text-dark"
                            />
                            {errorState.email && <span className="warning-text">{errorState.email}</span>}
                        </div>

                        <div className="form-group">
                            <label className="text-medium-white-bold">Sex</label>
                            <select
                                name="sex"
                                value={formData.sex || ''}
                                onChange={handleChange}
                                className="form-input detail-text-dark"
                            >
                                <option value="">Select Sex</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                            {errorState.sex && <span className="warning-text">{errorState.sex}</span>}
                        </div>

                    </div>

                    <div className='form-row'>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Street</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street || ''}
                                onChange={handleChange}
                                placeholder="Street"
                                className="form-input detail-text-dark"
                            />
                            {errorState.street && <span className="warning-text">{errorState.street}</span>}
                        </div>

                        <div className="form-group">
                            <label className="text-medium-white-bold">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleChange}
                                placeholder="City"
                                className="form-input detail-text-dark"
                            />
                            {errorState.city && <span className="warning-text">{errorState.city}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Province</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province || ''}
                                onChange={handleChange}
                                placeholder="Province"
                                className="form-input detail-text-dark"
                            />
                            {errorState.province && <span className="warning-text">{errorState.province}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="text-medium-white-bold">Hire Date</label>
                            <input
                                type="date"
                                name="hire_date"
                                value={formData.hire_date || ''}
                                onChange={handleChange}
                                className="form-input detail-text-dark"
                            />
                            {errorState.hire_date && <span className="warning-text">{errorState.hire_date}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Job</label>
                            <input
                                type="text"
                                name="job"
                                value={formData.job || ''}
                                onChange={handleChange}
                                placeholder="Job"
                                className="form-input detail-text-dark"
                            />
                            {errorState.job && <span className="warning-text">{errorState.job}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Monthly Salary</label>
                            <input
                                type="number"
                                name="monthly_salary"
                                value={formData.monthly_salary || ''}
                                onChange={handleChange}
                                placeholder="Monthly Salary"
                                className="form-input detail-text-dark"
                            />
                            {errorState.monthly_salary && <span className="warning-text">{errorState.monthly_salary}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        {selectedEmployee.status !== null && selectedEmployee.status !== undefined && (formData.status ? <button type="button" className="large-button-dark detail-text-light" onClick={toggleStatus}>
                            HIRED
                        </button> : 
                        <button type="button" className="large-button-red detail-text-white" onClick={toggleStatus}>
                            FIRED
                        </button>)}
                        <button type="button" className="large-button-outline detail-text-white" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="large-button-neon detail-text-dark">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EmployeeForm;
