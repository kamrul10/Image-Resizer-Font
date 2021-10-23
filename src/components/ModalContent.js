import { Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import "styled-components/macro";
import { uploadImageCore } from "../request";

export default function ModalContent({ image, blob, closeModal, resizeImage }) {
  return (
    <Formik
      initialValues={{
        image: image,
        config: [{ height: "", width: "", Public: false }],
      }}
      validate={(values) => {
        const errors = {};

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        const reqbody = {
          image: image,
          config: values.config,
        };
        const modify = values.config.map((item) => {
          return {
            height: item.height,
            width: item.width,
            public: item.Public ? "yes" : "no",
          };
        });

        const res = await uploadImageCore(blob, modify);
        resizeImage(reqbody);
        closeModal();
        setSubmitting(false);
      }}
    >
      {(formikBag) => {
        return (
          <Form>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
              css={`
                padding: 4px;
              `}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  background: "#f7fafc",
                }}
              >
                <img
                  key={image}
                  alt={image}
                  src={image}
                  style={{
                    border: "1px dashed",
                    padding: "8px",
                    height: "200px",
                    marginLeft: "10px",
                  }}
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <FieldArray
                  name="config"
                  render={(arrayHelpers) =>
                    formikBag.values.config.map((item, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            marginTop: "20px",
                            display: "flex",
                            paddingLeft: "20px",
                          }}
                        >
                          <div>
                            <label>
                              <span>Height</span>
                              <Field
                                className="form-input"
                                name={`config.${index}.height`}
                                placeholder=""
                                type="number"
                                style={{ padding: "4px" }}
                              />
                            </label>
                          </div>

                          <div className="ml-2">
                            <label>
                              <span className="block w-full text-gray-600 font-medium">
                                Width
                              </span>
                              <Field
                                className="form-input"
                                name={`config.${index}.width`}
                                placeholder=""
                                type="number"
                                style={{ padding: "4px" }}
                              />
                            </label>
                          </div>
                          <lavel>
                            {" "}
                            <Field
                              type="checkbox"
                              className="form-checkbox"
                              checked={Boolean(item.Public)}
                              name={`config.${index}.Public`}
                            />
                            <span class="" style={{ marginRight: "10px" }}>
                              Public
                            </span>
                          </lavel>

                          {formikBag.values.config.length - 1 === index ? (
                            <button
                              onClick={() =>
                                arrayHelpers.insert(index + 1, {
                                  height: "",
                                  width: "",
                                  Public: false,
                                })
                              }
                              type="button"
                            >
                              <FiPlus size={20} className="mx-4" />
                            </button>
                          ) : (
                            formikBag.values.config.length - 1 !== index && (
                              <button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <AiOutlineClose size={20} className="mx-4" />
                              </button>
                            )
                          )}
                        </div>
                      );
                    })
                  }
                />
              </div>
              {formikBag.isSubmitting ? (
                <div style={{ padding: "6px", textAlign: "end" }}>
                  <button
                    css={`
                      width: 200px;
                      padding: 12px 48px;
                      text-align: center;
                      color: white;
                      background: black;
                      border: solid 2px white;
                      z-index: 1;
                    `}
                  >
                    <i
                      css={`
                        margin-left: -12px;
                        margin-right: 8px;
                      `}
                      class="fa-spinner fa-spin"
                    ></i>
                    Loading
                  </button>
                </div>
              ) : (
                <div style={{ padding: "6px", textAlign: "end" }}>
                  <button
                    css={`
                      width: 200px;
                      padding: 12px 48px;
                      text-align: center;
                      color: white;
                      background: black;
                      border: solid 2px white;
                      z-index: 1;
                    `}
                    disabled={formikBag.isSubmitting}
                    type="submit"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
