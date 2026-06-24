import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdatePackage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });

  const [images, setImages] = useState([]); // ✅ FIXED
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);

  // GET DATA
useEffect(() => {
  const getPackageData = async () => {
    try {
      const res = await fetch(
        `/api/package/get-package-data/${params?.id}`
      );
      const data = await res.json();

      if (data?.success) {
        setFormData(data.packageData);
      } else {
        toast.error(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (params.id) {
    getPackageData();
  }
}, [params.id]);

  // CHANGE HANDLER
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // FILE HANDLER FIXED
  const handleFile = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const totalImages =
      selectedFiles.length +
      images.length +
      formData.packageImages.length;

    if (totalImages > 10) {
      toast.error("You can only upload 10 images per package");
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "packageImages") {
          form.append(key, value);
        }
      });

      images.forEach((img) => {
        form.append("packageImages", img);
      });

      const res = await fetch(
        `/api/package/update-package/${params?.id}`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      if (data?.success) {
        toast.success("Package updated!");
        navigate(`/package/${params?.id}`);
      } else {
        toast.error(data?.message);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-[60%] space-y-4 p-4 bg-white shadow-md rounded-xl"
      >
        <h1 className="text-xl font-bold text-center">Update Package</h1>

        <input
          id="packageName"
          value={formData.packageName}
          onChange={handleChange}
          className="w-full p-2 border"
          placeholder="Name"
        />

        <textarea
          id="packageDescription"
          value={formData.packageDescription}
          onChange={handleChange}
          className="w-full p-2 border"
          placeholder="Description"
        />

        <input
          type="file"
          multiple
          onChange={handleFile}
          className="w-full"
        />

        <button className="w-full bg-orange-500 text-white p-2">
          {loading ? "Loading..." : "Update Package"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePackage;