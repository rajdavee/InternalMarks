import React, { useState, useEffect } from 'react';
import { addFaculty, updateFaculty, deleteFaculty, getAllFaculties } from '../api/adminApi';

const FacultyManager = () => {
  const [faculties, setFaculties] = useState([]);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    subjects: [], // Ensure subjects is always an array
  });
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await getAllFaculties();
        setFaculties(data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };
    fetchFaculties();
  }, []);

  const handleAddFaculty = async () => {
    setFormError('');
    try {
      const data = await addFaculty(newFaculty);
      setFaculties([...faculties, data.faculty]);
      setNewFaculty({
        name: '',
        email: '',
        password: '',
        department: '',
        subjects: [], // Reset subjects
      });
    } catch (error) {
      console.error('Error adding faculty:', error);
      setFormError('Error adding faculty');
    }
  };

  const handleUpdateFaculty = async () => {
    if (!editingFaculty) return;
    setFormError('');
    try {
      const data = await updateFaculty(editingFaculty._id, editingFaculty);
      setFaculties(faculties.map(faculty => faculty._id === data.faculty._id ? data.faculty : faculty));
      setEditingFaculty(null);
    } catch (error) {
      console.error('Error updating faculty:', error);
      setFormError('Error updating faculty');
    }
  };

  const handleDeleteFaculty = async (id) => {
    try {
      await deleteFaculty(id);
      setFaculties(faculties.filter(faculty => faculty._id !== id));
    } catch (error) {
      console.error('Error deleting faculty:', error);
      setFormError('Error deleting faculty');
    }
  };

  const handleChange = (field, value) => {
    if (editingFaculty) {
      setEditingFaculty({ ...editingFaculty, [field]: value });
    } else {
      setNewFaculty({ ...newFaculty, [field]: value });
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = (editingFaculty ? editingFaculty.subjects : newFaculty.subjects) || [];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    handleChange('subjects', updatedSubjects);
  };

  const addSubjectField = () => {
    handleChange('subjects', [
      ...(editingFaculty ? editingFaculty.subjects || [] : newFaculty.subjects || []),
      { name: '', code: '' },
    ]);
  };

  const removeSubjectField = (index) => {
    const updatedSubjects = (editingFaculty ? editingFaculty.subjects || [] : newFaculty.subjects || []);
    updatedSubjects.splice(index, 1);
    handleChange('subjects', updatedSubjects);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Faculty Manager</h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add / Edit Faculty</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={editingFaculty ? editingFaculty.name : newFaculty.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={editingFaculty ? editingFaculty.email : newFaculty.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={editingFaculty ? editingFaculty.password : newFaculty.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Department:</label>
          <input
            type="text"
            value={editingFaculty ? editingFaculty.department : newFaculty.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Subjects:</label>
          {(editingFaculty ? editingFaculty.subjects || [] : newFaculty.subjects || []).map((subject, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name || ''}
                onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                className="w-1/2 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Subject Code"
                value={subject.code || ''}
                onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                className="w-1/2 px-3 py-2 border rounded-lg ml-2"
              />
              <button
                onClick={() => removeSubjectField(index)}
                className="ml-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addSubjectField}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Add Subject
          </button>
        </div>
        <button
          onClick={editingFaculty ? handleUpdateFaculty : handleAddFaculty}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Faculty List</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Department</th>
            <th className="py-2 px-4 border-b">Subjects</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map(faculty => (
            <tr key={faculty._id}>
              <td className="py-2 px-4 border-b">{faculty._id}</td>
              <td className="py-2 px-4 border-b">{faculty.name}</td>
              <td className="py-2 px-4 border-b">{faculty.email}</td>
              <td className="py-2 px-4 border-b">{faculty.department}</td>
              <td className="py-2 px-4 border-b">
                {(faculty.subjects || []).map((subject, index) => (
                  <div key={index}>
                    {subject.name} ({subject.code})
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => setEditingFaculty(faculty)}
                  className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFaculty(faculty._id)}
                  className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyManager;
