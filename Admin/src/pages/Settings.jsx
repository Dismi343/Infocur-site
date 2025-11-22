import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SettingsPage = () => {
  // Controlled form state
  const [formData, setFormData] = useState({

    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
  });

const [contactData,setContactData]=useState({
    contact1: "",
    contact2: "",
    email: "",
});

  // Social links and UI state
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);


  useEffect(() => {
    const fetchData =async ()=>{

      try{
        const id ="dfc626f4-5ea3-4149-a7f4-26364e91dec3";
        const res = await axios.get(`/api/bankDetails/find/${id}`,{ withCredentials:true}); //"api/bankDetails/find/dfc626f4-5ea3-4149-a7f4-26364e91dec3
       // console.log(res.data.data);
        setFormData(res.data.data);

        const id2="21734a30-23a2-4561-b028-5470b6709156";
        const res2=await axios.get(`/api/contactDetails/find/${id2}`,{ withCredentials:true});
       // console.log(res2.data.data);
        setContactData(res2.data.data);

      }
      catch(err){
        console.log("error occcured",err);
      }
    };
    fetchData();
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setContactData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSave = (e) => {
    // if (!isFormComplete()) {
    //   alert('Please fill in all fields before saving.');
    //   return;
    // }

    e.preventDefault();

    try{
      const id ="dfc626f4-5ea3-4149-a7f4-26364e91dec3";
       axios.put(`/api/bankDetails/update/${id}`,formData,{ withCredentials:true});


      const id2="21734a30-23a2-4561-b028-5470b6709156";axios.put(`/api/contactDetails/update/${id2}`,contactData,{ withCredentials:true});


    }
    catch(e){
      console.log("error while updating",e);
    }
    setIsSaved(true);
    setIsEditing(false);

  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

 // console.log(contactData);
  return (
    <div className="relative min-h-screen bg-[#7895B2] px-4 py-8 font-sora p-6 flex justify-center items-center">
      <div className="bg-[#D9D9D9] rounded-2xl shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Settings</h2>

        {!isEditing && isSaved ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-900">Bank Details</h3>
              <div className="pl-2 mt-2"><strong>Bank Name:</strong> {formData.bankName}</div>
              <div className="pl-2"><strong>Account Number:</strong> {formData.accountNumber}</div>
              <div className="pl-2"><strong>Account Name:</strong> {formData.accountHolderName}</div>
              <div className="pl-2"><strong>Branch:</strong> {formData.branch}</div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-900 mt-4">Contact Details</h3>
              <div className="pl-2 mt-2"><strong>Contact 1:</strong> {contactData.contact1}</div>
              <div className="pl-2"><strong>Contact 2:</strong> {contactData.contact2}</div>
              <div className="pl-2"><strong>Email:</strong> {contactData.email}</div>
            </div>

            <div className="w-full flex justify-center">
              <button onClick={handleEdit} className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg">Done</button>
            </div>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Bank Details</h3>

              {[
                { label: 'Bank Name', name: 'bankName' },
                { label: 'Account Number', name: 'accountNumber' },
                { label: 'Account Name', name: 'accountHolderName' },
                { label: 'Branch', name: 'branch' },
              ].map((f) => (
                <div key={f.name} className="mt-2">
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    value={formData[f.name] || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4 mt-6">Contact Details</h3>

              {[
                { label: 'Contact Number 1', name: 'contact1' },
                { label: 'Contact Number 2', name: 'contact2' },
                { label: 'Email', name: 'email' },
              ].map((f) => (
                <div key={f.name} className="mt-2">
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    value={contactData[f.name]||""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <button type="button" onClick={handleSave} className="w-full bg-[#2A8ACE] text-white py-2 rounded">Save</button>
            </div>


          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
