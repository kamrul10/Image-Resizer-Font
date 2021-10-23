import React from "react";
import { BiCloudUpload } from "react-icons/bi";
import { Modal } from "./Modal";
import "styled-components/macro";
import CompressedImages from "./CompressedImages";
import ModalContent from "./ModalContent";
import { deleteImage, getImage } from "../request";


export default function UploadImage() {
  const [loadingForUploadImage, setLoadingForUploadImage] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [size, setsize] = React.useState(0);
  const [LoadingResizing, setLoadingResizing] = React.useState(new Map());
  const [selectedImage, setselectedImage] = React.useState(null);
  const [images, setImages] = React.useState(new Map());
  const [openModal, setOpenModal] = React.useState(false);
/**
 * on  file select open the resize  configuration modal
 * @param {*} event is the input file event
 */
  async function onFileSelected(event) {
    try {
      setLoadingForUploadImage(true);
      const selectedFiles = event.target.files[0];
      setselectedImage(selectedFiles);
      const reader = new FileReader();
      reader.readAsDataURL(selectedFiles);
      reader.onloadend = function () {
        setImage(reader.result);
      };

      setOpenModal(true);
      setLoadingForUploadImage(false);
    } catch (error) {
      setLoadingForUploadImage(false);
    }
  }
  /**
   * when all images are resized remove the resized images
   * modify  the  images  map along with 
   * @param {*} mapping 
   * @param {*} image 
   */
  const removeFromMap = async (mapping, image) => {
    const reqbody = {
      original_image: image,// image name that was resized previously befor 5 min ago
    };
    await deleteImage(reqbody);  //api call  for delete image
    const img = new Map(mapping);
    if (img.has(image)) {
      img.delete(image);
      setImages(img);
    }
  };
  /**
   * set time interval for 5min
   * add progress bar and timer
   * @param {*} mapping  all images
   * @param {*} image marked image
   */
  const createInterval = (mapping, image) => {
    var timeleft = 300;
    const Time = 300;
    var downloadTimer = setInterval(() => {
      if (timeleft <= 0) {
        clearInterval(downloadTimer); //remove timer
        removeFromMap(mapping, image); //remove from server
      }
      const doc = document.getElementById(`progressBar_${image}`);  //get dynamic element
      const timer = document.getElementById(`timer_${image}`); //get dynamic element
      if (doc) {
        doc.value = Time - timeleft;
      }
      if (timer) {
        const minutes = Math.floor(timeleft / 60);
        const seconds = Math.floor(timeleft - minutes * 60);
        timer.innerHTML =
          "Resize Completed, Image will be Removed after " +
          minutes +
          "m " +
          seconds +
          "s";
      }
      timeleft -= 1;
    }, 1000); 
  };
  /**
   * config wise map generate 
   * and check each config status
   * @param {*} data 
   */
  const resizeImage = async (data) => {
    const mapping = new Map(images);
    const configmap = new Map();
    data.config.map((item) => {
      const image = {
        original: data.image,
        config: item,
        resized: false,
      };
      const key = item.width + "x" + item.height;
      configmap.set(key, image);
    });
    mapping.set(selectedImage.name, {
      image: data.image,
      name: selectedImage.name,
      config: configmap,
    });

    setImages(mapping);
    getStatus(mapping, selectedImage.name);
  };
  /**
   * all images  are uploaded to server check
   * 
   * @param {*} data 
   * @param {*} allimages 
   * @param {*} image 
   * @returns 
   */
  const checkComplete = (data, allimages, image) => {
    const cuurentimage = allimages.get(image);
    let configs = cuurentimage.config;
    return Array.from(configs.keys()).every((key) => configs.get(key).resized);
  };
/**
 * 
 * @param {*} allimages 
 * @param {*} image 
 */
  const getStatus = async (allimages, image) => {
    let interval;
    try {
      interval = setInterval(async () => {
        const reqbody = {
          original_image: image,
        };
        const res = await getImage(reqbody);// get update from server
        if (res.data.data.resized_data) {
          const data = res.data.data.resized_data;
          setsize(res.data.data.file_size);//get the total global size uploaded by you
          const cuurentimage = allimages.get(image);
          let configs = cuurentimage.config;
          const mapping = new Map(allimages);
          const loadinmgap = new Map(LoadingResizing);
          loadinmgap.set(image, true);
          setLoadingResizing(loadinmgap);
          for (var key in data) {
            if (allimages.has(image)) {
              if (configs.has(key)) {
                //if found in response
                const specificConfig = configs.get(key);
                const resizedImage = data[key].url;
                const configmap = new Map(configs);
                specificConfig.original = resizedImage;
                specificConfig.resized = true;
                configmap.set(key, specificConfig);
                mapping.set(image, {
                  image: cuurentimage.image,
                  name: image,
                  size: res.data.data.file_size,
                  config: configmap,
                });
                setImages(mapping);
                //check complete
                if (checkComplete(data, mapping, image)) {
                  setImages(mapping);
                  clearInterval(interval);
                  createInterval(mapping, image);
                  const loadinmgap = new Map(LoadingResizing);
                  loadinmgap.set(image, false);
                  setLoadingResizing(loadinmgap);
                  return;
                }
              }
            }
          }
        }
      }, 5000);
    } catch (err) {
      clearInterval(interval);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {images.size > 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "start",
            borderBottom: "1px dashed",
          }}
        >
          <h3>{Number(size).toFixed(2) + "M Uploaded"}</h3>
        </div>
      ) : null}

      <div className={"upload-image"}>
        {
          loadingForUploadImage ? (
            <p>loading...</p>
          ) : images.size > 0 ? (
            <CompressedImages
              LoadingResizing={LoadingResizing}
              size={size}
              images={images}
              onFileSelected={onFileSelected}
            />
          ) : null //
        }
        <div
          style={{
            border: "1px dashed",
            padding: "8px",
            width: "300px",
            height: "300px",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "10px",
            marginTop: "10px",
            position: "relative",
          }}
        >
          <BiCloudUpload size={32} />
          {"Choose a file"}
          <input
            type="file"
            accept="image/jpg, image/png"
            name={"image"}
            className="input-file"
            style={{
              width: "100%",
              height: "300px",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              opacity: "0",
            }}
            onChange={(e) => onFileSelected(e)}
          />
        </div>
      </div>
      {openModal ? (
        <Modal
          closeModal={() => {
            setOpenModal(false);
          }}
          header={"Resize"}
          modalContentWidth="60%"
          isActive={openModal}
          renderBody={() => {
            return (
              <ModalContent
                image={image}
                blob={selectedImage}
                closeModal={() => {
                  setOpenModal(false);
                }}
                resizeImage={resizeImage}
              />
            );
          }}
        />
      ) : null}
    </div>
  );
}
