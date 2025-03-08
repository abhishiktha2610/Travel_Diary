import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      console.log("Stories Response:", response.data);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Error fetching user info:", error);
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      console.log("Stories Response:", response.data);
      console.log("User Info Response:", response.data);
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      } else {
        console.log("No stories found");
      }
    } catch (error) {
      console.error("Error fetching travel stories:", error);
    }
  };

  const handleEdit = (data) => {};
  const handleViewStory = (data) => {};
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    setAllStories((prevStories) =>
      prevStories.map((story) =>
        story._id === storyId
          ? { ...story, isFavourite: !story.isFavourite }
          : story
      )
    );

    try {
      const response = await axiosInstance.put(
        `/update-is-favourite/${storyId}`,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data) {
        toast.success("Story Updated Successfully");
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.");
      setAllStories((prevStories) =>
        prevStories.map((story) =>
          story._id === storyId
            ? { ...story, isFavourite: storyData.isFavourite }
            : story
        )
      );
    }
  };

  useEffect(() => {
    console.log("Component mounted, calling APIs...");
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <div>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <>Empty Card here</>
            )}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0,2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      ></Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </div>
  );
};

export default Home;
