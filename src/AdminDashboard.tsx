import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { LogOut, Settings, Users, FileText, Search, Filter, X, ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { JobApplicationForm } from './App';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [web3FormsAccessKey, setWeb3FormsAccessKey] = useState('');
  const [allowedHREmailsInput, setAllowedHREmailsInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      } else {
        setLoading(false);
        setHasAccess(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setHasAccess(true);
    try {
      // Fetch settings
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      if (settingsDoc.exists()) {
        setWeb3FormsAccessKey(settingsDoc.data().web3FormsAccessKey || '');
        const allowedEmails = settingsDoc.data().allowedHREmails || [];
        setAllowedHREmailsInput(allowedEmails.join(', '));
      }

      // Fetch applications
      const appsSnapshot = await getDocs(collection(db, 'applications'));
      const appsList = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(appsList);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (error.message && error.message.includes('permission')) {
        setHasAccess(false);
      } else {
        toast.error("Failed to load data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const allowedHREmails = allowedHREmailsInput
        .split(',')
        .map(email => email.trim())
        .filter(email => email !== '');
      await setDoc(doc(db, 'settings', 'general'), { web3FormsAccessKey, allowedHREmails }, { merge: true });
      toast.success("Settings saved successfully");
      setSettingsOpen(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteApplicant = async (appId: string, applicantName: string) => {
    if (window.confirm(`Are you sure you want to delete the application for ${applicantName}? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'applications', appId));
        toast.success(`Application for ${applicantName} deleted successfully`);
        fetchData(); // Refresh the list
      } catch (error) {
        console.error("Error deleting application:", error);
        toast.error("Failed to delete application");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full relative">
          <Link to="/" className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Form
          </Link>
          <h1 className="text-2xl font-bold mb-6 mt-4 text-gray-800">HR Dashboard Login</h1>
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full relative">
          <Link to="/" className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Form
          </Link>
          <h1 className="text-2xl font-bold mb-4 mt-4 text-red-600">Access Denied</h1>
          <p className="text-gray-600 mb-6">Your email address ({user.email}) is not authorized to access the HR Dashboard. Please contact the administrator to request access.</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const filteredApps = departmentFilter 
    ? applications.filter(app => app.department === departmentFilter)
    : applications;

  const departments = Array.from(new Set(applications.map(app => app.department).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">HR Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 font-medium mr-4">
              View Public Form
            </Link>
            <span className="text-sm text-gray-600">{user.email}</span>
            {user.email === 'kazuya.takumi17@gmail.com' && (
              <button 
                onClick={() => setSettingsOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Settings Modal */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Web3Forms Access Key</label>
                <p className="text-xs text-gray-500 mb-2">Get your free access key from <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">web3forms.com</a> to receive email notifications.</p>
                <input 
                  type="text" 
                  value={web3FormsAccessKey} 
                  onChange={(e) => setWeb3FormsAccessKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 12345678-abcd-1234-abcd-1234567890ab"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowed HR Emails</label>
                <p className="text-xs text-gray-500 mb-2">Comma-separated list of emails allowed to login to the HR Dashboard.</p>
                <textarea 
                  value={allowedHREmailsInput} 
                  onChange={(e) => setAllowedHREmailsInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="hr1@example.com, hr2@example.com"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveSettings}
                  disabled={savingSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Job Applications</h2>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex-1 sm:w-48"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{app.fullName}</div>
                            <div className="text-sm text-gray-500">{app.email} | {app.hpNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.positionApplied}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.department || <span className="text-gray-400 italic">Not assigned</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                          app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          app.status === 'KIV' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View & Edit
                          </button>
                          <button
                            onClick={() => handleDeleteApplicant(app.id, app.fullName)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Applicant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto flex flex-col">
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">Editing Application: {selectedApp.fullName}</h2>
            <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">
              <X className="w-5 h-5" /> Close Editor
            </button>
          </div>
          <div className="flex-1 p-4">
            <JobApplicationForm 
              initialData={selectedApp} 
              isAdmin={true} 
              onSaveSuccess={() => {
                fetchData();
                setSelectedApp(null);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
