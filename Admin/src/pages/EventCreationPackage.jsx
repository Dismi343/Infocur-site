import React, { useEffect,useState } from 'react';
import {useLocation} from "react-router-dom";
import axios from 'axios';

const colorOptions = [
  { name: 'Red', value: 'bg-red-600' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Blue', value: 'bg-blue-600' },
];




const EventCreationPackage = () =>{
  const [selectedArea, setSelectedArea] = useState(null);
  const [packages, setPackages] = useState({ indoor: [], outdoor: [] });
  const [formData, setFormData] = useState({
    indoorPackages: [],
    outdoorPackages: [],
  });

  const [finalFormData, setFinalFormData] = useState({
    eventName: '',
    indoorPackageInfo: [],
    outdoorPackageInfo: [],
    indoor: {},
    outdoor: {},
    startTime: '',
    date: '',
  });
  const location = useLocation();
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPackage, setCurrentPackage] = useState({
    packageName:'',
    photoCount:'',
    price:'',
    numberOfMembers:'',
    color:'bg-red-600',
  });

  console.log("from package creation",location.state.formData);

  useEffect(() => {
    // This runs every time formData changes
    console.log("formData updated:", formData);

  }, [formData]);
  useEffect(() => {
    // This runs every time formData changes
    console.log("formData updated ID:", finalFormData);

  }, [finalFormData]);

  const handleAddNewPackage = (type) => {
    setSelectedArea(type);
    setCurrentPackage({
      packageName:'',
      photoCount:'',
      price:'',
      numberOfMembers:'',
      color:'bg-red-600',
    });
    setEditingIndex(null);
  };

  const handleEdit = (type, index) => {
    setSelectedArea(type);
    setCurrentPackage(formData[type + 'Packages'][index]);
    setEditingIndex(index);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    const key = selectedArea === 'indoor' ? 'indoorPackages' : 'outdoorPackages';
    const idKey = selectedArea === 'indoor' ? 'indoorPackageInfo' : 'outdoorPackageInfo';
    try {
      let savedPackage;
      if (editingIndex !== null) {
        // Update existing package
        const pkg = formData[key][editingIndex];
        const response = await axios.put(`/api/packages/update/${pkg.packageId || pkg.id}`, currentPackage,{ withCredentials:true});
        savedPackage = response.data;
      } else {
        // Create new package
        const response = await axios.post("api/packages/create", currentPackage,{ withCredentials:true});
        savedPackage = response.data;
      }
      setFormData(prev => {
        const updatedPackages = prev[key] ? [...prev[key]] : [];
        if (editingIndex !== null) {
          updatedPackages[editingIndex] = savedPackage;
        } else {
          updatedPackages.push(savedPackage);
        }
        return {
          ...prev,
          [key]: updatedPackages,
        };
      });
      setFinalFormData(prev => {
        const updatedIds = prev[idKey] ? [...prev[idKey]] : [];
        if (editingIndex !== null) {
          updatedIds[editingIndex] = savedPackage.packageId;
        } else {
          updatedIds.push(savedPackage.packageId);
        }
        return {
          ...prev,
          eventName: location.state?.formData?.eventName || prev.eventName,
          indoor: location.state?.formData?.indoor || prev.indoor,
          outdoor: location.state?.formData?.outdoor || prev.outdoor,
          startTime: location.state?.formData?.startTime || prev.startTime,
          date: location.state?.formData?.date || prev.date,
          [idKey]: updatedIds,
        };
      });
      setPackages(prev => ({ ...prev, [selectedArea]: [] }));
      setSelectedArea(null);
      setEditingIndex(null);
    } catch (e) {
      console.log(e);
    }
  };


//delete data from form and backend (packages)
  const handleDelete = async (type, index) => {
    const key = type + 'Packages';
    const pkg = formData[key][index];
    try {
      // If the backend expects an id, adjust as needed (e.g., pkg.id or pkg.packageId)
      await axios.delete(`/api/packages/delete/${pkg.packageId || pkg.id}`,{ withCredentials:true});
      setFormData(prev => {
        const updated = prev[key].filter((_, i) => i !== index);
        return { ...prev, [key]: updated };
      });
      setPackages(prev => ({ ...prev, [type]: [] }));
    } catch (err) {
      console.error('Failed to delete package from backend:', err);
    }
  };

    {/*const handleDone = async () => {
        try {
        const response = await axios.post('http://localhost/PROJECT/backend/savePackages.php', packages, {
            headers: {
            'Content-Type': 'application/json',
            },
            });
            alert('Packages saved successfully!');
            console.log(response.data);
        } 
        catch (error) {
         console.error('Failed to save packages:', error);
         alert('Error saving packages.');
        }
    };*/}

    const handleDone =async()=>{
    const confirmRedirect = window.confirm("Packages saved! Do you want to leave this page?");
    if (confirmRedirect) {
      try{
        await axios.post("api/events/create", finalFormData,{ withCredentials:true});
        window.location.href = "/dashboard"; // update to your target route
      }catch(e){
        console.log(e)
      }

    }
    }

  return (
    <div className="min-h-screen bg-[#7A9CB5] p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
      <div className="bg-gray-400 p-6 rounded-xl shadow-inner">
        <h2 className="text-2xl text-white font-semibold mb-4">Packages</h2>

        {['outdoor', 'indoor'].map((type) => (
          <div
            key={type}
            className="bg-gray-100 rounded-md p-6 mb-6 shadow-md"
          >
            <h3 className="text-xl font-bold text-gray-600 mb-4 capitalize text-center">
              {type}
            </h3>

            <div className="flex flex-col items-center">
              <button
                onClick={() => handleAddNewPackage(type)}
                className={`mb-6 bg-[#2A8ACE] text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md ${
                  (type === 'indoor' && location.state.formData.indoor.sessionCount <= 0) || (type === 'outdoor' && location.state.formData.outdoor.sessionCount <= 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={(type === 'indoor' && location.state.formData.indoor.sessionCount <= 0) || (type === 'outdoor' && location.state.formData.outdoor.sessionCount <= 0)}
              >
                Add New Package
              </button>

              <div className="flex flex-wrap gap-4 justify-center">
                {formData[type + 'Packages'].map((pkg, index) => (
                  <div
                    key={index}
                    className={`text-white p-4 rounded shadow-md w-52 ${pkg.color || 'bg-red-600'}`}
                  >
                    <h4 className="text-lg font-bold mb-2">{pkg.packageName}</h4>
                    <p>Photo Limit: {pkg.photoCount}</p>
                    <p>No of Members: {pkg.numberOfMembers}</p>
                    <p>Rate: LKR {pkg.price}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(type, index)}
                        className="flex-1 text-gray-600 bg-gray-300 px-2 py-1 rounded hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type, index)}
                        className="flex-1 text-white bg-red-600 px-2 py-1 rounded hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {!selectedArea && (

            <div className="justify-end mt-6 flex ">
            <button 
              onClick={handleDone}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Done
            </button>
            </div>

        )}
      </div>

      {/* Modal */}
      {selectedArea && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-300 p-6 rounded-lg w-full max-w-sm shadow-xl text-black">
            <h2 className="text-xl font-bold mb-4">
              {editingIndex !== null ? 'Edit Package' : 'New Package'}
            </h2>

            {['packageName', 'photoCount', 'numberOfMembers', 'price'].map((field, idx) => (
              <div key={idx} className="mb-3">
                <label className="block text-sm mb-1">
                  {field === 'packageName'
                    ? 'Package Name'
                    : field === 'photoCount'
                    ? 'Photo Limit'
                    : field === 'numberOfMembers'
                    ? 'No of Members'
                    : 'Rate'}
                </label>
                <input
                  type="text"
                  value={currentPackage[field]}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const newVal = ['photoCount','numberOfMembers','price'].includes(field)
                        ? raw.replace(/\D/g, '')   // remove any non-digit characters
                        : raw;
                    setCurrentPackage({ ...currentPackage, [field]: newVal });
                  }}
                  placeholder={
                    field === 'packageName'
                      ? 'Package Name'
                      : field === 'photoCount'
                      ? 'Photo Limit'
                      : field === 'numberOfMembers'
                      ? 'No of Members'
                      : 'Rate'
                  }
                  className="w-full px-4 py-2 rounded-full text-black"
                />
              </div>
            ))}

            {/* Color Picker */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`w-6 h-6 rounded-full border-2 ${
                      currentPackage.color === opt.value ? 'border-white' : 'border-transparent'
                    } ${opt.value}`}
                    onClick={() => setCurrentPackage({ ...currentPackage, color: opt.value })}
                  />
                ))}
              </div>
            </div>

                <div className="flex justify-end mt-4 gap-2 ">
                    <button
                        onClick={handleSave}
                        className="bg-[#2A8ACE] text-white px-7 py-2  rounded hover:bg-green-700"
                    >
                        {editingIndex !== null ? 'Save' : 'Add'}
                    </button>

                    <button
                        onClick={() => setSelectedArea(null)}
                        className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    
                </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EventCreationPackage;
