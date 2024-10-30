import { useState } from "react";
import "./App.css";
import axios from "axios";
import { toast, Toaster } from "sonner";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    bio: "",
    socialLinks: [""],
    videoLinks: [""],
    profileImage: null,
  });

  // Update form data state for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  // Handle dynamic fields for social and video links
  const handleArrayChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("dob", formData.dob);
    data.append("bio", formData.bio);
    data.append("profileImage", formData.profileImage);
    data.append("socialLinks", JSON.stringify(formData.socialLinks));
    data.append("videoLinks", JSON.stringify(formData.videoLinks));

    try {
      const response = await axios.post(
        `http://localhost:8000/createUser`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData({
        name: "",
        age: "",
        dob: "",
        socialLinks: [""],
        videoLinks: [""],
        bio: "",
        profileImage: null,
      });

      toast.success(response.data.message || "User created successfully..");
    } catch (error) {
      toast.success(error.data.message || "User created successfully..");
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="abs">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="abs">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className="abs">
          <label>Bio:</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </div>

        {/* Social Links */}
        <div className="abs dska">
          <label>Social Links:</label>
          {formData.socialLinks.map((link, index) => (
            <div key={index}>
              <input
                type="url"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => handleArrayChange(e, index, "socialLinks")}
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, "socialLinks")}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField("socialLinks")}>
            Add Social Link
          </button>
        </div>

        {/* Video Links */}
        <div className="abs dska">
          <label>Video Links:</label>
          {formData.videoLinks.map((link, index) => (
            <div key={index}>
              <input
                type="url"
                placeholder="https://example.com/video"
                value={link}
                onChange={(e) => handleArrayChange(e, index, "videoLinks")}
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, "videoLinks")}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField("videoLinks")}>
            Add Video Link
          </button>
        </div>

        <div className="abs">
          <label>Profile Image:</label>
          <input type="file" name="profileImage" onChange={handleFileChange} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
