import React from "react";
import moment from "moment";
import { GrMapLocation } from "react-icons/gr";
import { MdUpdate, MdDeleteOutline, MdClose } from "react-icons/md";

const ViewTravelStory = ({
  type,
  storyInfo,
  onUpdateClick,
  OnDeleteClick,
  onClose,
}) => {
  return (
    <div className="relative p-4 bg-white shadow-md rounded-lg">
      {/* Action Buttons */}
      <div className="flex justify-end">
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 text-sm font-medium text-cyan-700 bg-cyan-200 hover:bg-cyan-300 px-3 py-1.5 rounded-md transition-all duration-200"
            onClick={onUpdateClick}
          >
            <MdUpdate className="text-lg" />
            <span>Update</span>
          </button>
          <button
            className="flex items-center gap-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-all duration-200"
            onClick={OnDeleteClick}
          >
            <MdDeleteOutline className="text-lg" />
            <span>Delete</span>
          </button>
          <button
            className="flex items-center justify-center text-gray-500 hover:text-gray-800 p-2 rounded-md transition-all duration-200"
            onClick={onClose}
          >
            <MdClose className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div className="mt-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {storyInfo?.title}
        </h1>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-600">
            {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
          </span>
          <div className="flex items-center gap-2 text-sm text-cyan-700 bg-cyan-200 px-3 py-1.5 rounded-md">
            <GrMapLocation className="text-lg" />
            {storyInfo?.visitedLocation.join(", ")}
          </div>
        </div>
      </div>

      {/* Story Image */}
      {storyInfo?.imageUrl && (
        <img
          src={storyInfo.imageUrl}
          alt="Selected"
          className="w-full h-72 object-cover rounded-lg mt-4"
        />
      )}

      {/* Story Description */}
      <div className="mt-4">
        <p className="text-sm text-gray-800 leading-6 whitespace-pre-line">
          {storyInfo?.story}
        </p>
      </div>
    </div>
  );
};

export default ViewTravelStory;
