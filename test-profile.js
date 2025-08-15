const testData = {
  clerkUserId: "test_user_" + Date.now(),
  email: "test@mgit.ac.in",
  firstName: "Test",
  lastName: "User",
  name: "Test User",
  rollNumber: "21MH1A0123",
  age: 22,
  address: "Test Address",
  collegeEmail: "test@mgit.ac.in",
  personalEmail: "test@gmail.com",
  collegeName: "MGIT",
  academicStartYear: "2021",
  academicEndYear: "2025",
  currentSemester: "8",
  mobileNumber: "9876543210",
  cgpa: 8.5,
  skills: ["JavaScript", "React"],
  achievements: ["Test Achievement"],
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
