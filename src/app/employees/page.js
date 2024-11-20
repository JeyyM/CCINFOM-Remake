'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EmployeeSet from '@/app/components/EmployeeSet';
import EmployeeForm from '@/app/components/EmployeeForm';

export default function Employees() {
  const [sortChoice, setSortChoice] = useState('id');
  const [orderChoice, setOrderChoice] = useState('desc');

  const handleSortChange = (e) => {
    setSortChoice(e.target.value);
  };

  const [searchValue, setSearchValue] = useState('');

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSave = (employee) => {
    if (employee.id) {
      setCollectionData((prev) =>
        prev.map((p) => (p.id === employee.id ? employee : p))
      );
    } else {
      // NOTE, I PUT THIS HERE FOR THE INCREASE OF IDS, THIS MIGHT HAVE TO BE REMOVED SINCE 
      // WE CAN USE AUTO ITERATION IN SQL
      const newId = Math.max(...collectionData.map((p) => p.id)) + 1;
      setCollectionData((prev) => [...prev, { ...employee, id: newId }]);
    }
    setSelectedEmployee(null);
  };

  const data = [
    {
      id: 1,
      last_name: "Smith",
      first_name: "John",
      birthday: "1990-01-15",
      phone: "09171234567",
      email: "john.smith@gmail.com",
      sex: "M",
      street: "123 Elm Street",
      city: "Makati",
      province: "Metro Manila",
      hire_date: "2015-06-01",
      job: "Software Engineer",
      manager: 3,
      monthly_salary: 75000,
      status: true,
    },
    {
      id: 2,
      last_name: "Doe",
      first_name: "Jane",
      birthday: "1985-03-22",
      phone: "09181234567",
      email: "jane.doe@gmail.com",
      sex: "F",
      street: "456 Pine Avenue",
      city: "Quezon City",
      province: "Metro Manila",
      hire_date: "2012-04-15",
      job: "Project Manager",
      manager: null,
      monthly_salary: 90000,
      status: true,
    },
    {
      id: 3,
      last_name: "Garcia",
      first_name: "Carlos",
      birthday: "1992-07-18",
      phone: "09201234567",
      email: "carlos.garcia@gmail.com",
      sex: "M",
      street: "789 Oak Lane",
      city: "Pasig",
      province: "Metro Manila",
      hire_date: "2018-09-20",
      job: "Team Lead",
      manager: 2,
      monthly_salary: 85000,
      status: true,
    },
    {
      id: 4,
      last_name: "Reyes",
      first_name: "Maria",
      birthday: "1998-11-30",
      phone: "09192234567",
      email: "maria.reyes@gmail.com",
      sex: "F",
      street: "321 Maple Road",
      city: "Cebu City",
      province: "Cebu",
      hire_date: "2021-05-10",
      job: "QA Engineer",
      manager: 3,
      monthly_salary: 60000,
      status: true,
    },
    {
      id: 5,
      last_name: "Tan",
      first_name: "Alexander",
      birthday: "1980-06-12",
      phone: "09193334567",
      email: "alex.tan@gmail.com",
      sex: "M",
      street: "654 Birch Boulevard",
      city: "Davao City",
      province: "Davao del Sur",
      hire_date: "2010-02-18",
      job: "DevOps Engineer",
      manager: 2,
      monthly_salary: 78000,
      status: false,
    },
    {
      id: 6,
      last_name: "Santos",
      first_name: "Angela",
      birthday: "1995-04-25",
      phone: "09194434567",
      email: "angela.santos@gmail.com",
      sex: "F",
      street: "987 Cedar Court",
      city: "Taguig",
      province: "Metro Manila",
      hire_date: "2017-11-01",
      job: "UI/UX Designer",
      manager: 3,
      monthly_salary: 68000,
      status: true,
    },
    {
      id: 7,
      last_name: "Luna",
      first_name: "Roberto",
      birthday: "1983-09-05",
      phone: "09195534567",
      email: "roberto.luna@gmail.com",
      sex: "M",
      street: "111 Willow Drive",
      city: "Baguio City",
      province: "Benguet",
      hire_date: "2008-07-10",
      job: "Systems Architect",
      manager: 2,
      monthly_salary: 120000,
      status: false,
    },
    {
      id: 8,
      last_name: "Villanueva",
      first_name: "Sophia",
      birthday: "1999-02-14",
      phone: "09196634567",
      email: "sophia.villanueva@gmail.com",
      sex: "F",
      street: "222 Spruce Avenue",
      city: "Iloilo City",
      province: "Iloilo",
      hire_date: "2022-01-05",
      job: "Intern",
      manager: 6,
      monthly_salary: 20000,
      status: true,
    },
    {
      id: 9,
      last_name: "Cruz",
      first_name: "Miguel",
      birthday: "1993-12-10",
      phone: "09197734567",
      email: "miguel.cruz@gmail.com",
      sex: "M",
      street: "333 Aspen Street",
      city: "Zamboanga City",
      province: "Zamboanga del Sur",
      hire_date: "2019-03-18",
      job: "Backend Developer",
      manager: 3,
      monthly_salary: 71000,
      status: true,
    },
    {
      id: 10,
      last_name: "Fernandez",
      first_name: "Isabella",
      birthday: "2000-08-08",
      phone: "09198834567",
      email: "isabella.fernandez@gmail.com",
      sex: "F",
      street: "444 Palm Road",
      city: "Bacolod City",
      province: "Negros Occidental",
      hire_date: "2023-06-01",
      job: "Junior Developer",
      manager: 9,
      monthly_salary: 50000,
      status: true,
    },
  ];  

  const [collectionData, setCollectionData] = useState(data);

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

    return orderChoice === 'desc' ? -comparison : comparison; // Adjust based on ascending/descending order
  });


    const assignManager = (data) => {
      return data.map((employee) => {
        const managerOf = data
          .filter((emp) => emp.manager === employee.id).map((emp) => emp.id);
    
        return {
          ...employee,
          manager_of: managerOf,
        };
      });
    };
    
    useEffect(() => {
      const updatedData = assignManager(collectionData);
      setCollectionData(updatedData);
    }, []);


  return (
    <div className='view-appointments-page background'>

      {selectedEmployee && (
        <EmployeeForm
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          handleSave={handleSave}
        />
      )}

      <div className='view-appointments-menu'>
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
                <option value="hire_date">Hire Date</option>
                <option value="manager_count">Manager</option>
                <option value="birthday">Age</option>
                <option value="job">Job</option>
                <option value="salary">Salary</option>
                <option value="sex">Sex</option>
                <option value="city">City</option>
              </select>
            </div>

            <button className='medium-button-1 ' onClick={() => setSelectedEmployee({})}>ADD EMPLOYEE</button>

          </div>
        </div>

        <div className="set-collection">
          {filteredSets.map((set, index) => (
            <EmployeeSet key={index} set={set} onEdit={() => setSelectedEmployee(set)} type="edit" />
          ))}
        </div>

      </div>
    </div>
  );
}
