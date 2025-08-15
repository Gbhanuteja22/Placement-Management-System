import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import { 
  GraduationCap, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Award,
  BookOpen,
  Briefcase,
  Plus,
  X,
  Star,
  ExternalLink
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '',
    location: '',
    dateOfBirth: '',
    bio: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    resumeUrl: '',
    marksMemoUrl: ''
  });

  const [education] = useState<any[]>([]);

  const [experience] = useState<any[]>([]);

  const [skills, setSkills] = useState<any[]>([]);

  const [projects, setProjects] = useState<any[]>([]);

  const [certifications, setCertifications] = useState<any[]>([]);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/${user.id}`);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Loaded user profile:', userData);
          
          // Update profile data with real data
          setProfileData(prev => ({
            ...prev,
            phone: userData.mobileNumber || '',
            location: userData.address || '',
            bio: userData.bio || '',
            linkedIn: userData.linkedIn || '',
            github: userData.github || '',
            portfolio: userData.portfolio || '',
            resumeUrl: userData.resumeUrl || '',
            marksMemoUrl: userData.marksMemoUrl || ''
          }));
          
          // Set education, experience, projects, etc. from userData
          if (userData.projects) setProjects(userData.projects);
          if (userData.certifications) setCertifications(userData.certifications);
          if (userData.skills) setSkills(userData.skills.map((skill: any) => ({ name: skill, level: 'Intermediate' })));
          setResumeUrl(userData.resumeUrl || '');
          
        } else {
          console.log('No profile data found, using empty state');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user?.id) return;
    
    // Validate Google Drive URL if provided
    if (profileData.resumeUrl && profileData.resumeUrl.trim() !== '') {
      const googleDrivePattern = /^https:\/\/(drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view|drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+|docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+)/;
      if (!googleDrivePattern.test(profileData.resumeUrl)) {
        toast.error('Please provide a valid Google Drive URL for Resume. Example: https://drive.google.com/file/d/your-file-id/view');
        return;
      }
    }

    // Validate CMM Google Drive URL if provided
    if (profileData.marksMemoUrl && profileData.marksMemoUrl.trim() !== '') {
      const googleDrivePattern = /^https:\/\/(drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view|drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+|docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+)/;
      if (!googleDrivePattern.test(profileData.marksMemoUrl)) {
        toast.error('Please provide a valid Google Drive URL for CMM. Example: https://drive.google.com/file/d/your-file-id/view');
        return;
      }
    }
    
    try {
      setSaving(true);
      
      const updateData = {
        mobileNumber: profileData.phone,
        address: profileData.location,
        dateOfBirth: profileData.dateOfBirth,
        bio: profileData.bio,
        linkedIn: profileData.linkedIn,
        github: profileData.github,
        portfolio: profileData.portfolio,
        resumeUrl: profileData.resumeUrl,
        marksMemoUrl: profileData.marksMemoUrl,
        skills: skills.map(skill => skill.name),
        projects: projects,
        certifications: certifications
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          ...updateData
        })
      });
      
      if (response.ok) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Advanced':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Beginner':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PlacementPro
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Jobs
              </button>
              <button 
                onClick={() => navigate('/applications')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Applications
              </button>
              <button className="text-blue-600 font-medium px-3 py-2 rounded-md text-sm">Profile</button>
            </nav>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and career details</p>
          </div>
          <div className="flex space-x-3">
            {resumeUrl && (
              <a 
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Resume
              </a>
            )}
            {isEditing ? (
              <button 
                onClick={handleSave}
                className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-gray-600">Computer Science Student</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Social Links</h3>
                <div className="space-y-2">
                  <a href={profileData.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                    <ExternalLink className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                    <ExternalLink className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                    <ExternalLink className="w-4 h-4" />
                    <span>Portfolio</span>
                  </a>
                  {profileData.resumeUrl && (
                    <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                      <ExternalLink className="w-4 h-4" />
                      <span>Resume</span>
                    </a>
                  )}
                  {profileData.marksMemoUrl && (
                    <a href={profileData.marksMemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                      <ExternalLink className="w-4 h-4" />
                      <span>CMM (Consolidated Marks Memo)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  About
                </h3>
              </div>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-600">{profileData.bio}</p>
              )}
            </div>

            {/* Links and Resume Section */}
            {isEditing && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Links & Resume
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={profileData.linkedIn}
                      onChange={(e) => setProfileData({...profileData, linkedIn: e.target.value})}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      value={profileData.github}
                      onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                      placeholder="https://github.com/your-username"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      value={profileData.portfolio}
                      onChange={(e) => setProfileData({...profileData, portfolio: e.target.value})}
                      placeholder="https://your-portfolio.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Google Drive Link
                    </label>
                    <input
                      type="url"
                      value={profileData.resumeUrl}
                      onChange={(e) => setProfileData({...profileData, resumeUrl: e.target.value})}
                      placeholder="https://drive.google.com/file/d/your-file-id/view"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Make sure your Google Drive link is set to "Anyone with the link can view"
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CMM (Consolidated Marks Memo) Google Drive Link
                    </label>
                    <input
                      type="url"
                      value={profileData.marksMemoUrl}
                      onChange={(e) => setProfileData({...profileData, marksMemoUrl: e.target.value})}
                      placeholder="https://drive.google.com/file/d/your-file-id/view"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your Consolidated Marks Memo and share the Google Drive link
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Education Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Education
                </h3>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">{edu.degree} - {edu.field}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}, {edu.location}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">{edu.year}</p>
                      <p className="text-sm font-medium text-blue-600">CGPA: {edu.cgpa}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experience
                </h3>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">{exp.title}</h4>
                    <p className="text-sm text-gray-600">{exp.company}, {exp.location}</p>
                    <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Skills
                </h3>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSkillColor(skill.level)}`}
                  >
                    {skill.name}
                    <span className="ml-1 text-xs">({skill.level})</span>
                    {isEditing && (
                      <button className="ml-2 text-red-500 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Projects
                </h3>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <div className="flex space-x-2">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Certifications
                </h3>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">Issued: {cert.date}</p>
                      <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
