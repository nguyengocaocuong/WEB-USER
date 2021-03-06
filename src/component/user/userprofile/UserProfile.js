import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./userprofile.scss";
import axios from "axios";
import {
  getUserDetail,
  updateUserProfile,
} from "../../../redux/actions/userActions";
import LoadingPage from "../../Loading/Loading";
import {
  USER_UPDATE_PROFILE_RESET,
  USER_DETAILS_RESET,
} from "../../../redux/constants/userContants";
import Table from '../../../component/table/Table'
import { getData } from "../../../utils/fecthData";
const headData = [
  "",
  "Tên Bài học",
  "Ngày học"
]

const renderHead = (item, index) => <th key={index}>{item}</th>
const renderBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.Lesson_header}</td>
    <td>{item.time}</td>
  </tr>
)
export default function UserProfile(props) {
  const [fixData, setFixData] = useState(null)
  const [data, setData] = useState([])
  const [dataUser, setDataUser] = useState({
    User_name: "",
    User_account: "",
    User_phone: "",
    User_DoB: "",
  });
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);

  const { user, loading } = userDetails;

  useEffect(() => {
    getData('user/getLearningHistory', JSON.parse(localStorage.getItem("userInfo")).success.token).then(data => {
      setFixData(data)
      setData(data.data)
    })
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(getUserDetail());
    } else {
      setDataUser({
        User_name: user.information.User_name,
        User_account: user.information.User_account,
        User_phone: user.information.User_phone,
        User_DoB: user.information.User_DoB,
      });
    }
  }, [dispatch, user]);

  const handleChangeUser = (props) => (e) => {
    setDataUser({ ...dataUser, [props]: e.target.value });
  };
  const fileInputRef = useRef();

  const handleChangeAvatar = (e) => {
    setAvatar(e.target.files[0]);
  };

  const imageUpLoad = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "uploadimage");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/drvrg0ixi/image/upload",
      formData
    );
    const data = res.data;
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let media;
    if (avatar !== "") media = await imageUpLoad(avatar);
    dispatch(
      updateUserProfile({
        User_name: dataUser.User_name,
        User_DoB: dataUser.User_DoB,
        User_image: media ? media : user.information.User_image,
      })
    );
    dispatch({ type: USER_DETAILS_RESET });
  };

  const next = () => {
    if (fixData.next_page_url === null) return
    axios.get(fixData.next_page_url, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).success.token}`,
      },
    }).then(data => {
      setFixData(data.data)
      setData(data.data.data)
      console.log(fixData)
    })
  }
  const prev = () => {
    if (fixData.prev_page_url === null) return
    axios.get(fixData.prev_page_url, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).success.token}`,
      },
    }).then(data => {
      setFixData(data.data)
      setData(data.data.data)
      console.log(fixData)
    })
  }
  return (
    <>
      {loading && <LoadingPage />}
      {user && (
        <div className="user-profile mt-5">
          <div className="row">
            <div className="col-4">
              <div className="left-information">
                <div className="change-avatar">
                  <img
                    src={
                      avatar !== ""
                        ? URL.createObjectURL(avatar)
                        : user.information.User_image
                    }
                    className="img-fluid image-avatar"
                    alt="avatar"
                  ></img>
                  <div className="text-center btn-upload-avatar">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="btn btn-info"
                    >
                      Thay đổi ảnh
                    </button>
                    <input
                      onChange={handleChangeAvatar}
                      multiple={false}
                      ref={fileInputRef}
                      type="file"
                      hidden
                    />
                  </div>
                </div>
                <div
                  className="list-group list-menu-profile"
                  id="list-tab"
                  role="tablist"
                >
                  <a
                    className="list-group-item list-group-item-action active"
                    id="list-home-list"
                    data-bs-toggle="list"
                    href="#list-home"
                    role="tab"
                    aria-controls="list-home"
                  >
                    <i className="fa fa-user" aria-hidden="true"></i>
                    Thông tin cá nhân
                  </a>
                  <a
                    className="list-group-item list-group-item-action"
                    id="list-profile-list"
                    data-bs-toggle="list"
                    href="#list-profile"
                    role="tab"
                    aria-controls="list-profile"
                  >
                    <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                    Lịch sử học tập
                  </a>

                </div>
              </div>
            </div>
            <div className="col-8">
              <div
                className="tab-content right-information"
                id="nav-tabContent"
              >
                <div
                  className="tab-pane fade show active information-details-user"
                  id="list-home"
                  role="tabpanel"
                  aria-labelledby="list-home-list"
                >
                  <h3 className="text-center text-title">Thông tin cá nhân</h3>
                  <form
                    className="form-edit-information"
                    onSubmit={handleSubmit}
                  >
                    <div className="mb-3">
                      <label className="form-label">Họ và tên</label>
                      <input
                        type="text"
                        className="form-control"
                        value={dataUser["User_name"]}
                        onChange={handleChangeUser("User_name")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        disabled
                        type="email"
                        className="form-control"
                        value={dataUser["User_account"]}
                        onChange={handleChangeUser("User_account")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        value={dataUser["User_phone"]}
                        onChange={handleChangeUser("User_phone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ngày sinh</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dataUser["User_DoB"]}
                        onChange={handleChangeUser("User_DoB")}
                      />
                    </div>
                    <div className="mt-5 btn-save-information">
                      <button type="submit" className="btn btn-success ">
                        Lưu lại
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  className="tab-pane fade"
                  id="list-profile"
                  role="tabpanel"
                  aria-labelledby="list-profile-list"
                >
                  <h4>Lịch sử học tập</h4>
                  {
                    fixData !== null ?
                      <Table
                        limit='10'
                        headeData={headData}
                        renderHead={(item, index) => renderHead(item, index)}
                        bodyData={fixData.data}
                        renderBody={(item, index) => renderBody(item, index)}
                        nextPage={() => { next() }}
                        prevPage={() => { prev() }}
                      /> : ''
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
