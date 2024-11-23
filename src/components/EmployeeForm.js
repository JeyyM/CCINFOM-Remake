import React, { useState, useEffect } from 'react';

// FOR CREATING A NEW EMPLOYEE/EDITING EMPLOYEE DETAILS
const EmployeeForm = ({ selectedEmployee, onClose }) => {

    // WHERE FORM DATA IS KEPT AS A DICTIONARY/OBJECT
    const [formData, setFormData] = useState({
        ...selectedEmployee,
        // FOR CHANGING HIRED/FIRED
        status: selectedEmployee.status !== null && selectedEmployee.status !== undefined ? selectedEmployee.status : true,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrorState((prev) => ({ ...prev, [name]: '' }));
    };

    // TO CHANGE HIRED/FIRED
    const toggleStatus = () => {
        setFormData((prev) => ({
            ...prev,
            status: prev.status === "Hired" ? "Fired" : "Hired",
        }));
    };

    // FOR STATUSLESS/NEW EMPLOYEES
    useEffect(() => {
        setFormData({
            ...selectedEmployee,
            status: selectedEmployee.status !== null && selectedEmployee.status !== undefined ? selectedEmployee.status : true
        });
        setErrorState({});
    }, [selectedEmployee]);

    // TO HOLD THE ERRORS
    const [errorState, setErrorState] = useState({});

    // FOR ERROR CHECKING, IS INCOMPLETE/UNSPECIFIC
    const validateForm = () => {
        const errors = {};

        if (!formData.first_name) errors.first_name = 'First name is required.';
        if (!formData.last_name) errors.last_name = 'Last name is required.';
        if (!formData.date_of_birth) errors.date_of_birth = 'Birthday is required.';
        if (!formData.phone_number) errors.phone_number = 'Phone is required.';
        if (!formData.email) errors.email = 'Email is required.';
        if (!formData.sex) errors.sex = 'Sex is required.';
        if (!formData.street_name) errors.street_name = 'Street is required.';
        if (!formData.city_name) errors.city_name = 'City is required.';
        if (!formData.province_name) errors.province_name = 'Province is required.';
        if (!formData.date_hired) errors.date_hired = 'Hire date is required.';
        if (!formData.job_name) errors.job_name = 'Job is required.';
        if (!formData.monthly_salary) errors.monthly_salary = 'Monthly salary is required.';

        if (formData.first_name && formData.first_name.length < 2) errors.first_name = 'First name must be at least 2 characters.';
        if (formData.last_name && formData.last_name.length < 2) errors.last_name = 'Last name must be at least 2 characters.';
        if (formData.phone_number && !/^\d{11}$|^\d{4}[-\s]?\d{3}[-\s]?\d{4}$/.test(formData.phone_number)) errors.phone_number = 'Phone number must be valid (numbers only or dashes/spaces in the right places).';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email must be valid.';
        if (formData.street_name && formData.street_name.length < 2) errors.street_name = 'Street must be at least 2 characters.';
        if (formData.city_name && formData.city_name.length < 2) errors.city_name = 'City must be at least 2 characters.';
        if (formData.province_name && formData.province_name.length < 2) errors.province_name = 'Province must be at least 2 characters.';
        if (formData.date_hired && new Date(formData.date_hired) >= new Date()) errors.date_hired = 'Hire date must be in the past.';
        if (formData.job_name && formData.job_name.length < 2) errors.job_name = 'Job must be at least 2 characters.';
        if (formData.monthly_salary && formData.monthly_salary <= 0) errors.monthly_salary = 'Monthly salary must be greater than 0.';
        if (formData.date_of_birth && new Date(formData.date_of_birth) >= new Date()) errors.date_of_birth = 'Birthday must be in the past.';

        setErrorState(errors);

        return Object.keys(errors).length === 0;
    };
    const fetchLatestPersonId = async () => {
        const tableName = "person";
        const columns = "MAX(person_id) AS person_id";
    
        try {
            const response = await fetch(
                `/api/getData?type=query&table=${tableName}&columns=${columns}`
            );
    
            const data = await response.json();
            // console.log("Fetched person_id:", data);
            if (response.ok && data.length > 0) {
                return data[0].person_id;
            } else {
                throw new Error('Failed to fetch the latest person_id');
            }
        } catch (error) {
            console.error("Error fetching the latest person_id:", error.message);
            throw error;
        }
    };

    const handleSaveEmployee = async () => {
        const destination = "person";
        setErrorState('');

        const inputData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            date_of_birth: new Date(formData.date_of_birth).toISOString().split('T')[0],
            phone_number: formData.phone_number,
            email: formData.email,
            sex: formData.sex,
            street_name: formData.street_name,
            city_name: formData.city_name,
            province_name: formData.province_name,
        };

        try {
            // Insert into person table
            const res = await fetch('/api/getData?type=add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName: destination, formData: inputData })
            });
    
            const response = await res.json();

            if (res.ok) {
                const person_id = await fetchLatestPersonId();
                const destination2 = "staff"
                const staffData = {
                    person_id: person_id,
                    job_name: formData.job_name,
                    monthly_salary: formData.monthly_salary,
                    date_hired: new Date(formData.date_hired).toISOString().split('T')[0],
                    status: 'Hired'
                };
    
                const staffRes = await fetch('/api/getData?type=add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableName: destination2, formData: staffData })
                });
    
                const staffResponse = await staffRes.json();
                if (staffRes.ok) {
                    setSuccessMessage2(staffResponse.message);
                    onClose();
                } else {
                    setErrorState(staffResponse.error);
                }
            } else {
                setErrorState(response.error);
            }
        } catch (err) {
            setErrorState('Failed to insert data');
        }
    };

    const handleEdit = async () => {
        setErrorState('');
    
        const primaryValue = selectedEmployee["person_id"];
        if (!primaryValue) {
            setErrorState("Missing Primary Value");
            return;
        }
    
        // Uses PUT to edit
        try {
            // Original date
            let originalDate = new Date(formData.date_of_birth);

            // Increment the day by 1
            originalDate.setDate(originalDate.getDate() + 1);

            // Format it to YYYY-MM-DD
            let incrementedDate = originalDate.toISOString().split('T')[0];

          const res = await fetch('/api/getData', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tableName:"person",
              formData: {
                first_name: formData.first_name,
                last_name: formData.last_name,
                date_of_birth: incrementedDate,
                phone_number: formData.phone_number,
                email: formData.email,
                sex: formData.sex,
                street_name: formData.street_name,
                city_name: formData.city_name,
                province_name: formData.province_name,
              },
              primaryKey: "person_id",
              primaryValue
            })
          });
    
          const response = await res.json();
    
          if (!res.ok) {
            setErrorState(response.error);
          } else {
            setErrorState(response.message);

              // Original date
              let originalDate = new Date(formData.date_hired);

              // Increment the day by 1
              originalDate.setDate(originalDate.getDate() + 1);

              // Format it to YYYY-MM-DD
              let incrementedDate = originalDate.toISOString().split('T')[0];

            try {
                const res = await fetch('/api/getData', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    tableName:"staff",
                    formData: {
                        job_name: formData.job_name,
                        monthly_salary: formData.monthly_salary,
                        date_hired: incrementedDate,
                        status: formData.status
                    },
                    primaryKey: "person_id",
                    primaryValue
                  })
                });
          
                const response = await res.json();
          
                if (!res.ok) {
                  setErrorState(response.error);
                } else {
                  setErrorState(response.message);
                  onClose();
                }
              } catch (error) {
                  setErrorState(`Error: ${error.message}`);
              }
          }
        } catch (error) {
            setErrorState(`Error: ${error.message}`);
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            if (!selectedEmployee.person_id) {
                handleSaveEmployee(formData);
            } else {
                handleEdit(formData);
            }
            onClose();
        }
    };

    const handleDelete = async () => {    
        const primaryValue = selectedEmployee["person_id"];

        const result = window.confirm('Are you sure you want to proceed? This process cannot be undone.');
        if (!result) {
            console.log('User cancelled!');
            return;
        }

        try {
          const res = await fetch('/api/getData', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tableName: "person",
              primaryKey:"person_id",
              primaryValue
            })
          });
    
          const response = await res.json();
    
          if (!res.ok) {
            setErrorState(response.error);
          } else {
            try {
                const res = await fetch('/api/getData', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    tableName: "staff",
                    primaryKey:"person_id",
                    primaryValue
                  })
                });
          
                const response = await res.json();
          
                if (!res.ok) {
                    setErrorState(response.error);
                } else {
                  onClose();
                }
              } catch (error) {
                setErrorState(`Error: ${error.message}`);
              }            
          }
        } catch (error) {
            console.log(error);
            setErrorState(`Error: ${error.message}`);
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
                                name="date_of_birth"
                                value={formData.date_of_birth ? new Date(formData.date_of_birth).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className="form-input detail-text-dark"
                            />
                            {errorState.date_of_birth && <span className="warning-text">{errorState.date_of_birth}</span>}
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Phone</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number || ''}
                                onChange={handleChange}
                                placeholder="Phone"
                                className="form-input detail-text-dark"
                            />
                            {errorState.phone_number && <span className="warning-text">{errorState.phone_number}</span>}
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
                                name="street_name"
                                value={formData.street_name || ''}
                                onChange={handleChange}
                                placeholder="Street"
                                className="form-input detail-text-dark"
                            />
                            {errorState.street_name && <span className="warning-text">{errorState.street_name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="text-medium-white-bold">City</label>
                            <input
                                type="text"
                                name="city_name"
                                value={formData.city_name || ''}
                                onChange={handleChange}
                                placeholder="City"
                                className="form-input detail-text-dark"
                            />
                            {errorState.city_name && <span className="warning-text">{errorState.city_name}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Province</label>
                            <input
                                type="text"
                                name="province_name"
                                value={formData.province_name || ''}
                                onChange={handleChange}
                                placeholder="Province"
                                className="form-input detail-text-dark"
                            />
                            {errorState.province_name && <span className="warning-text">{errorState.province_name}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="text-medium-white-bold">Hire Date</label>
                            <input
                                type="date"
                                name="date_hired"
                                value={formData.date_hired ? new Date(formData.date_hired).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className="form-input detail-text-dark"
                            />
                            {errorState.date_hired && <span className="warning-text">{errorState.date_hired}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Job</label>
                            <input
                                type="text"
                                name="job_name"
                                value={formData.job_name || ''}
                                onChange={handleChange}
                                placeholder="Job"
                                className="form-input detail-text-dark"
                            />
                            {errorState.job_name && <span className="warning-text">{errorState.job_name}</span>}
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
                        {selectedEmployee.status !== null && selectedEmployee.status !== undefined && (formData.status == "Hired" ? <button type="button" className="large-button-dark detail-text-light" onClick={toggleStatus}>
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
                    <div className='form-row'>
                    <button type="submit" className="red-button detail-text-white" style={{width:"20rem"}} onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EmployeeForm;
