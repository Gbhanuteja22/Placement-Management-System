const testData = {
  clerkUserId: "new_user_" + Date.now(),
  email: "updated@mgit.ac.in",
  firstName: "Updated",
  lastName: "User",
  name: "Updated User",
  rollNumber: "21MH1A0999",
  age: 23,
  address: "Updated Address",
  collegeEmail: "updated@mgit.ac.in",
  personalEmail: "updated@gmail.com",
  collegeName: "MGIT",
  academicStartYear: "2021",
  academicEndYear: "2025",
  currentSemester: "8",
  mobileNumber: "9876543211",
  cgpa: 9.0,
  skills: ["JavaScript", "React", "Node.js"],
  achievements: ["Updated Achievement"],
  projects: [],
  certifications: []
};
fetch('http://localhost:3008/users/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
