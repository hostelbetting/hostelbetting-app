import React, { useContext, useEffect, useState } from 'react'
import { PopInput } from '../../components/inputs/PopInput'
import cameraIcon from "../../assets/svg/camera-icon.svg"
import { CropperPopup } from '../../components/popup-box/CropperPopup'
import { useCurrentUser } from '../../hooks/current-user'
import axios from '../../configs/axios-configs'
import { toast } from 'react-toastify'
import { LoadingSpinnerLine } from '../../components/spinners/LoadingSpinner'
import AuthContext from '../../contexts/Auth.context'
import { Link } from 'react-router-dom'
import TabNameContext from '../../contexts/TabName.context'

export const EditProfilePage = () => {
  // Set tabtitle 
  const { tabName, setTabName } = useContext(TabNameContext);
  useEffect(() => {
    setTabName("Edit profile");
    document.title = "Edit profile"
  }, [])

  // handle image input
  const [croperOpenState, setCropperOpenState] = useState(false);
  const [imgInput, setImgInput] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(require("../../assets/img/profile-logo.png"));
  const imgInputHandler = (e) => {
    const file = e.target.files[0];
    if (file && file?.size <= 5242880) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgInput(reader.result);
        setCropperOpenState(true);
      };
      reader.readAsDataURL(file);
    } else {
      toast.warn("Image size must be less than 5mn")
    }
  }

  const handleCrop = (file) => {
    setCroppedFile(file);
    setImgPreview(URL.createObjectURL(file));
  }

  // handle userName input
  const [userName, setUserName] = useState("");

  // handle password input
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });

  // handle api 
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    setUserName(currentUser?.userName);
    currentUser?.avatar && setImgPreview(currentUser?.avatar);
  }, [currentUser]);

  // handle user update
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    // update user name
    if (userName?.length > 1 && userName !== currentUser?.userName) {
      try {
        await axios.patch("/user/update-user", { userName: userName })
      } catch (error) {
        toast.error("User name update failed");
      }
    }
    // update avatar
    if (croppedFile && croppedFile instanceof File) {
      try {
        const formData = new FormData();
        formData.append("avatar", croppedFile);
        await axios.patch('/user/update-avatar', formData, {
          headers: {
            "Content-Type": "application/form-data"
          }
        }).then(() => toast.success("Profile updated"))
      } catch (error) {
        toast.error("Failed to update profile")
      }
    }

    // update passsword
    if (password.oldPassword && password.newPassword) {
      try {
        const data = {
          currentPassword: password?.oldPassword,
          newPassword: password?.newPassword
        }
        await axios.patch("/user/update-password", data)
          .then(() => {
            toast.success("Password updated")
          })
      } catch (error) {
        if (error?.response.status === 402) toast.error("Incorrect password");
      }
    }
    setLoading(false);
  }


  return (
    <div className='container hb-edit-profile-container'>
      <div className='mb-4'>
        <div className='mb-4 hb-display__inline-flex'>
          <div className='hb-edit-profile-img-edit-box '>
            <img src={imgPreview} alt="" />
          </div>
          <div>
            <label htmlFor="profile-image-uploader" className=' c-pointer'>
              <img src={cameraIcon} alt="" width={30} />
            </label>
            <input type="file" name="" id="profile-image-uploader" className='d-none' multiple={false} accept='image/*' onChange={imgInputHandler} />
          </div>
        </div>
        <div className='mb-3'><PopInput type="text" placeholder='User name' onChange={e => setUserName(e)} value={userName} /></div>
      </div>
      <div className='mb-4'>
        <h6>Change Password</h6>
        <div className='mb-2'>
          <PopInput type="password" placeholder='Old Password' onChange={e => setPassword({ ...password, oldPassword: e })} />
        </div>
        <div className='mb-2'>
          <PopInput type="password" placeholder='New Password' onChange={e => setPassword({ ...password, newPassword: e })} />
        </div>
        <div><span>Forget password? </span><Link to="/auth/reset-password" className='hb-url-colored'><span>Reset password</span><span><i className="ri-arrow-right-wide-line"></i></span></Link></div>
      </div>
      <div className='mb-4'>
        <button className='hb-btn hb-btn-primary__grad' onClick={handleSave} disabled={loading}>{loading && <LoadingSpinnerLine />}<span>Save changes</span></button>
      </div>
      <CropperPopup openState={croperOpenState} onClose={() => setCropperOpenState(false)} imgSrc={imgInput} onCrop={handleCrop} />
    </div>
  )
}
