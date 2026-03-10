import React, { useState, useRef } from "react";
import axios from "axios";
import "./OnboardingForm.css";

const departmentsList = [
  "People & Culture",
  "Events & Fundraising",
  "Programs & Field Team",
  "Media & Content",
  "Finance & Compliance",
  "Outreach & Partnerships",
  "Strategy & Projects",
  "Mental Wellbeing"
];

const OnboardingForm = () => {

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    age: "",
    gender: "",
    location: "",
    phone_number: "",
    profession: "",
    place_of_profession: "",
    department: [],
    volunteered_before: "",
    acknowledgement: false,
    can_attend_events: false,
    dob: ""
  });

  const [govId, setGovId] = useState(null);
  const [memberPic, setMemberPic] = useState(null);

  const govRef = useRef();
  const picRef = useRef();

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const uploadFile = async (file) => {

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "onboarding_upload");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/douy1d9kr/image/upload",
      data
    );

    return res.data.secure_url;
  };

  const toggleDepartment = (dept) => {

    let updated;

    if (formData.department.includes(dept)) {
      updated = formData.department.filter(d => d !== dept);
    } else {
      updated = [...formData.department, dept];
    }

    setFormData({
      ...formData,
      department: updated
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!govId || !memberPic) {
      alert("Please upload both files");
      return;
    }

    try {

      const govUrl = await uploadFile(govId);
      const memberUrl = await uploadFile(memberPic);

      const payload = {
        ...formData,
        government_id_picture: govUrl,
        member_picture: memberUrl
      };

      const response = await axios.post(
"https://anantya-api.onrender.com/onboard",
payload
);

      if (response.status === 200) {
        setSubmitted(true);
      }

    } catch (error) {
      alert(error.response?.data?.message || "Error submitting form");
    }
  };

  if (submitted) {
    return (
      <div className="successPage">
        <div className="successCard">
          <h2>Application Submitted</h2>
          <p>Your onboarding request has been received.</p>

          <button onClick={() => window.location.reload()}>
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="formContainer">

      <div className="formHeader">
        <h1>Anantya Foundation</h1>
        <p>Volunteer Onboarding Form</p>
      </div>

      <form onSubmit={handleSubmit}>

        <h3 className="sectionTitle">Personal Information</h3>

        <label>Full Name *</label>
        <input
          name="fullname"
          placeholder="Your full name"
          onChange={handleChange}
          required
        />

        <label>Email Address *</label>
        <input
          name="email"
          placeholder="you@example.com"
          onChange={handleChange}
          required
        />

        <div className="infoBox">
          📬 A confirmation email with your Member ID will be sent within 5–10 minutes of successful onboarding.
        </div>

        <label>Date of Birth *</label>

        <input
          type="date"
          name="dob"
          onClick={(e) => e.target.showPicker()}
          onChange={(e) => {

            const dob = e.target.value;

            const age = calculateAge(dob);

            setFormData({
              ...formData,
              dob,
              age
            });

          }}
        />

        <label>Age *</label>
        <input value={formData.age} readOnly placeholder="Auto-calculated"/>

        <label>Gender *</label>

        <select name="gender" onChange={handleChange}>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label>Location *</label>
        <input
          name="location"
          placeholder="City, State"
          onChange={handleChange}
        />

        <label>Phone Number *</label>
        <input
          name="phone_number"
          placeholder="9876543210"
          onChange={handleChange}
        />

        <h3 className="sectionTitle">Professional Details</h3>

        <label>Profession *</label>
        <input
          name="profession"
          placeholder="e.g. Software Engineer"
          onChange={handleChange}
        />

        <label>Place of Profession *</label>
        <input
          name="place_of_profession"
          placeholder="Organisation or Institution"
          onChange={handleChange}
        />

        <h3 className="sectionTitle">Department Preference *</h3>

        <p>Select all that apply.</p>

        <div className="departmentGrid">

          {departmentsList.map((dept) => (

            <button
              type="button"
              key={dept}
              className={`chip ${
                formData.department.includes(dept) ? "activeChip" : ""
              }`}
              onClick={() => toggleDepartment(dept)}
            >
              {dept}
            </button>

          ))}

        </div>

        <h3 className="sectionTitle">Background & Commitment</h3>

        <label>Volunteered before? *</label>

        <div className="radioGroup">

          <label className="radioItem">
            <input
              type="radio"
              name="volunteered_before"
              value="Yes"
              onChange={handleChange}
            />
            Yes
          </label>

          <label className="radioItem">
            <input
              type="radio"
              name="volunteered_before"
              value="No"
              onChange={handleChange}
            />
            No
          </label>

        </div>
<div className="checkboxRow">
  <input
    type="checkbox"
    name="can_attend_events"
    onChange={handleChange}
  />

  <p>I can attend in-person events</p>
</div>

        <h3 className="sectionTitle">Documents</h3>

        <p>Files are uploaded securely.</p>

        <div
  className="uploadBox"
  onClick={() => govRef.current.click()}
>
  {govId ? (
    <span className="uploadedFile">
      ✔ {govId.name}
    </span>
  ) : (
    "⬆ Click to upload Government ID"
  )}

  <input
    ref={govRef}
    type="file"
    accept="image/*,application/pdf"
    onChange={(e) => setGovId(e.target.files[0])}
    hidden
  />
</div>

        <div
  className="uploadBox"
  onClick={() => picRef.current.click()}
>
  {memberPic ? (
    <span className="uploadedFile">
      ✔ {memberPic.name}
    </span>
  ) : (
    "⬆ Click to upload Your Photo"
  )}

  <input
    ref={picRef}
    type="file"
    accept="image/*"
    onChange={(e) => setMemberPic(e.target.files[0])}
    hidden
  />
</div>

        <div className="checkboxRow">
  <input
    type="checkbox"
    name="acknowledgement"
    onChange={handleChange}
  />

  <p>
    I confirm that all information provided is accurate and I agree to uphold
    the values of Anantya Foundation.
  </p>
</div>
        <button className="submitBtn" type="submit">
          Submit Application
        </button>

      </form>

    </div>
  );
};

export default OnboardingForm;