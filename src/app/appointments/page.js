'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TimeDropdown from '../../components/TimeDropdown';
import PatientForm from '../../components/PatientForm';
import SelectPatients from '../../components/SelectPatients';
import SelectEmployee from '../../components/SelectEmployee';

export default function Appointments() {
  let patient_id = -1;
  const [availableTestCount, setAvailableTestCount] = useState(0);

  const fetchNumOfAvailTests = async () => {
    const table = "REF_test_type";
  
    try {
      const response = await fetch(
        `/api/getData?type=query&table=${encodeURIComponent(table)}&columns=COUNT(*) AS count`
      );
  
      if (!response.ok) throw new Error("Failed to fetch number of available tests");
  
      const result = await response.json();
      const count = result[0].count;
  
      setAvailableTestCount(count);
  
    } catch (error) {
      console.error("Error fetching number of available tests:", error);
    }
  };

  const fetchAvailableTests = async () => {
    const table = "REF_test_type";

    const columns =
      "test_name AS name, " +
      "test_price AS price";

    try {
      const response = await fetch(
        `/api/getData?type=query&table=${encodeURIComponent(table)}&columns=${encodeURIComponent(columns)}`
      );

      if (!response.ok) throw new Error("Failed to fetch available tests");

      const result = await response.json();

      const formattedData = result.map(item => ({
        name: item.name,
        price: item.price.toString()
      }));

      setAvailableTests(formattedData);

    } catch (error) {
      console.error("Error fetching available tests:", error);
    }
  };

  const fetchLatestId = async (tableName, columns, key) => {

    try {
      const response = await fetch(
        `/api/getData?type=query&table=${tableName}&columns=${columns}`
      );

      const data = await response.json();
      // console.log("Fetched person_id:", data);
      if (response.ok && data.length > 0) {
        return data[0][key];
      } else {
        throw new Error('Failed to fetch the latest id');
      }
    } catch (error) {
      console.error("Error fetching the latest id:", error.message);
      throw error;
    }
  };

  const handleSubmitPatient = async () => {
    const destination = "person";
    setErrorState({});

    // Filling out person table
    const inputData = {
      first_name: keptPatient.first_name,
      last_name: keptPatient.last_name,
      date_of_birth: new Date(keptPatient.date_of_birth).toISOString().split('T')[0],
      phone_number: keptPatient.phone_number,
      email: keptPatient.email,
      sex: keptPatient.sex,
      street_name: keptPatient.street_name,
      city_name: keptPatient.city_name,
      province_name: keptPatient.province_name,
    };

    console.log('IN SAVE PATIENT', inputData);

    try {
        // Submit data to the person table
        const res = await fetch('/api/getData?type=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableName: destination, formData: inputData })
        });

        const response = await res.json();
        if (res.ok) {
            const destination2 = "patient"

            const now = new Date();

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            
            const formattedDate = `${year}-${month}-${day}`;
            console.log(formattedDate);
            
            const patientData = {person_id: await fetchLatestId("person", "MAX(person_id) AS person_id", "person_id"),
                created_at: formattedDate
            };

            console.log('PATIENT DATA', patientData)
            // console.log("latest patient data", patientData);
            const patientRes = await fetch('/api/getData?type=add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName: destination2, formData: patientData })
            });

            const patientResponse = await patientRes.json();
            if (patientRes.ok) {
                setSuccessMessage("Patient data saved successfully.");
                // onClose();
            } else {
                setErrorState(patientResponse.error);
            }
        } else {
            console.log(error);
            setErrorState(response.error);
        }
    } catch (err) {
        setErrorState({ form: 'Failed to insert data' });
    }
};

  const handleSubmitAppointment = async () => {
    const destination = "appointment";
    setErrorState('');

    const dateNow = new Date();
    const currentYear = dateNow.getFullYear();
    const currentMonth = String(dateNow.getMonth() + 1).padStart(2, '0');
    const currentDay = String(dateNow.getDate()).padStart(2, '0');
    const inputDate = `${currentYear}-${currentMonth}-${currentDay}`;

    const inputData = {
      patient_id: patient_id,
      staff_id: selectedEmployee.person_id,
      appointment_date: selectedDate,
      status: "scheduled",
      created_at: inputDate,
      updated_at: inputDate
    };

    try {
      const res = await fetch('/api/getData?type=add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName: destination, formData: inputData })
      });

      const response = await res.json();

      if (res.ok) {
        const appointment_id = await fetchLatestId("appointment", "MAX(appointment_id) AS appointment_id", "appointment_id");

        const destination2 = "bill"
        const billData = {
          appointment_id: appointment_id,
          total_bill: getTotalPrice(),
          total_paid: 0,
          status: "pending"
        };

        const billRes = await fetch('/api/getData?type=add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName: destination2, formData: billData })
        });

        const billResponse = await billRes.json();


        if (billRes.ok) {
          for (const test of selectedTests) {
            console.log("ACTIVE TEST", test);

            const destination = "junction_table"
            const junctionPayload = {
              appointment_id: appointment_id,
              test_name: test.test
            }

            console.log("JUNCTION PAYLOAD", test);

            try {
              const res = await fetch('/api/getData?type=add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName: destination, formData: junctionPayload }),
              });
        
              if (!res.ok) {
                console.error(`Error for: ${test.test}`);
              } else {
                const response = await res.json();
                console.log(`Successfully added: ${test.test}`, response);
              }
            } catch (error) {
              console.error(`Error for: ${test.test}`, error);
            }
          }

          for (const test of selectedTests) {
            const destination = test.test;
            const testTablePayload = {
              appointment_id: appointment_id
            }

            try {
              const res = await fetch('/api/getData?type=add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName: destination, formData: testTablePayload }),
              });
        
              if (!res.ok) {
                console.error(`Error for: ${test.test}`);
              } else {
                const response = await res.json();
                console.log(`Successfully added: ${test.test}`, response);
              }
            } catch (error) {
              console.error(`Error for: ${test.test}`, error);
            }
          }
        } else {
          setErrorState(billResponse.error);
        }
      } else {
        setErrorState(response.error);
      }
    } catch (err) {
      setErrorState('Failed to insert data');
    }
  };

  const finalSubmission = async () => {
    console.log("kept patient", keptPatient);
  
    // Submit new patient data if needed
    if (!keptPatient || !keptPatient.person_id) {
      console.log("Submitting new patient...");
      await handleSubmitPatient(); // Wait for patient to be saved
      if (keptPatient && keptPatient.person_id) {
        patient_id = keptPatient.person_id;
        console.log("New patient submitted, ID:", patient_id);
      } else {
        console.error("Failed to submit new patient.");
        return;
      }
    } else {
      patient_id = keptPatient.person_id;
      console.log("Using existing patient ID:", patient_id);
    }
  
    // Submit appointment if patient_id is valid
    if (patient_id > 0) {
      console.log("Submitting appointment...");
      await handleSubmitAppointment(); // Wait for appointment to be saved

      setKeptPatient(null);
      setSelectedEmployee(null);
      setSelectedTests([{ test: "", price: "0" }]);
      setSelectedDate("");
      setSelectedHour("");
      setSelectedMinute("");
      setSelectedPeriod("");

    } else {
      console.error("Failed to assign a valid patient_id. Cannot submit appointment.");
      setErrorState("Failed to assign a valid patient_id.");
    }
  };

  const [availableTests, setAvailableTests] = useState([]);

  // WHERE EMPLOYEE DATA IS SET
  const [showEmployees, setShowEmployees] = useState(false); // FOR THE MENU
  const [selectedEmployee, setSelectedEmployee] = useState(null); // HOLDS EMPLOYEE DATA

  // FOR SELECTING THE TESTS
  const [selectedTests, setSelectedTests] = useState([{ test: "", price: "0" }]);
  const handleTestChange = (index, selectedTest) => {
    const updatedTests = [...selectedTests];
    const testDetails = availableTests.find(test => test.name === selectedTest);

    if (testDetails) {
      updatedTests[index] = { test: testDetails.name, price: testDetails.price };
    } else {
      updatedTests[index] = { test: "", price: "0" };
    }

    setSelectedTests(updatedTests);
  };

  const addTest = () => {
    setSelectedTests([...selectedTests, { test: "", price: "0" }]);
  };

  const removeTest = (index) => {
    const updatedTests = selectedTests.filter((test, i) => i !== index);
    setSelectedTests(updatedTests);
  };


  // WHERE PATIENT DATA IS SET
  const [newMenu, setNewMenu] = useState(null); // FOR THE MENU
  const [keptPatient, setKeptPatient] = useState(null); // THIS PART KEEPS THE DATA
  const [selectingPatient, setSelectingPatient] = useState(false); // TO TOGGLE THE MENU

  const handleSavePatient = (patient) => {
    if (patient.id) {
      setKeptPatient(patient);
    } else {
      setKeptPatient(patient);
    }
  };

  // FOR TIME KEEPING AND FORMATTING TO SQL
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentDay = String(today.getDate()).padStart(2, '0');
  const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

  const currentHour = today.getHours();
  const currentMinute = String(today.getMinutes()).padStart(2, '0');

  // FOR AM/PM
  const period = currentHour >= 12 ? 'PM' : 'AM';
  const hour12 = currentHour % 12 === 0 ? 12 : currentHour % 12;

  // FOR VALIDATION
  const [patientError, setPatientError] = useState('');
  const [staffError, setStaffError] = useState('');
  const [monthError, setMonthError] = useState('');
  const [testError, setTestError] = useState('');
  const [testError2, setTestError2] = useState('');
  const [errorState, setErrorState] = useState('');

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  
  // Error checking logic for each case
  const validatePatient = () => {
    if (!keptPatient || !keptPatient.person_id) {
      setPatientError('Please select a patient.');
      return false;
    }
    setPatientError('');
    return true;
  };

  const validateStaff = () => {
    if (!selectedEmployee || !selectedEmployee.person_id) {
      setStaffError('Please select a staff member.');
      return false;
    }
    setStaffError('');
    return true;
  };

  const validateDate = () => {
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj < now) {
      setMonthError('Schedule must be set in the future.');
      return false;
    }
    setMonthError('');
    return true;
  };

  const validateTests = () => {
    if (selectedTests.length === 0 || selectedTests.some(test => !test.test)) {
      setTestError('Select at least one test.');
      return false;
    }
    setTestError('');
    return true;
  };

  const validateMaxTests = () => {
    if (selectedTests.length > availableTestCount) {
      setTestError2('No more tests can be added.');
      return false;
    }
    setTestError2('');
    return true;
  };

  const handleErrors = async () => {
    setErrorState('');

    if (
      !validatePatient() ||
      !validateStaff() ||
      !validateDate() ||
      !validateTests() ||
      !validateMaxTests()
    ) {
      return;
    }

    await finalSubmission();
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((sum, test) => sum + parseInt(test.price), 0);
  };

  useEffect(() => {
    fetchNumOfAvailTests();
    fetchAvailableTests();
  }, []);

  return (
    <div className='appointments-page background'>
      {/* When adding new patient */}
      {newMenu && (
        <PatientForm
        selectedPatient={{}} // Empty object for a new patient
        onClose={() => setNewMenu(null)} // Close the form
        handleSave={handleSavePatient} // Callback to save the patient
        type={"new"} // Specify the form type
      />)}

      {/* When picking an existing patient */}
      {selectingPatient && (
        <SelectPatients
          onClose={() => setSelectingPatient(false)}
          handleSave={handleSavePatient}
        />)}

      {/* When picking an existing employee */}
      {showEmployees && (
        <SelectEmployee
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          onClose={() => setShowEmployees(false)}
          handleSave={(emp) => {
            setSelectedEmployee(emp);
            setShowEmployees(false);
          }}
          type={"select"}
        />)}

      <div className='appointments-menu'>
        <div className='appointments-left'>
          <div className='appointments-section left'>
            <h3 className='warning-text'>{patientError}</h3>

            <div className='appointment-row'>
              <h2 className='text-large-white appointment-header'>PATIENT</h2>
              <button className='pill-button-white text-medium-dark' onClick={() => setNewMenu({})}>NEW</button>
              <button className='pill-button-transparent text-medium-white' onClick={() => setSelectingPatient(true)}>SELECT</button>
            </div>

            {keptPatient ? <>
              <h3 className='detail-text-white'>{keptPatient.last_name}, {keptPatient.first_name}</h3>
              <h3 className='detail-text-white'>{keptPatient.email}</h3>
            </> : <h3 className='detail-text-white'>-</h3>}
          </div>

          <div className='appointments-section left'>
            <h3 className='warning-text'>{staffError}</h3>

            <div className='appointment-row'>
              <h2 className='text-large-white appointment-header'>STAFF</h2>
              <button className='pill-button-transparent text-medium-white' onClick={() => setShowEmployees(true)}>SELECT</button>
            </div>

            {selectedEmployee ? <>
              <h3 className='detail-text-white'>{selectedEmployee.last_name}, {selectedEmployee.first_name}</h3>
              <h3 className='detail-text-white'>{selectedEmployee.email}</h3>
              <h3 className='detail-text-white'>{selectedEmployee.job}</h3>
            </> : <h3 className='detail-text-white'>-</h3>}
          </div>

          <div className='appointments-section left'>
            <h3 className='warning-text'>{monthError}</h3>

            <div className='appointment-row'>
              <h2 className='text-large-white appointment-header'>SCHEDULE</h2>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="form-input detail-text-dark"
              style={{ width: "35rem", textAlign: "center" }}
            />

            <TimeDropdown
              selectedHour={selectedHour}
              setSelectedHour={setSelectedHour}
              selectedMinute={selectedMinute}
              setSelectedMinute={setSelectedMinute}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod} />
          </div>

        </div>
        <div className='appointments-right'>
          <div className='appointments-section'>
            <h3 className='warning-text'>{testError}</h3>
            <h2 className='text-large-white appointment-header'>TESTS</h2>

            <div className='test-selection'>
              <div className='test-row'>
                <h2 className='detail-text-white' style={{ width: "63%" }}>Name</h2>
                <h2 className='detail-text-white' style={{ width: "27%" }}>Price</h2>
                <h2 className='detail-text-white' style={{ width: "7%" }}></h2>
              </div>

              {selectedTests.map((selectedTest, index) => (
                <div className='test-row' key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <select
                    value={selectedTest.test}
                    onChange={(e) => handleTestChange(index, e.target.value)}
                    className="dropdown-item detail-text-dark"
                    style={{ width: '63%' }}>
                    <option value="">Select a test</option>
                    {availableTests.map((test, index) => (
                      <option key={index} value={test.name}>{test.name}</option>
                    ))}
                  </select>

                  <h2 className='dropdown-item-invert detail-text-light' style={{ width: '27%' }}>
                    {selectedTest.price ? `${selectedTest.price}` : ""}
                  </h2>

                  <button
                    onClick={() => removeTest(index)}
                    className='dropdown-item detail-text-dark'
                    style={{ width: "7%" }}>
                    -
                  </button>
                </div>
              ))}

              <button onClick={addTest} className='dropdown-item detail-text-dark add-test'>+</button>

              <h3 className='warning-text' style={{ marginTop: "1rem" }}>{testError2}</h3>
            </div>
          </div>

          <div className='test-row'>
            <h2 className='text-large-white' style={{ whiteSpace: "nowrap" }}>TOTAL PRICE</h2>
            <h2 className='dropdown-item detail-text-dark' style={{ width: "100%", textAlign: "center" }}>{getTotalPrice()}</h2>
          </div>

          <button className='text-medium-dark large-button-1' style={{ width: "100%", textAlign: "center" }}
            onClick={() => {handleErrors()}}>SET APPOINTMENT</button>
        </div>
      </div>

    </div>
  );
}