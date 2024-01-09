import React, { useRef } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Button } from "@windmill/react-ui";

import { Input, HelperText, Label, Textarea } from "@windmill/react-ui";
import SectionTitle from "../components/Typography/SectionTitle";
import { useGlobalContext } from "../context/GlobalContext";
import { useState } from "react";
import { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
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
  // aboutCaption: "",
  aboutImage: "",
  aboutTitle: "",
  aboutBg: "",
  address: "",
  email: "",
  featuredCauseTitle: "",
  featuredCauseLocation: "",
  featuredCauseImg: "",
  featuredCauseDate: "",
  featuredCauseCaption: "",
  // heroCaption: "",
  heroTitle: "",
  heroTitleII: "",
  heroBg: "",
  twitterLink: "",
  instagramLink: "",
  linkedInLink: "",
  phoneNumber: "",
  posterbg: "",
  posterQuote: "",
  posterCaption: "",
  posterImgI: "",
  posterImgII: "",

  serviceITitle: "",
  serviceIImage: "",
  serviceIIIImageHover: "",
  serviceIIImageHover: "",
  serviceIImageHover: "",
  serviceICaption: "",
  serviceIITitle: "",
  serviceIICaption: "",
  serviceIIImage: "",
  serviceIIITitle: "",
  serviceIIICaption: "",
  serviceIIIImage: "",
};

const HomePageContents = () => {
  // get data from context
  const {
    notification,
    setnotification,
    loading,
    setloading,
    homePageContent,
    getPageContentDetail,
  } = useGlobalContext();

  const heroCaptionEditor = useRef(null);
  const aboutCaptionEditor = useRef(null);
  const quoteCaptionEditor = useRef(null);

  // form state
  const [form, setform] = useState(initialState);

  //update form

  useEffect(() => {
    if (homePageContent) {
      setform(homePageContent);
    }
  }, [homePageContent]);

  // file upload state
  const [files, setFiles] = useState([]);

  // file upload progress state
  const [progress, setprogress] = useState(null);

  const {
    aboutCaption,
    aboutImage,
    aboutTitle,
    address,
    email,
    featuredCauseTitle,
    featuredCauseLocation,
    featuredCauseImg,
    featuredCauseDate,
    featuredCauseCaption,
    heroCaption,
    heroTitle,
    heroTitleII,
    twitterLink,
    instagramLink,
    linkedInLink,
    phoneNumber,
    quoteTxt,
    quoteImage,
    posterQuote,
    posterCaption,
    posterImgI,
    posterImgII,

    serviceITitle,
    serviceIIIImageHover,
    serviceIIImageHover,
    serviceIImageHover,
    serviceIImage,
    serviceICaption,
    serviceIITitle,
    serviceIICaption,
    serviceIIImage,
    serviceIIITitle,
    serviceIIICaption,
    serviceIIIImage,
    aboutBg,
    heroBg,
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
      // aboutImage &&
      aboutTitle &&
      address &&
      email &&
      featuredCauseTitle &&
      featuredCauseLocation &&
      // featuredCauseImg &&
      featuredCauseDate &&
      featuredCauseCaption &&
      heroCaptionEditor.current.getContent().length > 1 &&
      heroTitle &&
      twitterLink &&
      instagramLink &&
      linkedInLink &&
      phoneNumber &&
      quoteCaptionEditor.current.getContent().length > 1 &&
      // quoteImage &&
      posterQuote &&
      posterCaption &&
      // posterImgI &&
      // posterImgII &&

      serviceITitle &&
      // serviceIImage &&
      serviceICaption &&
      serviceIITitle &&
      serviceIICaption &&
      // serviceIIImage &&
      serviceIIITitle &&
      serviceIIICaption
      // serviceIIIImage &&
      // aboutBg &&
      // heroBg &&
      // posterbg
    ) {
      setloading(true);

      const heroCaptionEditorTxt = heroCaptionEditor.current.getContent();

      const aboutCaptionEditorTxt = aboutCaptionEditor.current.getContent();

      const quoteCaptionEditorTxt = quoteCaptionEditor.current.getContent();

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

          heroBg:
            uploadedFiles.find((file) => file.name === "heroBg")?.url ||
            form.heroBg,
          aboutBg:
            uploadedFiles.find((file) => file.name === "aboutBg")?.url ||
            form.aboutBg,
          aboutImage:
            uploadedFiles.find((file) => file.name === "aboutImage")?.url ||
            form.aboutImage,
          posterImgI:
            uploadedFiles.find((file) => file.name === "posterImgI")?.url ||
            form.posterImgI,
          posterImgII:
            uploadedFiles.find((file) => file.name === "posterImgII")?.url ||
            form.posterImgII,
          quoteImage:
            uploadedFiles.find((file) => file.name === "quoteImage")?.url ||
            form.quoteImage,
          featuredCauseImg:
            uploadedFiles.find((file) => file.name === "featuredCauseImg")
              ?.url || form.featuredCauseImg,
          serviceIImage:
            uploadedFiles.find((file) => file.name === "serviceIImage")?.url ||
            form.serviceIImage,
          serviceIImageHover:
            uploadedFiles.find((file) => file.name === "serviceIImageHover")
              ?.url || form.serviceIImageHover,
          serviceIIImage:
            uploadedFiles.find((file) => file.name === "serviceIIImage")?.url ||
            form.serviceIIImage,
          serviceIIImageHover:
            uploadedFiles.find((file) => file.name === "serviceIIImageHover")
              ?.url || form.serviceIIImageHover,
          serviceIIIImage:
            uploadedFiles.find((file) => file.name === "serviceIIIImage")
              ?.url || form.serviceIIIImage,
          serviceIIIImageHover:
            uploadedFiles.find((file) => file.name === "serviceIIIImageHover")
              ?.url || form.serviceIIIImageHover,
        };

        // Update the document in Firestore
        const collectionRef = collection(db, "contents");
        const docRef = doc(collectionRef, "hompage");
        await updateDoc(docRef, {
          ...updatedForm,
          heroCaption: heroCaptionEditorTxt,
          aboutCaption: aboutCaptionEditorTxt,
          quoteTxt: quoteCaptionEditorTxt,
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
      <PageTitle>HomePage Contents</PageTitle>

      <SectionTitle>Hero Section</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Hero Title</span>
          <Input
            className="mt-1"
            name="heroTitle"
            value={heroTitle}
            onChange={handleChange}
            placeholder="Empowering Lives"
          />
        </Label>
        <Label className="mt-5">
          <span>Hero Title II</span>
          <Input
            className="mt-1"
            name="heroTitleII"
            value={heroTitleII}
            onChange={handleChange}
            placeholder="Eradicating Poverty"
          />
        </Label>

        <Label className="mt-5">
          <span>Hero Caption</span>

          <TextEditor
            current={heroCaptionEditor}
            initialValue={heroCaption}
            height={250}
          />
        </Label>

        <div className="flex flex-col gap-5 mt-5">
          {heroBg && (
            <>
              <span className="text-white mb-1 text-xs">
                Hero Section Background Image
              </span>
              <div className=" mb-5 rounded-lg">
                <img
                  className="rounded-lg object-cover   h-16"
                  src={heroBg}
                  alt="cover"
                />
              </div>
            </>
          )}
          <Label>
            <span>Hero Section Background Image</span>
            <Input
              type="file"
              name="heroBg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>

      <SectionTitle>Services</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label className="mt-5">
          <span>Service Type I</span>
          <Input
            className="mt-1"
            name="serviceITitle"
            value={serviceITitle}
            onChange={handleChange}
            placeholder="Become a Volunteer"
          />
        </Label>

        <Label className="mt-5">
          <span>Type I Description</span>
          <Textarea
            className="mt-1"
            rows="5"
            name="serviceICaption"
            value={serviceICaption}
            onChange={handleChange}
            placeholder="Enter some content."
          />
        </Label>

        <div className="flex flex-col gap-5 mt-5">
          <div className="flex gap-10 ">
            {serviceIImage && (
              <div>
                <span className="text-white mb-2 text-xs">Type I Svg</span>
                <div className=" mb-5 rounded-lg">
                  <img
                    className="rounded-lg object-cover   h-16"
                    src={serviceIImage}
                    alt="cover"
                  />
                </div>
              </div>
            )}
            {serviceIImageHover && (
              <div>
                <span className="text-white mb-1 text-xs">
                  Type I Svg (Hover)
                </span>
                <div className=" mb-5 rounded-lg">
                  <img
                    className="rounded-lg object-cover   h-16"
                    src={serviceIImageHover}
                    alt="cover"
                  />
                </div>
              </div>
            )}
          </div>

          <Label className="">
            <span>Type I Svg</span>
            <Input
              type="file"
              name="serviceIImage"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
          <Label className="mt-2">
            <span>Type I Svg(Hover)</span>
            <Input
              type="file"
              name="serviceIImageHover"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>

        <Label className="mt-8">
          <span>Service Type II</span>
          <Input
            className="mt-1"
            name="serviceIITitle"
            value={serviceIITitle}
            onChange={handleChange}
            placeholder="Start Donating"
          />
        </Label>

        <Label className="mt-5">
          <span>Type II Description</span>
          <Textarea
            className="mt-1"
            rows="5"
            name="serviceIICaption"
            value={serviceIICaption}
            onChange={handleChange}
            placeholder="Enter some content."
          />
        </Label>

        <div className="flex flex-col gap-5 mt-5">
          <div className="flex gap-10 ">
            {serviceIIImage && (
              <div>
                <span className="text-white mb-1 text-xs">Type II Svg</span>
                <div className=" mb-1 rounded-lg">
                  <img
                    className="rounded-lg object-cover   h-16"
                    src={serviceIIImage}
                    alt="cover"
                  />
                </div>
              </div>
            )}
            {serviceIIImageHover && (
              <div>
                <span className="text-white mb-1 text-xs">
                  Type II Svg (Hover)
                </span>
                <div className=" mb-5 rounded-lg">
                  <img
                    className="rounded-lg object-cover   h-16"
                    src={serviceIIImageHover}
                    alt="cover"
                  />
                </div>
              </div>
            )}
          </div>

          <Label className="">
            <span>Type II Svg</span>
            <Input
              type="file"
              name="serviceIIImage"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>

          <Label className="mt-2">
            <span>Type II Svg(Hover)</span>
            <Input
              type="file"
              name="serviceIIImageHover"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
        <Label className="mt-8">
          <span>Service Type III</span>
          <Input
            className="mt-1"
            name="serviceIIITitle"
            value={serviceIIITitle}
            onChange={handleChange}
            placeholder="Join Our Community"
          />
        </Label>

        <Label className="mt-5">
          <span>Type III Description</span>
          <Textarea
            className="mt-1"
            rows="5"
            name="serviceIIICaption"
            value={serviceIIICaption}
            onChange={handleChange}
            placeholder="Enter some content."
          />
        </Label>

        <div className="flex flex-col gap-5 mt-5">
          <div className="flex gap-10 ">
            {serviceIIIImage && (
              <div>
                <span className="text-white my-4 text-xs">Type III Svg</span>
                <div className=" mb-1 rounded-lg">
                  <img
                    className="rounded-lg object-cover   h-16"
                    src={serviceIIIImage}
                    alt="cover"
                  />
                </div>
              </div>
            )}
            {serviceIIIImageHover && (
              <div>
                <span className="text-white mb-1 text-xs">
                  Type III Svg (Hover)
                </span>
                <div className=" mb-5 rounded-lg">
                  <img
                    className="rounded-lg object-cover   h-16"
                    src={serviceIIIImageHover}
                    alt="cover"
                  />
                </div>
              </div>
            )}
          </div>
          <Label className="">
            <span>Type III Svg</span>
            <Input
              type="file"
              name="serviceIIIImage"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
          <Label className="mt-2">
            <span>Type IIISvg(Hover)</span>
            <Input
              type="file"
              name="serviceIIIImageHover"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>

      <SectionTitle>About</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>About Title</span>
          <Input
            className="mt-1"
            name="aboutTitle"
            value={aboutTitle}
            onChange={handleChange}
            placeholder="Barbie - The Movie"
          />
        </Label>

        <Label className="mt-5">
          <span>Description</span>
          <TextEditor
            current={aboutCaptionEditor}
            initialValue={aboutCaption}
            // height={250}
          />
        </Label>

        <div className="flex flex-col gap-5 mt-5">
          {aboutImage && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={aboutImage}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>About Image</span>
            <Input
              type="file"
              name="aboutImage"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
        <div className="flex flex-col gap-5 mt-5">
          {aboutBg && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={aboutBg}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>About Background Image</span>
            <Input
              type="file"
              name="aboutBg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>

      <SectionTitle>Featured Cause</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Featured Cause Title</span>
          <Input
            className="mt-1"
            name="featuredCauseTitle"
            value={featuredCauseTitle}
            onChange={handleChange}
            placeholder="Become a Volunteer"
          />
        </Label>

        <div className="grid lg:grid-cols-2 gap-8">
          <Label className="mt-4">
            <span>Featured Cause Date</span>
            <Input
              type="text"
              name="featuredCauseDate"
              value={featuredCauseDate}
              onChange={handleChange}
              className="mt-1"
              placeholder="Aug 10, 2023"
            />
          </Label>
          <Label className="mt-4">
            <span>Featured Cause Location</span>
            <Input
              type="text"
              name="featuredCauseLocation"
              value={featuredCauseLocation}
              onChange={handleChange}
              className="mt-1"
              placeholder="Malete, Ilorin"
            />
          </Label>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {featuredCauseImg && (
            <>
              <span className="text-white my-4 text-xs">
                Featured Cause Img
              </span>
              <div className=" mb-1 rounded-lg">
                <img
                  className="rounded-lg object-cover   h-16"
                  src={featuredCauseImg}
                  alt="cover"
                />
              </div>
            </>
          )}

          <Label className="">
            <span>Featured Cause Image</span>
            <Input
              type="file"
              name="featuredCauseImg"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>

        <Label className="mt-4">
          <span>Featured Cause Description</span>
          <Textarea
            className="mt-1"
            rows="5"
            name="featuredCauseCaption"
            value={featuredCauseCaption}
            onChange={handleChange}
            placeholder="Enter some content."
          />
        </Label>
      </div>

      <SectionTitle>Quote</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Quote Text</span>
          <TextEditor
            current={quoteCaptionEditor}
            initialValue={quoteTxt}
            height={250}
          />
          {/* <Input
            className="mt-1"
            name="quoteTxt"
            value={quoteTxt}
            onChange={handleChange}
            placeholder="Quotes"
          /> */}
        </Label>

        <div className="flex flex-col gap-4 mt-4">
          {quoteImage && (
            <>
              <span className="text-white my-4 text-xs">Quote Img</span>
              <div className=" mb-1 rounded-lg">
                <img
                  className="rounded-lg object-cover   h-16"
                  src={quoteImage}
                  alt="cover"
                />
              </div>
            </>
          )}

          <Label className="">
            <span>Quote Background Image</span>
            <Input
              type="file"
              name="quoteImage"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>
      <SectionTitle>Join Us</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Join Us Title</span>
          <Input
            className="mt-1"
            name="posterQuote"
            value={posterQuote}
            onChange={handleChange}
            placeholder="Quotes"
          />
        </Label>
        <Label className="mt-5">
          <span>Join Us Description</span>
          <Textarea
            className="mt-1"
            rows="5"
            name="posterCaption"
            value={posterCaption}
            onChange={handleChange}
            placeholder="Enter some content."
          />
        </Label>

        <div className="flex flex-col gap-4 mt-4">
          {posterImgI && (
            <>
              <span className="text-white my-4 text-xs">Join Us Img I</span>
              <div className=" mb-1 rounded-lg">
                <img
                  className="rounded-lg object-cover   h-16"
                  src={posterImgI}
                  alt="cover"
                />
              </div>
            </>
          )}

          <Label className="">
            <span>Join Us Img I</span>
            <Input
              type="file"
              name="posterImgI"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {posterImgII && (
            <>
              <span className="text-white my-4 text-xs">Join Us Img II</span>
              <div className=" mb-1 rounded-lg">
                <img
                  className="rounded-lg object-cover   h-16"
                  src={posterImgII}
                  alt="cover"
                />
              </div>
            </>
          )}

          <Label className="">
            <span>Join Us Img II</span>
            <Input
              type="file"
              name="posterImgII"
              onChange={handleChangeFiles}
              className="mt-1"
            />
          </Label>
        </div>
      </div>

      <SectionTitle>Contact</SectionTitle>
      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Address</span>
          <Input
            type="text"
            name="address"
            value={address}
            onChange={handleChange}
            className="mt-1"
            placeholder="11, Malete Street"
          />
        </Label>
        <Label className="mt-5">
          <span>Email</span>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="mt-1"
            placeholder="jafoundation@gmail.com"
          />
        </Label>
        <Label className="mt-5">
          <span>Phone</span>
          <Input
            type="number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
            className="mt-1"
            placeholder="+1 80 9000 8999"
          />
        </Label>

        <div className="flex md:flex-row flex-col gap-5">
          <Label className="mt-5 flex-1">
            <span>Twitter Link</span>
            <Input
              className="mt-1 "
              name="twitterLink"
              value={twitterLink}
              onChange={handleChange}
              rows="5"
              placeholder="Add your Link"
            />
          </Label>

          <Label className="mt-5 flex-1">
            <span>Instagram Link</span>
            <Input
              className="mt-1 "
              name="instagramLink"
              value={instagramLink}
              onChange={handleChange}
              rows="5"
              placeholder="Add your Link "
            />
          </Label>
          <Label className="mt-5 flex-1">
            <span>LinkedIn Link</span>
            <Input
              className="mt-1 "
              name="linkedInLink"
              value={linkedInLink}
              onChange={handleChange}
              rows="5"
              placeholder="Add your Link "
            />
          </Label>
        </div>
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

export default HomePageContents;
