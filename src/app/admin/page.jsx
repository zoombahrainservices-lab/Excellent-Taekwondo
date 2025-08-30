'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ImageEditor from '../../components/ImageEditor';
import { useNotification } from '../../components/NotificationToast';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('programs');
  const [programs, setPrograms] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [images, setImages] = useState([]);
  const [websiteSettings, setWebsiteSettings] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { addNotification, NotificationContainer } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [programsRes, instructorsRes, testimonialsRes, imagesRes, settingsRes] = await Promise.all([
        fetch('/api/admin/programs'),
        fetch('/api/admin/instructors'),
        fetch('/api/admin/testimonials'),
        fetch('/api/admin/images'),
        fetch('/api/admin/settings')
      ]);

      if (programsRes.ok) setPrograms(await programsRes.json());
      if (instructorsRes.ok) setInstructors(await instructorsRes.json());
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
      if (imagesRes.ok) setImages(await imagesRes.json());
      if (settingsRes.ok) setWebsiteSettings(await settingsRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (type, data) => {
    try {
      const response = await fetch(`/api/admin/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await loadData();
        setEditingItem(null);
        addNotification('Changes saved successfully!', 'success');
      } else {
        addNotification('Failed to save changes. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving:', error);
      addNotification('An error occurred while saving. Please try again.', 'error');
    }
  };

  const handleDelete = async (type, id) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        onConfirm: async () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    }).then(async (confirmed) => {
      if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
        addNotification('Item deleted successfully!', 'success');
      } else {
        addNotification('Failed to delete item. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      addNotification('An error occurred while deleting. Please try again.', 'error');
    }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-lg font-medium text-gray-700 animate-pulse">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NotificationContainer />
      
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600 mt-1">Manage your Taekwondo website</p>
              </div>
            </div>
            <Link 
              href="/"
              className="btn btn-premium group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>View Website</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-2">
          <nav className="flex space-x-2">
            {[
              { 
                id: 'programs', 
                name: 'Programs', 
                count: programs.length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                )
              },
              { 
                id: 'instructors', 
                name: 'Instructors', 
                count: instructors.length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                )
              },
              { 
                id: 'testimonials', 
                name: 'Testimonials', 
                count: testimonials.length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                )
              },
              { 
                id: 'images', 
                name: 'Images', 
                count: images.length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                )
              },
              { 
                id: 'settings', 
                name: 'Website Settings', 
                count: '',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                )
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative overflow-hidden group ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
                {tab.count !== '' && (
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {activeTab === 'programs' && (
            <ProgramsTab 
              programs={programs}
              onEdit={setEditingItem}
              onSave={(data) => handleSave('programs', data)}
              onDelete={(id) => handleDelete('programs', id)}
              editingItem={editingItem}
            />
          )}

          {activeTab === 'instructors' && (
            <InstructorsTab 
              instructors={instructors}
              images={images}
              onEdit={setEditingItem}
              onSave={(data) => handleSave('instructors', data)}
              onDelete={(id) => handleDelete('instructors', id)}
              editingItem={editingItem}
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsTab 
              testimonials={testimonials}
              onEdit={setEditingItem}
              onSave={(data) => handleSave('testimonials', data)}
              onDelete={(id) => handleDelete('testimonials', id)}
              editingItem={editingItem}
            />
          )}

          {activeTab === 'images' && (
            <ImagesTab 
              images={images}
              onEdit={setEditingImage}
              onDelete={async (id) => {
                const confirmed = await new Promise((resolve) => {
                  setConfirmDialog({
                    title: 'Delete Image',
                    message: 'Are you sure you want to delete this image? This action cannot be undone.',
                    onConfirm: () => {
                      setConfirmDialog(null);
                      resolve(true);
                    },
                    onCancel: () => {
                      setConfirmDialog(null);
                      resolve(false);
                    }
                  });
                });
                
                if (!confirmed) return;
                
                try {
                  const response = await fetch(`/api/admin/images?id=${id}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    await loadData();
                    addNotification('Image deleted successfully!', 'success');
                  } else {
                    addNotification('Failed to delete image. Please try again.', 'error');
                  }
                } catch (error) {
                  console.error('Error deleting image:', error);
                  addNotification('An error occurred while deleting the image.', 'error');
                }
              }}
              onUpload={() => setShowImageEditor(true)}
            />
          )}

          {activeTab === 'settings' && (
            <WebsiteSettingsTab 
              settings={websiteSettings}
              onSave={(data) => handleSave('settings', data)}
            />
          )}
        </div>
      </div>

      {/* Image Editor Modal */}
      {showImageEditor && (
        <ImageEditor
          image={editingImage}
          onSave={async (savedImage) => {
            await loadData();
            setShowImageEditor(false);
            setEditingImage(null);
            addNotification('Image saved successfully!', 'success');
          }}
          onCancel={() => {
            setShowImageEditor(false);
            setEditingImage(null);
          }}
        />
      )}
      
      {/* Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{confirmDialog.title}</h3>
                  <p className="text-gray-600 mt-1">{confirmDialog.message}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={confirmDialog.onCancel}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Programs Tab Component
function ProgramsTab({ programs, onEdit, onSave, onDelete, editingItem }) {
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
    level: '',
    blurb: '',
    days: [],
    time: ''
  });

  const handleEdit = (program) => {
    setFormData(program);
    onEdit(program);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      ageRange: '',
      level: '',
      blurb: '',
      days: [],
      time: ''
    });
    onEdit({ id: Date.now() });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Programs
          </h2>
          <p className="text-gray-600 mt-2">Manage your Taekwondo training programs</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-premium group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add New Program</span>
          </span>
        </button>
      </div>

      {editingItem && editingItem.id && (
        <ProgramForm
          data={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => onEdit(null)}
        />
      )}

      <div className="grid gap-6">
        {programs.map((program) => (
          <div 
            key={program.id} 
            className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] hover:border-primary/20"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                      {program.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        Ages {program.ageRange}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {program.level}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{program.blurb}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="font-medium">{program.days.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-medium">{program.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 ml-6">
                <button
                  onClick={() => handleEdit(program)}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-sm group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(program.id)}
                  className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-sm group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {programs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs yet</h3>
            <p className="text-gray-600 mb-4">Create your first Taekwondo program to get started</p>
            <button
              onClick={handleAdd}
              className="btn btn-primary"
            >
              Add Your First Program
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Instructors Tab Component
function InstructorsTab({ instructors, images, onEdit, onSave, onDelete, editingItem }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    belts: [],
    photo: ''
  });

  const handleEdit = (instructor) => {
    setFormData(instructor);
    onEdit(instructor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      belts: [],
      photo: ''
    });
    onEdit({ id: Date.now() });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Instructors
          </h2>
          <p className="text-gray-600 mt-2">Manage your teaching team</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-premium group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add New Instructor</span>
          </span>
        </button>
      </div>

      {editingItem && editingItem.id && (
        <InstructorForm
          data={formData}
          images={images}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => onEdit(null)}
        />
      )}

      <div className="grid gap-6">
        {instructors.map((instructor) => (
          <div 
            key={instructor.id} 
            className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] hover:border-primary/20"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-6 flex-1">
                <div className="relative">
                  <img 
                    src={instructor.photo} 
                    alt={instructor.name}
                    className="w-20 h-20 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                    {instructor.name}
                  </h3>
                  <p className="text-primary font-semibold text-lg mt-1">{instructor.role}</p>
                  <p className="text-gray-700 mt-3 leading-relaxed">{instructor.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {instructor.belts.map((belt, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-accent/20 to-primary/20 text-primary border border-primary/20"
                      >
                        {belt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 ml-6">
                <button
                  onClick={() => handleEdit(instructor)}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-sm group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(instructor.id)}
                  className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-sm group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {instructors.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No instructors yet</h3>
            <p className="text-gray-600 mb-4">Add your first instructor to build your team</p>
            <button
              onClick={handleAdd}
              className="btn btn-primary"
            >
              Add Your First Instructor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Testimonials Tab Component
function TestimonialsTab({ testimonials, onEdit, onSave, onDelete, editingItem }) {
  const [formData, setFormData] = useState({
    name: '',
    quote: ''
  });

  const handleEdit = (testimonial) => {
    setFormData(testimonial);
    onEdit(testimonial);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      quote: ''
    });
    onEdit({ id: Date.now() });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Testimonials
          </h2>
          <p className="text-gray-600 mt-2">Showcase student success stories</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-premium group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add New Testimonial</span>
          </span>
        </button>
      </div>

      {editingItem && editingItem.id && (
        <TestimonialForm
          data={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => onEdit(null)}
        />
      )}

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] hover:border-primary/20 relative"
          >
            <div className="absolute top-4 left-4 text-primary/20 group-hover:text-primary/40 transition-colors duration-300">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="flex-1 pl-8">
                <blockquote className="text-gray-800 text-lg leading-relaxed italic font-medium">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center mt-4">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent mr-3"></div>
                  <p className="text-primary font-bold">{testimonial.name}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 ml-6">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-sm group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(testimonial.id)}
                  className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-sm group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-gray-600 mb-4">Add your first student testimonial to build trust</p>
            <button
              onClick={handleAdd}
              className="btn btn-primary"
            >
              Add Your First Testimonial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Form Components
function ProgramForm({ data, onChange, onSubmit, onCancel }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <form onSubmit={onSubmit} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-8 border border-blue-100 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Edit Program</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Program Name</label>
          <input
            type="text"
            placeholder="e.g., Little Dragons"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Age Range</label>
          <input
            type="text"
            placeholder="e.g., 8-12"
            value={data.ageRange}
            onChange={(e) => onChange({ ...data, ageRange: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
          <input
            type="text"
            placeholder="e.g., Beginner"
            value={data.level}
            onChange={(e) => onChange({ ...data, level: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
          <input
            type="text"
            placeholder="e.g., 6:00 PM"
            value={data.time}
            onChange={(e) => onChange({ ...data, time: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-gray-400"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Describe what makes this program special..."
            value={data.blurb}
            onChange={(e) => onChange({ ...data, blurb: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-gray-400"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Days Offered</label>
          <div className="flex flex-wrap gap-3">
            {days.map((day) => (
              <label 
                key={day} 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  data.days.includes(day)
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                    : 'bg-white border-gray-300 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.days.includes(day)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange({ ...data, days: [...data.days, day] });
                    } else {
                      onChange({ ...data, days: data.days.filter(d => d !== day) });
                    }
                  }}
                  className="hidden"
                />
                <span className="font-medium">{day}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-premium"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Save Program</span>
          </span>
        </button>
      </div>
    </form>
  );
}

function InstructorForm({ data, onChange, onSubmit, onCancel, images = [] }) {
  const [showImagePicker, setShowImagePicker] = useState(false);

  return (
    <form onSubmit={onSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Edit Instructor</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="border rounded-lg px-3 py-2 placeholder:text-gray-600"
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={data.role}
          onChange={(e) => onChange({ ...data, role: e.target.value })}
          className="border rounded-lg px-3 py-2 placeholder:text-gray-600"
          required
        />
        
        {/* Enhanced Photo Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-black mb-2">Photo</label>
          <div className="flex items-start space-x-4">
            {data.photo && (
              <img 
                src={data.photo} 
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
            )}
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Photo URL"
                value={data.photo}
                onChange={(e) => onChange({ ...data, photo: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                required
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Choose from Gallery
                </button>
                {data.photo && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...data, photo: '' })}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Belts (comma separated)"
          value={data.belts.join(', ')}
          onChange={(e) => onChange({ ...data, belts: e.target.value.split(',').map(b => b.trim()) })}
          className="border rounded-lg px-3 py-2 placeholder:text-gray-600"
          required
        />
        <div className="md:col-span-2">
          <textarea
            placeholder="Bio"
            value={data.bio}
            onChange={(e) => onChange({ ...data, bio: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full h-20"
            required
          />
        </div>
      </div>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Choose Image</h3>
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="text-gray-800 hover:text-black"
              >
                ✕
              </button>
            </div>
            
            {images.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-800">No images available. Upload images in the Images tab first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div 
                    key={image.id}
                    className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    onClick={() => {
                      onChange({ ...data, photo: image.path });
                      setShowImagePicker(false);
                    }}
                  >
                    <img 
                      src={image.path} 
                      alt={image.originalName}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs text-gray-900 truncate">{image.originalName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}

function TestimonialForm({ data, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Edit Testimonial</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="border rounded-lg px-3 py-2 w-full"
          required
        />
        <textarea
          placeholder="Quote"
          value={data.quote}
          onChange={(e) => onChange({ ...data, quote: e.target.value })}
          className="border rounded-lg px-3 py-2 w-full h-20"
          required
        />
      </div>
      <div className="flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}

// Website Settings Tab Component
function WebsiteSettingsTab({ settings, onSave }) {
  const [formData, setFormData] = useState({
    heroTitle: settings.heroTitle || 'Build Discipline, Confidence, and Fitness with Excellent Taekwondo',
    heroSubtitle: settings.heroSubtitle || 'All ages and skill levels welcome. Join our supportive community and start your journey today.',
    primaryButtonText: settings.primaryButtonText || 'Book a Free Trial',
    secondaryButtonText: settings.secondaryButtonText || 'View Programs',
    features: settings.features || ['Discipline', 'Confidence', 'Fitness'],
    featureDescriptions: settings.featureDescriptions || [
      'Practical skills and character development through structured training.',
      'Build self-assurance and mental strength.',
      'Improve physical conditioning and flexibility.'
    ],
    buttonPadding: settings.buttonPadding || 'px-6 py-3',
    buttonMargin: settings.buttonMargin || 'mt-8',
    sectionPadding: settings.sectionPadding || 'py-16',
    containerMaxWidth: settings.containerMaxWidth || 'max-w-7xl',
    primaryColor: settings.primaryColor || '#2563eb',
    secondaryColor: settings.secondaryColor || '#1e40af',
    textColor: settings.textColor || '#1f2937',
    backgroundColor: settings.backgroundColor || '#ffffff'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
      featureDescriptions: [...formData.featureDescriptions, '']
    });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
      featureDescriptions: formData.featureDescriptions.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index, field, value) => {
    if (field === 'title') {
      const newFeatures = [...formData.features];
      newFeatures[index] = value;
      setFormData({ ...formData, features: newFeatures });
    } else {
      const newDescriptions = [...formData.featureDescriptions];
      newDescriptions[index] = value;
      setFormData({ ...formData, featureDescriptions: newDescriptions });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Website Settings
          </h2>
          <p className="text-gray-600 mt-2">Customize your website appearance and content</p>
        </div>
        <button
          onClick={handleSubmit}
          className="btn btn-premium group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Save All Changes</span>
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Hero Title</label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="Main headline"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Hero Subtitle</label>
              <input
                type="text"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="Supporting text"
              />
            </div>
          </div>
        </div>

        {/* Button Settings */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Button Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Primary Button Text</label>
              <input
                type="text"
                value={formData.primaryButtonText}
                onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Secondary Button Text</label>
              <input
                type="text"
                value={formData.secondaryButtonText}
                onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Button Padding (Tailwind classes)</label>
              <input
                type="text"
                value={formData.buttonPadding}
                onChange={(e) => setFormData({ ...formData, buttonPadding: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="e.g., px-6 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Button Margin (Tailwind classes)</label>
              <input
                type="text"
                value={formData.buttonMargin}
                onChange={(e) => setFormData({ ...formData, buttonMargin: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="e.g., mt-8"
              />
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Layout Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Section Padding (Tailwind classes)</label>
              <input
                type="text"
                value={formData.sectionPadding}
                onChange={(e) => setFormData({ ...formData, sectionPadding: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="e.g., py-16"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Container Max Width (Tailwind classes)</label>
              <input
                type="text"
                value={formData.containerMaxWidth}
                onChange={(e) => setFormData({ ...formData, containerMaxWidth: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="e.g., max-w-7xl"
              />
            </div>
          </div>
        </div>

        {/* Color Settings */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Color Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Primary Color (Hex)</label>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Secondary Color (Hex)</label>
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Text Color (Hex)</label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Background Color (Hex)</label>
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full h-12"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Features Section</h3>
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
            >
              Add Feature
            </button>
          </div>
          <div className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">Feature {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Feature Title</label>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      className="border rounded-lg px-3 py-2 w-full"
                      placeholder="e.g., Discipline"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Feature Description</label>
                    <input
                      type="text"
                      value={formData.featureDescriptions[index]}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      className="border rounded-lg px-3 py-2 w-full"
                      placeholder="e.g., Practical skills and character development"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Images Tab Component
function ImagesTab({ images, onEdit, onDelete, onUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onEdit(imageFiles[0]);
      onUpload();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onEdit(files[0]);
      onUpload();
    }
  };

  const handleImageEdit = (image) => {
    onEdit(image.path);
    onUpload();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Images
          </h2>
          <p className="text-gray-600 mt-2">Manage your website image gallery</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-premium group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Upload New Image</span>
            </span>
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center mb-8 transition-all duration-300 cursor-pointer group ${
          dragOver 
            ? 'border-primary bg-gradient-to-br from-primary/5 to-accent/5 scale-[1.02] shadow-lg' 
            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={`transition-all duration-300 ${dragOver ? 'scale-110' : 'group-hover:scale-105'}`}>
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
            dragOver 
              ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 group-hover:bg-primary group-hover:text-white'
          }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            dragOver ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
          }`}>
            {dragOver ? 'Drop your images here!' : 'Upload Images'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your images here, or click to browse
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>PNG, JPG, GIF</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>Up to 10MB</span>
            </span>
          </div>
        </div>
        
        {dragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl animate-pulse"></div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-800 text-lg">No images uploaded yet</p>
          <p className="text-gray-400 text-sm mt-2">Upload your first image to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <img 
                  src={image.path} 
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={() => handleImageEdit(image)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(image.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 truncate">{image.originalName}</p>
                <p className="text-xs text-gray-800 mt-1">
                  {image.width} × {image.height} • {Math.round(image.size / 1024)}KB
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(image.path);
                      addNotification('Image URL copied to clipboard!', 'success');
                    }}
                    className="text-xs bg-gray-100 text-black px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
