import React, { useState } from "react";
import { MdClose, MdAdd, MdUpdate, MdDeleteOutline } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState("");
  const [visitedDate, setVisitedDate] = useState(null);
  const [storyImg, setStoryImg] = useState(null);
  const [description, setDescription] = useState("");
  const [visitedLocation, setVisitedLocation] = useState([]);

  const handleAddorUpdateClick = () => {
    const newStory = { title, description, visitedDate, storyImg };

    if (type === "add") {
      console.log("Adding story:", newStory);
      // Call API to add story
    } else {
      console.log("Updating story:", newStory);
      // Call API to update story
    }

    getAllTravelStories(); // Refresh list
    onClose(); // Close modal
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      console.log("Deleting story:", storyInfo);
      // Call API to delete story
      getAllTravelStories();
      onClose();
    }
  };
  const handleDeleteStoryImg = async () => {};

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

      <div className="mb-4">
        <DateSelector date={visitedDate} setDate={setVisitedDate} />
      </div>

      <div className="mb-4">
        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
          handleDeleteImg={handleDeleteStoryImg}
        />
      </div>

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
