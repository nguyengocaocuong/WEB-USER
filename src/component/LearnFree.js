import React, { useState } from "react";
import LessonModal from "./LessonModal";
import { Link, useParams } from "react-router-dom";
import { Learn } from "../screen/locationLearn/Learn";

export default function LearnFree(props) {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <button onClick={() => setModalShow(true)}>
        {" "}
        Bài {props.index + 1}: {props.lesson.Lesson_header}
      </button>

      {props.lesson.Lesson_video && (
        <LessonModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          lesson={props.lesson}
        />
      )}
    </>
  );
}
