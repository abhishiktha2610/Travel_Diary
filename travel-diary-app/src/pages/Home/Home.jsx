import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import addStory from "../../assets/react.svg";
import { DayPicker } from "react-day-picker";
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ form: null, to: null });
  const [modalState, setModalState] = useState({
    openAddEditModal: { isShown: false, type: "add", data: null },
    openViewModal: { isShown: false, data: null },
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
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
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("Error fetching travel stories:", error);
    }
  };

  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.error("Error fetching travel stories:", error);
    }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const handleEdit = (data) => {
    setModalState((prevState) => ({
      ...prevState,
      openAddEditModal: { isShown: true, type: "edit", data },
    }));
  };

  const handleViewStory = (data) => {
    setModalState((prevState) => ({
      ...prevState,
      openViewModal: { isShown: true, data },
    }));
  };

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

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setModalState((prevState) => ({
          ...prevState,
          openViewModal: { isShown: false, data: null },
        }));
        getAllTravelStories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.post(`/search?query=${query}`);
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <div>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchStory={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
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
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={addStory}
                message='Start journaling your travel stories! click the "Add" button to get started!'
              />
            )}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>
      {/* Reusable Modal Component */}
      {modalState.openAddEditModal.isShown && (
        <Modal
          isOpen={modalState.openAddEditModal.isShown}
          onRequestClose={() => {
            setModalState((prevState) => ({
              ...prevState,
              openAddEditModal: { isShown: false, type: "add", data: null },
            }));
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(5px)",
              zIndex: 999,
            },
          }}
          appElement={document.getElementById("root")}
          className="model-box"
        >
          <AddEditTravelStory
            type={modalState.openAddEditModal.type}
            storyInfo={modalState.openAddEditModal.data}
            onClose={() => {
              setModalState((prevState) => ({
                ...prevState,
                openAddEditModal: { isShown: false, type: "add", data: null },
              }));
            }}
            getAllTravelStories={getAllTravelStories}
          />
        </Modal>
      )}
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1"></div>
          <div className="w-[320px] ml-auto">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalState.openViewModal.isShown && (
        <Modal
          isOpen={modalState.openViewModal.isShown}
          onRequestClose={() =>
            setModalState((prevState) => ({
              ...prevState,
              openViewModal: { isShown: false, data: null },
            }))
          }
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(5px)",
              zIndex: 999,
            },
          }}
          appElement={document.getElementById("root")}
          className="model-box"
        >
          <ViewTravelStory
            type={modalState.openViewModal.type}
            storyInfo={modalState.openViewModal.data || null}
            onClose={() => {
              setModalState((prevState) => ({
                ...prevState,
                openViewModal: { isShown: false },
              }));
            }}
            onUpdateClick={() => {
              setModalState((prevState) => ({
                ...prevState,
                openViewModal: { isShown: false },
              }));
              handleEdit(modalState.openViewModal.data);
            }}
            OnDeleteClick={() => {
              deleteTravelStory(modalState.openViewModal.data || null);
              setModalState((prevState) => ({
                ...prevState,
                openViewModal: { isShown: false },
              }));
            }}
          />
        </Modal>
      )}

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setModalState((prevState) => ({
            ...prevState,
            openAddEditModal: { isShown: true, type: "add", data: null },
          }));
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </div>
  );
};

export default Home;
