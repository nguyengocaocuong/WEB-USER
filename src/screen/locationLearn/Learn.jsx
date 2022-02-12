import React, { useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { getUserCourseDetail } from "../../redux/actions/userActions";
import LoadingPage from "../../component/Loading/Loading";
import Axios from 'axios'
import "./learn_css.scss";

export default function Learn() {
  const dispatch = useDispatch();
  const userCourseDetail = useSelector((state) => state.userCourseDetail);
  const { data, loading } = userCourseDetail;
  const { id } = useParams();
  console.log("hhh: ", useParams());
  useEffect(() => {
    dispatch(getUserCourseDetail(id));
  }, [dispatch, id]);

  const [link, setLink] = useState("https://www.youtube.com/embed/9gewfuTiCP4");
  const [title, setTitle] = useState("Giới thiệu");
  const [link2, setLink2] = useState(link);
  const [title2, setTitle2] = useState("Giới thiệu");

  return (
    <>
      {" "}
      {loading && <LoadingPage />}
      {data && (
        <div className="container-fluid class1">
          <div className="row">
            <div className="flexitem1 col-8">
              {" "}
              <iframe
                src={link}
                width={"100%"}
                height={"600px"}
                title="video"
              />
              <p className="title">{title}</p>
            </div>
            <div className="flexitem3 col-4">
              <Accordion>
                {data[2].map((item, index) => (
                  <Accordion.Item eventKey={index} key={index}>
                    <Accordion.Header>
                      Phần {index + 1}: {item.chap.Chap_description}
                    </Accordion.Header>

                    {item.lesson.map((lesson, index2) => (
                      <Accordion.Body key={index2}>
                        <a
                          onClick={() => {
                            setLink(lesson.Lesson_video);
                            setTitle(
                              "Bài: " +
                              (index2 + 1) +
                              ":" +
                              lesson.Lesson_header
                            );
                            setLink2(item.lesson[index2].Lesson_video);
                            console.log(JSON.parse(localStorage.getItem("userInfo")).success.token)
                            Axios.post("https://ltweb-backend.herokuapp.com/api/user/updateLearningHistory", { Lesson_ID: lesson.Lesson_ID }, {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).success.token}`,
                              },
                            }).then(res => console.log(res))
                          }}
                        >
                          Bài {index2 + 1}: {lesson.Lesson_header}
                        </a>
                      </Accordion.Body>
                    ))}
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
