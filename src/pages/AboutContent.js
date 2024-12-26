import React, { useRef } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Button } from "@windmill/react-ui";

import { Input, HelperText, Label, Textarea } from "@windmill/react-ui";
import SectionTitle from "../components/Typography/SectionTitle";
import { useGlobalContext } from "../context/GlobalContext";
import { useState } from "react";
import { useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../utils/Firebase";
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import ThemedSuspense from "../components/ThemedSuspense";
import TextEditor from "../components/TextEditor";

// form  initial state
const initialState = {
  aboutTitle: "",

  aboutImg: "",

  posterTxt: "",

  posterVolunteerLink: "",
  founderImg: "",
  missionImg: "",
  visionImg: "",
};

const AboutPageContents = () => {
  // get data from context
  const {
    notification,
    setnotification,
    loading,
    setloading,
    aboutPageContent,
    getPageContentDetail,
  } = useGlobalContext();

  const aboutCaptionEditor = useRef(null);
  const missionCaptionEditor = useRef(null);
  const visionCaptionEditor = useRef(null);
  const founderCaptionEditor = useRef(null);

  // form state
  const [form, setform] = useState(initialState);

  //update form

  useEffect(() => {
    if (aboutPageContent) {
      setform(aboutPageContent);
    }
  }, [aboutPageContent]);

  // file upload state
  const [files, setFiles] = useState([]);

  // file upload progress state
  const [progress, setprogress] = useState(null);

  const {
    aboutCaption,
    missionCaption,
    visionCaption,
    aboutImg,
    aboutTitle,

    posterTxt,
    founderImg,
    posterVolunteerLink,

    missionImg,
    visionImg,
    founderCaption,
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
    if (
      aboutCaptionEditor.current.getContent().length > 1 &&
      missionCaptionEditor.current.getContent().length > 1 &&
      visionCaptionEditor.current.getContent().length > 1 &&
      founderCaptionEditor.current.getContent().length > 1 &&
      aboutTitle &&
      posterTxt &&
      posterVolunteerLink
    ) {
      setloading(true);

      const visionCaptionEditorTxt = visionCaptionEditor.current.getContent();
      const missionCaptionEditorTxt = missionCaptionEditor.current.getContent();
      const aboutCaptionEditorTxt = aboutCaptionEditor.current.getContent();
      const founderCaptionEditorTxt = founderCaptionEditor.current.getContent();

      try {
        // Upload each file in the files array to Firebase Storage
        const uploadedFiles = await Promise.all(
          files.map(async (fileObj) => {
            const storageRef = ref(storage, `${fileObj.name}`);
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

        // Create a copy of the form state with updated image URLs
        const updatedForm = {
          ...form,
          // Only update image URLs if new images are uploaded, otherwise, keep the existing URLs

          aboutImg:
            uploadedFiles.find((file) => file.name === "aboutImg")?.url ||
            form.aboutImg,
          visionImg:
            uploadedFiles.find((file) => file.name === "visionImg")?.url ||
            form.visionImg,
          missionImg:
            uploadedFiles.find((file) => file.name === "missionImg")?.url ||
            form.missionImg,
          founderImg:
            uploadedFiles.find((file) => file.name === "founderImg")?.url ||
            form.founderImg,
        };

        // Update the document in Firestore
        const collectionRef = collection(db, "contents");
        const docRef = doc(collectionRef, "aboutpage");
        await updateDoc(docRef, {
          ...updatedForm,
          aboutCaption: aboutCaptionEditorTxt,
          visionCaption: visionCaptionEditorTxt,
          missionCaption: missionCaptionEditorTxt,
          founderCaption: founderCaptionEditorTxt,
          updatedAt: serverTimestamp(),
        });

        setnotification("Content Successfully Updated");

        setFiles([]); // Clear the files array after successful upload
        getPageContentDetail();
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

  if (loading) {
    return <ThemedSuspense />;
  }

  return (
    <div>
      <PageTitle>About Page Contents</PageTitle>

      <SectionTitle>About</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>About Title</span>
          <Input
            className="mt-1"
            name="aboutTitle"
            value={aboutTitle}
            onChange={handleChange}
            placeholder="Title"
          />
        </Label>

        <Label className="mt-5">
          <span>Description</span>

          <TextEditor
            initialValue={aboutCaption}
            current={aboutCaptionEditor}
          />
        </Label>

        <div className="flex flex-col gap-5  mt-5">
          {aboutImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={aboutImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>About Image</span>
            <Input
              type="file"
              name="aboutImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>

      <SectionTitle>Mission Section</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Mission Caption</span>
          <TextEditor
            initialValue={missionCaption}
            current={missionCaptionEditor}
            height={450}
          />
        </Label>

        <div className="flex flex-col gap-5  mt-5">
          {missionImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={missionImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Mission Image</span>
            <Input
              type="file"
              name="missionImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>
      <SectionTitle>Vision Section</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Vision Caption</span>
          <TextEditor
            initialValue={visionCaption}
            current={visionCaptionEditor}
            height={450}
          />
        </Label>

        <div className="flex flex-col gap-5  mt-5">
          {visionImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={visionImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Vision Image</span>
            <Input
              type="file"
              name="visionImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>

      <SectionTitle>Founder Section</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Founder Caption</span>
          <TextEditor
            initialValue={founderCaption}
            current={founderCaptionEditor}
            height={450}
          />
        </Label>

        <div className="flex flex-col gap-5  mt-5">
          {founderImg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={founderImg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Founder Image</span>
            <Input
              type="file"
              name="founderImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>

      <SectionTitle>Join Us</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Poster Title</span>
          <Input
            className="mt-1"
            name="posterTxt"
            value={posterTxt}
            onChange={handleChange}
            placeholder="Quotes"
          />
        </Label>

        <Label className="mt-5">
          <span>Poster Volunteer Link</span>
          <Input
            className="mt-1"
            name="posterVolunteerLink"
            value={posterVolunteerLink}
            onChange={handleChange}
            placeholder="www.google.com"
          />
        </Label>
      </div>

      <div className="mt-5">
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? <div class="lds-dual-ring"></div> : "Submit"}
        </Button>
      </div>
      <div className="py-3 h-5">
        <HelperText valid={false}>{notification}</HelperText>
      </div>
    </div>
  );
};

export default AboutPageContents;
