import React, { useState, useEffect, useRef } from "react";
import { MdClose, MdAdd, MdUpdate, MdDeleteOutline } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const libraries = ["places"];
console.log("Google Maps API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [storyImg, setStoryImg] = useState(storyInfo?.storyImg || null);
  const [description, setDescription] = useState(storyInfo?.description || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || ""
  );
  const [markerPosition, setMarkerPosition] = useState({
    lat: storyInfo?.visitedLocation?.lat || 40.7128, // Default to NYC
    lng: storyInfo?.visitedLocation?.lng || -74.006,
  });

  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current
      );
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setVisitedLocation(place.formatted_address);
        setMarkerPosition(location);
        if (mapRef.current) {
          mapRef.current.panTo(location);
        }
      }
    }
  };

  const handleAddorUpdateClick = async () => {
    const newStory = {
      title,
      description,
      visitedDate,
      storyImg,
      visitedLocation: {
        ...markerPosition,
        address: visitedLocation,
      },
    };

    if (type === "add") {
      console.log("Adding story:", newStory);
      // TODO: Call API to add story
    } else {
      console.log("Updating story:", newStory);
      // TODO: Call API to update story
    }

    getAllTravelStories(); // Refresh list
    onClose(); // Close modal
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      console.log("Deleting story:", storyInfo);
      // TODO: Call API to delete story
      getAllTravelStories();
      onClose();
    }
  };

  const handleDeleteStoryImg = () => {
    setStoryImg(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <button className="text-slate-400 hover:text-black" onClick={onClose}>
          <MdClose className="text-2xl" />
        </button>
      </div>

      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter story title"
        />
      </div>

      {/* Date Selector */}
      <div className="mb-4">
        <DateSelector date={visitedDate} setDate={setVisitedDate} />
      </div>

      {/* Image Selector */}
      <div className="mb-4">
        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
          handleDeleteImg={handleDeleteStoryImg}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter story description"
          rows="3"
        />
      </div>

      {/* Location Search & Map */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Visited Location
        </label>
        <input
          ref={inputRef}
          type="text"
          value={visitedLocation}
          onChange={(e) => setVisitedLocation(e.target.value)}
          placeholder="Enter a location"
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ height: "300px", width: "100%" }}
            center={markerPosition}
            zoom={13}
            onLoad={(map) => (mapRef.current = map)}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        {type === "add" ? (
          <button
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleAddorUpdateClick}
          >
            <MdAdd className="text-lg" /> <span>ADD</span>
          </button>
        ) : (
          <>
            <button
              className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleAddorUpdateClick}
            >
              <MdUpdate className="text-lg" /> <span>UPDATE</span>
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={handleDeleteClick}
            >
              <MdDeleteOutline className="text-lg" /> <span>DELETE</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddEditTravelStory;
