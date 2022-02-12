import React, { useState } from "react";
import LessonModal from "./LessonModal";
import { Link, useParams } from "react-router-dom";
import { Learn } from "../screen/locationLearn/Learn";

export default function LessonDetail(props) {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      {/* <button onClick={() => setModalShow(true)}></button> */}
      <Link to={`/Learn/${props.id}`}>
        Bài {props.index + 1}: {props.lesson.Lesson_header}
      </Link>
      {/* {props.lesson.Lesson_video && (
        <Learn />
        // <LessonModal
        //   show={modalShow}
        //   onHide={() => setModalShow(false)}
        //   lesson={props.lesson}
        // />
      )} */}
    </>
  );
}
