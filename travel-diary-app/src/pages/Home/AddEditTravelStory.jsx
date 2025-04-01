import React, { useState } from "react";
import { MdClose, MdAdd, MdUpdate, MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadImage from "../../utils/uploadImage";

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
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [description, setDescription] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );

  const [error, setError] = useState("");

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story: description,
        isFavourite: false,
        imageUrl: imageUrl,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        visitedLocation,
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error adding travel story:", error);
      toast.error(error.response?.data?.message || "Failed to add story.");
    }
  };

  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = storyInfo.imageUrl || ""; // Default to existing image URL
      const postData = {
        title,
        story: description,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : storyInfo.visitedDate,
      };

      if (storyImg && typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
        postData.imageUrl = imageUrl; // Correctly update image URL in postData
      }

      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update the story.");
    }
  };

  const handleAddorUpdateClick = () => {
    console.log("Input:", {
      title,
      description,
      visitedDate,
      storyImg,
      visitedLocation,
    });
    const newStory = {
      title,
      description,
      visitedDate,
      storyImg,
      visitedLocation,
    };

    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!description) {
      setError("Please enter the description");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
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

  const handleDeleteStoryImg = async () => {
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });
    if (deleteImgRes.data) {
      const storyId = storyInfo._id;
      const postData = {
        title,
        story: description,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };
      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );
      setStoryImg(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
          <div className="flex items-center gap-2">
            {type === "add" ? (
              <button
                className="flex items-center gap-1 px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                onClick={handleAddorUpdateClick}
              >
                <MdAdd className="text-lg" /> <span>ADD</span>
              </button>
            ) : (
              <>
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
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

            <button
              className="text-slate-400 hover:text-black"
              onClick={onClose}
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
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

      <div className="pt-3">
        <label className="input-label">VISITED LOCATIONS</label>
        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
      </div>
    </div>
  );
};

export default AddEditTravelStory;
