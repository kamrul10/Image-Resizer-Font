import React from "react";
import "styled-components/macro";
import Image from "./Image";

export default function CompressedImages({
  images,
  sizes,
  LoadingResizing,
  onFileSelected,
}) {
  return (
    <>
      {[...images.values()].map((image) => {
        return (
          <>
            {LoadingResizing.has(image.name) && LoadingResizing.get(image.name)
              ? "Resizing..."
              : ""}
            <div
              style={{
                alignItems: "center",
              }}
            >
              <p>
                <progress
                  value="0"
                  max="300"
                  style={{ paddingRight: "10px" }}
                  id={`progressBar_${image.name}`}
                ></progress>
                <span
                  style={{ marginLeft: "10px" }}
                  id={`timer_${image.name}`}
                ></span>
              </p>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                borderBottom: "1px dashed",
                paddingBottom: "10px",
                overflowX: "scroll",
              }}
            >
              <Image image={image.image} title={"Original"} Public={false} />

              {[...image.config.values()].map((items) => {
                return (
                  <>
                    <Image
                      image={items.original}
                      resized={items.resized}
                      title={items.config.width + "x" + items.config.height}
                      Public={items.config.Public}
                      name={image.name}
                    />
                  </>
                );
              })}
            </div>
          </>
        );
      })}
    </>
  );
}
