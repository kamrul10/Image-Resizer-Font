import React from "react";
import "styled-components/macro";

export default function Image({ image, name, title, resized, Public }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        key={image}
        className="container"
        css={`
          position: relative;
          margin-top: 50px;
          width: 300px;
          height: 300px;
        `}
        style={{ border: "1px dashed", marginLeft: "10px" }}
      >
        <img
          css={`
            position: absolute;
            width: 300px;
            height: 300px;
            left: 0;
            filter: ${title == "Original" || resized
              ? "blur(0rem)"
              : "blur(1.5rem)"};
          `}
          src={image}
          alt={image}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h4>{title}</h4>
        {Public ? (
          <a
            download={name}
            href={image}
            title="ImageName"
            style={{ marginLeft: "10px" }}
          >
            Download{" "}
          </a>
        ) : null}
      </div>
    </div>
  );
}
