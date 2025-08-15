# 🎯 Placement Coordinator Portal - User Guide

## 🚀 Quick Start for Placement Coordinators

### 1. **Access the Coordinator Portal**
- Visit: `http://localhost:3000/coordinator`
- Login with your @mgit.ac.in email account
- The system will automatically detect your coordinator role

### 2. **Dashboard Overview**
The coordinator dashboard provides:
- **📊 Statistics**: Active jobs, total applications, pending reviews, students selected
- **🏢 Job Management**: Create, edit, and manage on-campus job postings
- **📋 Application Tracking**: View and manage student applications
- **📁 Export Capabilities**: Download application data as Excel/CSV files

### 3. **Creating Job Postings**
Click "Create Job Posting" to add new on-campus opportunities:

#### Required Information:
- **Basic Details**: Job title, company name, location
- **Compensation**: Salary range (min-max in LPA)
- **Eligibility**: Minimum CGPA, allowed branches, academic years
- **Requirements**: Skills and qualifications needed
- **Timeline**: Application deadline

#### Advanced Options:
- **Max Applications**: Limit number of applications (optional)
- **Job Status**: Active/Inactive toggle
- **Experience Level**: Required experience (e.g., 0-2 years)

### 4. **Managing Applications**
In the Applications tab, you can:
- **View All Applications**: See student details, CGPA, branch
- **Update Status**: Change application status (pending → reviewed → shortlisted → selected/rejected)
- **Search & Filter**: Find specific students or filter by status
- **Export Data**: Download application details as CSV for external processing

### 5. **Excel Export Features**
Two export options available:
1. **Job-Specific Export**: Export applications for a single job posting
2. **Complete Export**: Export all applications across all jobs

Export includes:
- Student Name, Roll Number, Email
- CGPA, Branch, Semester
- Job Title, Applied Date, Current Status

### 6. **Application Status Workflow**
1. **Pending**: New applications (default status)
2. **Reviewed**: Coordinator has reviewed the application
3. **Shortlisted**: Student selected for interview/next round
4. **Selected**: Student offered the position
5. **Rejected**: Application not successful

### 7. **Job Management Actions**
For each job posting:
- **✏️ Edit**: Modify job details, requirements, or deadline
- **📥 Export**: Download applications for this specific job
- **🗑️ Delete**: Remove job posting (also removes all associated applications)

### 8. **Real-time Features**
- **Live Updates**: Application counts update automatically
- **Status Changes**: Instantly reflected in the dashboard
- **Search**: Real-time filtering as you type

## 🔧 API Endpoints (For Technical Reference)

### Coordinator Endpoints:
- `GET /coordinator/:id/jobs` - Get coordinator's job postings
- `POST /coordinator/jobs` - Create new job posting
- `PUT /coordinator/jobs/:jobId` - Update job posting
- `DELETE /coordinator/jobs/:jobId` - Delete job posting
- `GET /coordinator/:id/applications` - Get all applications for coordinator's jobs
- `PUT /coordinator/applications/:id/status` - Update application status

### Student Endpoints:
- `GET /student/jobs` - Get eligible on-campus jobs for students
- `POST /student/apply/:jobId` - Submit job application

## 🎓 Student Application Process

Students can:
1. View eligible on-campus jobs based on their CGPA and branch
2. Apply to jobs directly through the platform
3. Track application status in their dashboard
4. Receive automatic eligibility validation

## 🔐 Security & Validation

### Automatic Eligibility Checks:
- **CGPA Verification**: Students below minimum CGPA cannot apply
- **Branch Restriction**: Only students from allowed branches can apply
- **Deadline Enforcement**: Applications blocked after deadline
- **Duplicate Prevention**: Students cannot apply twice to same job

### Data Protection:
- All student data is secure and encrypted
- Only authorized coordinators can access application data
- Export functionality maintains data privacy compliance

## 📞 Support & Troubleshooting

### Common Issues:
1. **Cannot create job**: Ensure all required fields are filled
2. **Export not working**: Check browser popup blocker settings
3. **Applications not showing**: Verify coordinator ID and permissions

### Contact Information:
- Technical Support: Check server logs at `http://localhost:3008/health`
- Database Status: `http://localhost:3008/db-test/status`

---

**🎉 Congratulations!** You now have a fully functional placement coordinator portal with:
- ✅ Job posting management
- ✅ Student application tracking
- ✅ Excel export capabilities
- ✅ Real-time status updates
- ✅ Comprehensive eligibility validation
- ✅ Secure data handling

**Next Steps**: 
1. Create your first job posting
2. Monitor student applications
3. Export data for record-keeping
4. Update application statuses as needed
