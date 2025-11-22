import React, { useState } from 'react';

const Portfolio = () => {
  const [outdoorImages, setOutdoorImages] = useState([]);
  const [indoorImages, setIndoorImages] = useState([]);

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      src: URL.createObjectURL(file),
    }));
    type === 'outdoor'
      ? setOutdoorImages(prev => [...prev, ...newImages])
      : setIndoorImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id, type) => {
    if (type === 'outdoor') {
      setOutdoorImages(prev => prev.filter(image => image.id !== id));
    } else {
      setIndoorImages(prev => prev.filter(image => image.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#7895B2] p-6 font-sora">
      <h1 className="text-2xl text-white font-bold mb-6">Portfolio</h1>
      <div className="bg-[#8D8D8D] p-4 rounded-xl">
        {/* OUTDOOR */}
        <section className="bg-[#D9D9D9] rounded-xl p-6 mb-6 shadow-md">
          <h2 className="text-center text-xl font-bold text-[#6B7280] mb-4">Outdoor</h2>
          <div className="flex justify-center mb-4">
            <label className="bg-[#2A8ACE] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
              Add Image
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'outdoor')}
                className="hidden"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {outdoorImages.map(({ id, src }) => (
              <div key={id} className="relative group">
                <img
                  src={src}
                  alt="Outdoor"
                  className="w-full h-auto max-h-60 object-contain rounded-md bg-black"
                />
                <button
                  onClick={() => handleRemoveImage(id, 'outdoor')}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-80 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* INDOOR */}
        <section className="bg-[#D9D9D9] rounded-xl p-6 shadow-md">
          <h2 className="text-center text-xl font-bold text-[#6B7280] mb-4">Indoor</h2>
          <div className="flex justify-center mb-4">
            <label className="bg-[#2A8ACE] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
              Add Image
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'indoor')}
                className="hidden"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {indoorImages.map(({ id, src }) => (
              <div key={id} className="relative group">
                <img
                  src={src}
                  alt="Indoor"
                  className="w-full h-auto max-h-60 object-contain rounded-md bg-black"
                />
                <button
                  onClick={() => handleRemoveImage(id, 'indoor')}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-80 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
