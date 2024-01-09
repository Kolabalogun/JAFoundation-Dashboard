import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Button } from "@windmill/react-ui";
import { NavLink } from "react-router-dom";
import { Input, HelperText, Label, Select, Textarea } from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../utils/Firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { fetchFirestoreData } from "../Hook/fetchFirestoreData";

const CreateEvent = () => {
  // get data from context
  const { notification, setnotification, loading, setloading, eventsFromDB } =
    useGlobalContext();

  const { id } = useParams();

  // form  initial state
  const initialState = {
    title: "",
    location: "",
    date: "",
    image: "",
    caption: "",
  };

  // form state
  const [form, setform] = useState(initialState);

  // get document info if ID is present
  useEffect(() => {
    const getPageContentDetail = async () => {
      setloading(true);
      const data = await fetchFirestoreData("events", id);
      if (data) {
        setform(data);
      }
      setloading(false);
    };

    getPageContentDetail();
  }, [id, setloading]);

  // file upload state
  const [file, setfile] = useState(null);

  // file upload progress state
  const [progress, setprogress] = useState(null);

  const [dateId, setdateId] = useState("");

  // to set timeId
  useEffect(() => {
    const dateId = new Date().getTime();
    setdateId(dateId);
  }, []);

  const { title, image, caption, location, date } = form;

  // file upload
  useEffect(() => {
    const uploadFile = () => {
      setloading(true);
      const storageRef = ref(storage, `event/${dateId}${title}${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.ceil(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setnotification("Upload is " + progress + "% done");

          setprogress(progress);
          switch (snapshot.state) {
            case "paused":
              setnotification("Upload is paused");
              break;
            case "running":
              // setnotification("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error(error);
          setnotification(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setnotification("Image Uploaded");
            setform((prev) => ({ ...prev, image: downloadUrl }));
          });
        }
      );
      setloading(false);
    };

    file && uploadFile();
  }, [file]);

  // handle change text
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async () => {
    if (title && image && caption && location && date) {
      setloading(true);

      try {
        await addDoc(collection(db, "events"), {
          ...form,
          dateId,
          createdAt: serverTimestamp(),
        });
        setnotification("Event Successfully Added");
        setform(initialState);
        setloading(false);
      } catch (error) {
        console.log(error);
        setnotification(error);
        setloading(false);
      }
    } else {
      return setnotification("All fields must be filled");
    }
  };

  // handle submit
  const handleUpdate = async () => {
    if (title && image && caption && location) {
      setloading(true);

      try {
        // Update the document in Firestore
        const collectionRef = collection(db, "events");
        const docRef = doc(collectionRef, id);
        await updateDoc(docRef, {
          ...form,
          updatedAt: serverTimestamp(),
        });

        setnotification("Event Successfully Updated");

        setloading(false);
      } catch (error) {
        console.log(error);
        setnotification(error);
        setloading(false);
      }
    } else {
      setnotification("All fields must be filled");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle>{id ? "Edit Event" : "Create Event"}</PageTitle>

        <NavLink to="/app/events">
          <Button>See Events</Button>
        </NavLink>
      </div>

      {eventsFromDB?.length === 3 && !id ? (
        <PageTitle>You can't create more than 3 events</PageTitle>
      ) : (
        <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
          <Label>
            <span>Event Name</span>
            <Input
              className="mt-1"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Title"
            />
          </Label>

          <Label className="mt-5">
            <span>Description</span>
            <Textarea
              className="mt-1"
              rows="11"
              name="caption"
              value={caption}
              onChange={handleChange}
              placeholder="Enter some  content."
            />
          </Label>

          <Label className="mt-5">
            <span>Location</span>
            <Input
              className="mt-1"
              name="location"
              value={location}
              onChange={handleChange}
              placeholder="Malete, Ilorin"
            />
          </Label>
          <Label className="mt-5">
            <span>Date</span>
            <Input
              className="mt-1"
              name="date"
              value={date}
              onChange={handleChange}
              placeholder="Aug 26, 2024"
            />
          </Label>

          <div className="flex flex-col  mt-5">
            {image && (
              <div className=" mb-5 rounded-lg">
                <img
                  className="rounded-lg object-cover   h-64"
                  src={image}
                  alt="cover"
                />
              </div>
            )}

            <Label className="">
              <span>Cover Image</span>
              <Input
                type="file"
                name="file"
                onChange={(e) => setfile(e.target.files[0])}
                className="mt-1"
              />
            </Label>
          </div>

          <div className="mt-5">
            <Button
              disabled={loading || (!id && progress !== 100)}
              onClick={id ? handleUpdate : handleSubmit}
            >
              {loading ? <div class="lds-dual-ring"></div> : "Submit"}
            </Button>
          </div>
          <div className="py-3 h-5">
            <HelperText valid={false}>{notification}</HelperText>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
