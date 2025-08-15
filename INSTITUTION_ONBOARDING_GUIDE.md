# Institution Onboarding System Guide

This guide explains the new institution onboarding system that allows placement coordinators to register their institutions and manage student access to the platform.

## Overview

The system now supports multiple institutions with role-based access control. Each institution can have multiple placement coordinators and can control which students are authorized to use the platform.

## Features

### 1. Institution Registration
- **Coordinator Signup**: Placement coordinators can register their institutions
- **Institution Details**: Complete institution information collection
- **Multiple Officers**: Add multiple placement officers with different designations
- **Student Access Control**: Choose between open access or authorized student lists

### 2. Student Authorization
- **Institution Selection**: Students must select their institution during signup
- **Email Verification**: System verifies student eligibility based on institution settings
- **Two Access Modes**:
  - **Open Access**: All students from the institution can register
  - **Controlled Access**: Only pre-authorized students can register

### 3. Coordinator Management
- **Multi-Coordinator Support**: Multiple coordinators per institution
- **Role Designations**: Different titles (Placement Officer, Coordinator, etc.)
- **Main Coordinator**: First coordinator has admin privileges

## How to Use

### For Placement Coordinators

#### Step 1: Institution Registration
1. Visit the main page and click "For Coordinators"
2. Fill in your personal details and institution information
3. Add all placement officers who will manage the system
4. Configure student access settings

#### Step 2: Student Access Configuration
Choose one of two options:

**Option A: Open Access**
- Enable "Allow all students from this institution to register"
- Any student with institutional email can register

**Option B: Controlled Access**
- Upload student data via Excel/CSV or text format
- Use the sample file format: Name, Email, Roll Number, Branch, Semester
- Only listed students can register

### For Students

#### Step 1: Institution Selection
1. Visit the main page and click "For Students"
2. Search and select your institution from the list
3. Enter your institutional email address

#### Step 2: Eligibility Verification
1. System checks if you're authorized to register
2. If authorized, proceed to sign up
3. If not authorized, contact your placement coordinator

## File Formats for Student Data

### Excel/CSV Format
```csv
Name,Email,Roll Number,Branch,Semester
John Doe,john.doe@example.edu,20CS01001,CSE,7
Jane Smith,jane.smith@example.edu,20IT01002,IT,7
Bob Johnson,bob.johnson@example.edu,20EC01003,ECE,6
```

### Text Format
Same as CSV - one student per line, comma-separated values

## API Endpoints

### Institution Management
- `POST /institutions/register` - Register new institution
- `GET /institutions` - List all approved institutions
- `GET /institutions/:id` - Get institution details
- `POST /institutions/verify-coordinator` - Verify coordinator access
- `POST /institutions/verify-student` - Verify student eligibility

## Database Schema

### Institution Schema
```javascript
{
  name: String (required),
  address: String (required),
  city: String (required),
  state: String (required),
  pincode: String,
  phone: String,
  website: String,
  coordinators: [{
    name: String (required),
    email: String (required),
    designation: String,
    isMainCoordinator: Boolean
  }],
  allowAllStudents: Boolean,
  authorizedStudents: [{
    name: String,
    email: String,
    rollNumber: String,
    branch: String,
    semester: String
  }],
  isApproved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Email Verification**: Students must use institutional email addresses
2. **Authorization Check**: System verifies student eligibility before allowing registration
3. **Coordinator Verification**: Only registered coordinators can access coordinator features
4. **Institution Approval**: Institutions can be approved/rejected by administrators

## Benefits

### For Institutions
- **Complete Control**: Manage which students can access the platform
- **Multiple Coordinators**: Support for multiple placement officers
- **Bulk Student Management**: Upload student lists in bulk
- **Branded Experience**: Institution-specific information display

### For Students
- **Verified Access**: Ensures only legitimate students can register
- **Institution Context**: Platform knows your institution and can provide relevant opportunities
- **Streamlined Process**: Simple verification and registration flow

### For Platform
- **Scalability**: Support for multiple institutions
- **Quality Control**: Verified institutions and students
- **Better Analytics**: Institution-wise reporting and statistics

## Troubleshooting

### Common Issues

**Institution Not Found**
- Contact placement coordinator to register institution first

**Student Not Authorized**
- Check with placement office if your details were added
- Verify you're using the correct institutional email
- Contact coordinator to add you to the authorized list

**Coordinator Access Issues**
- Ensure you're using the email address registered during institution setup
- Contact support if you need to update coordinator details

## Next Steps

1. **Admin Panel**: Build admin interface to approve/manage institutions
2. **Bulk Operations**: Enhanced bulk student management features
3. **Integration**: Connect with existing institutional systems
4. **Reporting**: Institution-wise placement reports and analytics
5. **Notifications**: Email notifications for various events

## Support

For technical support or questions about the institution onboarding system:
- Contact your placement coordinator for institutional matters
- Reach out to platform support for technical issues
- Check the FAQ section for common questions

---

This system provides a robust foundation for multi-institutional placement management while maintaining security and ease of use.
