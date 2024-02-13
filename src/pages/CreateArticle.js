import React, { useEffect, useRef, useState } from "react";
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
import TextEditor from "../components/TextEditor";

const CreateArticle = () => {
  // get data from context
  const { notification, setnotification, loading, setloading } =
    useGlobalContext();

  const { id } = useParams();

  // form  initial state
  const initialState = {
    title: "",
    date: "",
    mainImg: "",
    secondImg: "",
    thirdImg: "",
    fourthImg: "",
    fifthImg: "",
    paragraphOne: "",
    paragraphTwo: "",
  };

  const paragraphOneEditor = useRef(null);
  const paragraphTwoEditor = useRef(null);

  // form state
  const [form, setform] = useState(initialState);

  // get document info if ID is present
  useEffect(() => {
    const getPageContentDetail = async () => {
      setloading(true);
      const data = await fetchFirestoreData("articles", id);
      if (data) {
        setform(data);
      }
      setloading(false);
    };

    getPageContentDetail();
  }, [id, setloading]);

  // file upload state

  const [files, setFiles] = useState([]);

  // file upload progress state
  const [progress, setprogress] = useState(null);

  const [dateId, setdateId] = useState("");

  // to set timeId
  useEffect(() => {
    const dateId = new Date().getTime();
    setdateId(dateId);
  }, []);

  const {
    title,
    mainImg,
    paragraphOne,
    paragraphTwo,
    secondImg,
    date,
    thirdImg,
    fourthImg,
    fifthImg,
  } = form;

  // handle change text
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  // handle change image files
  const handleChangeFiles = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, { name, file: files[0] }]);
    }
  };

  // handle submit
  const handleSubmit = async () => {
    if (title && paragraphOneEditor.current.getContent().length > 1 && date) {
      setloading(true);
      const paragraphOneEditorTxt = paragraphOneEditor.current.getContent();

      const paragraphTwoEditorTxt = paragraphTwoEditor.current.getContent();

      try {
        // Upload each file in the files array to Firebase Storage
        const uploadedFiles = await Promise.all(
          files.map(async (fileObj) => {
            const storageRef = ref(
              storage,
              `article/${dateId}${title}${fileObj.name}`
            );
            const uploadTask = uploadBytesResumable(storageRef, fileObj.file);

            // Get the upload progress (optional)
            uploadTask.on("state_changed", (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setprogress(progress);
            });
            setnotification(`Upload is ${progress}% done`);

            // Wait for the upload to complete and get the download URL
            await uploadTask;
            const downloadURL = await getDownloadURL(storageRef);
            return { name: fileObj.name, url: downloadURL };
          })
        );

        const updatedForm = {
          ...form,
          // Only update image URLs if new images are uploaded, otherwise, keep the existing URLs

          mainImg:
            uploadedFiles.find((file) => file.name === "mainImg")?.url ||
            form.mainImg,
          secondImg:
            uploadedFiles.find((file) => file.name === "secondImg")?.url ||
            form.secondImg,
          thirdImg:
            uploadedFiles.find((file) => file.name === "thirdImg")?.url ||
            form.thirdImg,
          fourthImg:
            uploadedFiles.find((file) => file.name === "fourthImg")?.url ||
            form.fourthImg,
          fifthImg:
            uploadedFiles.find((file) => file.name === "fifthImg")?.url ||
            form.fifthImg,
        };

        await addDoc(collection(db, "articles"), {
          ...updatedForm,
          paragraphOne: paragraphOneEditorTxt,
          paragraphTwo: paragraphTwoEditorTxt,
          dateId,
          createdAt: serverTimestamp(),
        });
        setnotification("Article Successfully Added");
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
    if (
      title &&
      mainImg &&
      paragraphOneEditor.current.getContent().length > 1 &&
      date &&
      secondImg
    ) {
      setloading(true);

      try {
        // Update the document in Firestore
        const collectionRef = collection(db, "articles");
        const docRef = doc(collectionRef, id);
        await updateDoc(docRef, {
          ...form,
          updatedAt: serverTimestamp(),
        });

        setnotification("Article Successfully Updated");

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
        <PageTitle>{id ? "Edit Article" : "Create Article"}</PageTitle>

        <NavLink to="/app/articles">
          <Button>See Articles</Button>
        </NavLink>
      </div>

      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Article Title</span>
          <Input
            className="mt-1"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Title"
          />
        </Label>
        <div className="flex flex-col  mt-5">
          {mainImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={mainImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Cover Image</span>
            <Input
              type="file"
              name="mainImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
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

        <Label className="mt-5">
          <span>Paragraph One Description</span>
          <TextEditor
            initialValue={paragraphOne}
            current={paragraphOneEditor}
          />
          {/* <Textarea
            className="mt-1"
            rows="11"
            name="paragraphOne"
            value={paragraphOne}
            onChange={handleChange}
            placeholder="Enter some content."
          /> */}
        </Label>

        <div className="flex flex-col  mt-5">
          {secondImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={secondImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Cover Second Image</span>
            <Input
              type="file"
              name="secondImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>

        <Label className="mt-5">
          <span>Paragraph Two Description</span>
          <TextEditor
            initialValue={paragraphTwo}
            current={paragraphTwoEditor}
          />
          {/* <Textarea
            className="mt-1"
            rows="11"
            name="paragraphTwo"
            value={paragraphTwo}
            onChange={handleChange}
            placeholder="Enter some content."
          /> */}
        </Label>

        <div className="flex flex-col  mt-5">
          {thirdImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={thirdImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Cover Third Image</span>
            <Input
              type="file"
              name="thirdImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>

        <div className="flex flex-col  mt-5">
          {fourthImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={fourthImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Cover Fourth Image</span>
            <Input
              type="file"
              name="fourthImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>

        <div className="flex flex-col  mt-5">
          {fifthImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={fifthImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Cover Fifth Image</span>
            <Input
              type="file"
              name="fifthImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>

        <div className="mt-5">
          <Button disabled={loading} onClick={id ? handleUpdate : handleSubmit}>
            {loading ? <div class="lds-dual-ring"></div> : "Submit"}
          </Button>
        </div>
        <div className="py-3 h-5">
          <HelperText valid={false}>{notification}</HelperText>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
