import React, { useState, useEffect } from 'react';

// FOR INPUTTING/EDITING PATIENT DETAILS
const PatientForm = ({ selectedPatient, onClose, handleSave = () => {}, type }) => {
    if (!selectedPatient) return null;

    // HOLDS THE DETAILS IN DICTIONARY/OBJECTS
    const [formData, setFormData] = useState({ ...selectedPatient });
    const [errorState, setErrorState] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrorState((prev) => ({ ...prev, [name]: '' }));
    };
    // SETS INITIAL DETAILS
    useEffect(() => {
        // setFormData({ ...selectedPatient,status: selectedPatient.status !== null && selectedPatient.status !== undefined ? selectedPatient.status : true
        // });
        //console.log("Selected patient in form:", selectedPatient); // Debugging
        setErrorState({});
    }, [selectedPatient]);

        
    // TO HOLD ERRORS, UNSPECIFIC
    const validateForm = () => {
        const errors = {};

        // Group required fields check
        const requiredFields = [
            { name: 'first_name', message: 'First name is required and must be at least 2 characters.' },
            { name: 'last_name', message: 'Last name is required and must be at least 2 characters.' },
            { name: 'date_of_birth', message: 'Birthday is required and must be in the past.' },
            { name: 'phone_number', message: 'Phone is required and must be valid.' },
            { name: 'email', message: 'Email is required.' },
            { name: 'sex', message: 'Sex is required.' },
            { name: 'street_name', message: 'Street is required and must be at least 2 characters.' },
            { name: 'city_name', message: 'City is required and must be at least 2 characters.' },
            { name: 'province_name', message: 'Province is required and must be at least 2 characters.' },
        ];

        // Apply validation for each field
        requiredFields.forEach(({ name, message }) => {
            if (!formData[name]) {
                errors[name] = message;
            } else {
                // Additional checks for first name and last name length
                if ((name === 'first_name' || name === 'last_name') && formData[name].length < 2) {
                    errors[name] = `${name.replace('_', ' ').toUpperCase()} must be at least 2 characters.`;
                }
                
                // Check that date_of_birth is in the past
                if (name === 'date_of_birth' && new Date(formData[name]) >= new Date()) {
                    errors[name] = 'Birthday must be in the past.';
                }

                // Check that phone_number number is valid
                if (name === 'phone_number' && !/^[\d\s\-\(\)]{10,15}$/.test(formData[name])) {
                    errors[name] = 'Phone number must be valid (numbers, spaces, and dashes are allowed).';
                }

                // Check that street_name, city_name, and province_name have at least 2 characters
                if ((name === 'street_name' || name === 'city_name' || name === 'province_name') && formData[name].length < 2) {
                    errors[name] = `${name.replace('_', ' ').toUpperCase()} must be at least 2 characters.`;
                }
            }
        });

        setErrorState(errors);
        return Object.keys(errors).length === 0;
    };
    const handleDelete = async () => {    
        const primaryValue = selectedPatient["person_id"];

        const result = window.confirm('Are you sure you want to proceed? This action cannot be undone.');
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
                    tableName: "patient",
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
            // console.log(error);
            setErrorState(`Error: ${error.message}`);
        }
      };
    const handlePatientEdit = async () => {
        setErrorState('');
    
        const primaryValue = selectedPatient["person_id"];
        //console.log("primaryValue: ", primaryValue);
        if (!primaryValue) {
            setErrorState("Missing Primary Value");
            return;
        }

        // Original date
        let originalDate = new Date(formData.date_of_birth);

        // Increment the day by 1
        originalDate.setDate(originalDate.getDate() + 1);

        // Format it to YYYY-MM-DD
        let incrementedDate = originalDate.toISOString().split('T')[0];

        // Uses PUT to edit
        try {
            //console.log("trying to edit data");
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
          //console.log("editing in progress...");
          const response = await res.json();
        //   console.log("response: ",response);
          if (!res.ok) {
            setErrorState(response.error);
          } else {
            setErrorState(response.message);
          }
        } catch (error) {
            setErrorState(`Error: ${error.message}`);
        }
      };
    
    const fetchLatestPersonId = async () => {
        const tableName = "person";
        const columns = "MAX(person_id) AS person_id"; // Query for the maximum person_id
    
        try {
            const response = await fetch(`/api/getData?type=query&table=${tableName}&columns=${columns}`);
            const data = await response.json();
    
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

    const handleSavePatient = async () => {
        const destination = "person";
        setErrorState({});
    
        // Filling out person table
        const inputData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            date_of_birth: formData.date_of_birth,
            phone_number: formData.phone_number,
            email: formData.email,
            sex: formData.sex,
            street_name: formData.street_name,
            city_name: formData.city_name,
            province_name: formData.province_name,
        };
    
        console.log('IN SAVE PATIENT', inputData);
    
        try {
            // Submit data to the person table
            const res = await fetch('/api/getData?type=add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName: destination, formData: inputData }),
            });
    
            const response = await res.json();
            if (res.ok) {
                // Fetch the latest person_id
                const latestPersonId = await fetchLatestPersonId();
    
                const destination2 = "patient";
    
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
    
                const formattedDate = `${year}-${month}-${day}`;
    
                const patientData = {
                    person_id: latestPersonId,
                    created_at: formattedDate,
                };
    
                console.log('PATIENT DATA', patientData);
    
                const patientRes = await fetch('/api/getData?type=add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableName: destination2, formData: patientData }),
                });
    
                if (patientRes.ok) {
                    const newPatient = {
                        ...formData,
                        person_id: latestPersonId,
                    };
                    setSuccessMessage("Patient data saved successfully.");
    
                    // Pass the new patient to the parent component
                    handleSave(newPatient);
    
                    // Close the form
                    onClose();
                } else {
                    const patientResponse = await patientRes.json();
                    setErrorState(patientResponse.error || "Failed to save patient details.");
                }
            } else {
                setErrorState(response.error || "Failed to save person details.");
            }
        } catch (err) {
            console.error("Error:", err);
            setErrorState("An error occurred while saving the patient.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before saving
        if (validateForm()) {
            if (type === "new") {
                await handleSavePatient();
            } else {
                if (!selectedPatient.person_id) {
                    await handleSavePatient();
                } else {
                    await handlePatientEdit();
                }
            }
            onClose();
        }
    };

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="patient-form">
                <form className="pop-up-form" onSubmit={handleSubmit}>
                    <h2 className='text-large-white-bold'>PATIENT FORM</h2>
                    <div className='form-row'>
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
                    <div className='form-row'>
                    {type !== "new" && selectedPatient.person_id && <button type="submit" className="red-button detail-text-white" style={{width:"20rem"}} onClick={handleDelete}>Delete</button>}

                        <button type="button" className='large-button-outline detail-text-white' onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className='large-button-neon detail-text-dark'>Save</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PatientForm;
