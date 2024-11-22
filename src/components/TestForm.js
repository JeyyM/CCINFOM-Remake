import React, { useState } from 'react';

/**
 * TestForm Component
 * This component allows users to create a form dynamically for a database table.
 * Users can add fields, specify field properties, and submit the form to create a table or add data.
 *
 * Props:
 * - onClose: Function to handle closing the form.
 */
const TestForm = ({ onClose }) => {
    // State to manage the form fields
    const [formData, setFormData] = useState([
        { name: 'ID', nullable: false, dataType: 'INT', isPrimaryKey: true, autoIncrement: true }, // Default primary key field
        { name: '', nullable: true, dataType: 'VARCHAR(45)', isPrimaryKey: false, autoIncrement: false },
    ]);

    // State for mandatory form inputs
    const [tableName, setTableName] = useState(''); // Table name input
    const [testPrice, setTestPrice] = useState(''); // Test price input

    // State for error and success messages
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successMessage2, setSuccessMessage2] = useState('');

    // Updates the table name state
    const handleTableNameChange = (e) => {
        setTableName(e.target.value);
    };

    // Updates the test price state
    const handleTestPriceChange = (e) => {
        setTestPrice(e.target.value);
    };

    // Validates the table name input
    const validateTableName = () => {
        if (!tableName.trim()) {
            setError('Table name cannot be empty.');
            return false;
        }
        return true;
    };

    // Validates the test price input
    const validateTestPrice = () => {
        const price = parseFloat(testPrice);
        if (isNaN(price) || price <= 0) {
            setError2('Test price must be a valid positive number.');
            return false;
        }
        return true;
    };

    // Adds a new field to the form
    const handleAddField = (e) => {
        e.preventDefault();
        setFormData([
            ...formData,
            { name: '', nullable: true, dataType: 'Varchar(50)', isPrimaryKey: false, autoIncrement: false },
        ]);
    };

    // Deletes a field from the form
    const handleDeleteField = (index) => {
        const updatedFields = formData.filter((_, i) => i !== index);
        setFormData(updatedFields);
    };

    // Updates a specific field's properties
    const handleChange = (index, key, value) => {
        const updatedFields = formData.map((field, i) =>
            i === index ? { ...field, [key]: value } : field
        );
        setFormData(updatedFields);
    };

    // Submits the data to the `ref_test_type` table (nested in handleSubmit)
    const handleSubmitRef = async () => {
        setError2('');
        setSuccessMessage2('');
        const destination = "ref_test_type";

        const inputData = {
            test_name: tableName,
            test_price: testPrice
        };

        try {
            const res = await fetch('/api/getData?type=add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName: destination, formData: inputData }),
            });

            const response = await res.json();
            if (res.ok) {
                setSuccessMessage2(response.message);
                onClose(); // Close the form on success
            } else {
                setError2(response.error);
            }
        } catch (err) {
            setError2('Failed to insert data');
        }
    };

    // Handles the main form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setError2('');
        setSuccessMessage2('');

        // Perform initial validations
        if (validateTableName() && validateTestPrice()) {
            try {
                const res = await fetch('/api/getData?type=create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableName, formData }),
                });

                const response = await res.json();
                if (res.ok) {
                    setSuccessMessage(response.message);
                    await handleSubmitRef(); // Trigger nested submission
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('Failed to create table');
            }
        }
    };

    return (
        <>
            {/* Background overlay */}
            <div className="popup-whitesheet" onClick={onClose}></div>

            {/* Main form container */}
            <div className="test-form">
                <form className="pop-up-form" onSubmit={handleSubmit}>
                    <div className="form-row" style={{ justifyContent: "left" }}>
                        <h2 className="text-large-white-bold">TEST FORM</h2>
                        <button className="plus-button detail-text-dark" onClick={handleAddField}>+</button>
                    </div>

                    <div className="form-group">
                        <h3 className="text-medium-white-bold">Table Name:</h3>
                        <input
                            type="text"
                            value={tableName}
                            onChange={handleTableNameChange}
                            className="form-input detail-text-dark"
                            placeholder="Enter table name"
                        />
                    </div>

                    <div className="form-group">
                        <h3 className="text-medium-white-bold">Test Price:</h3>
                        <input
                            type="text"
                            value={testPrice}
                            onChange={handleTestPriceChange}
                            className="form-input detail-text-dark"
                            placeholder="Enter test price"
                        />
                    </div>

                    {formData.map((field, index) => {
                        if (index === 0) return null; // Skip primary key field
                        return (
                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: "center", justifyContent: "center" }}>
                                <div className="form-group">
                                    <label className="text-medium-white-bold">Field Name</label>
                                    <input
                                        className="form-input detail-text-dark"
                                        type="text"
                                        placeholder="Field Name"
                                        value={field.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        style={{ margin: "0" }}
                                    />
                                </div>
                                <select
                                    className="dropdown-item detail-text-dark"
                                    value={field.dataType}
                                    onChange={(e) => handleChange(index, 'dataType', e.target.value)}>
                                    <option value="VARCHAR(45)">VARCHAR(45)</option>
                                    <option value="TEXT">TEXT</option>
                                    <option value="ENUM('M','F')">ENUM(&#39;M&#39;,&#39;F&#39;)</option>
                                    <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                                    <option value="BOOLEAN">BOOLEAN</option>
                                    <option value="DATETIME">DATETIME</option>
                                    <option value="INT">INT</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteField(index)}
                                    className="plus-button detail-text-dark"
                                    style={{ width: "5rem", height: "4rem" }}>
                                    -
                                </button>
                            </div>
                        );
                    })}

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    {error2 && <p style={{ color: 'red' }}>{error2}</p>}
                    {successMessage2 && <p style={{ color: 'green' }}>{successMessage2}</p>}

                    <div className="form-row">
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

export default TestForm;