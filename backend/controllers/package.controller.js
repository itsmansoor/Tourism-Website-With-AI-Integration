import Package from "../models/package.model.js";

// ================================
// CREATE PACKAGE
// ================================
export const createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
    } = req.body;

    // ✅ TYPE CONVERSION (IMPORTANT)
    const price = Number(packagePrice);
    const discount = Number(packageDiscountPrice);
    const days = Number(packageDays);
    const nights = Number(packageNights);
    const offer = packageOffer === "true" || packageOffer === true;

    const imageFilenames = req.files?.map((file) => file.filename) || [];

    // ================= VALIDATION =================
    if (
      !packageName ||
      !packageDescription ||
      !packageDestination ||
      !packageAccommodation ||
      !packageTransportation ||
      !packageMeals ||
      !packageActivities ||
      packageOffer === undefined ||
      packagePrice === undefined ||
      packageDiscountPrice === undefined
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }

    if (price <= 0 || discount < 0) {
      return res.status(400).send({
        success: false,
        message: "Price must be greater than 0!",
      });
    }

    if (price < discount) {
      return res.status(400).send({
        success: false,
        message: "Regular price must be greater than discount price!",
      });
    }

    if (days <= 0 || nights <= 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide valid days and nights!",
      });
    }

    // ================= CREATE =================
    const newPackage = await Package.create({
      packageName,
      packageDescription,
      packageDestination,
      packageDays: days,
      packageNights: nights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice: price,
      packageDiscountPrice: discount,
      packageOffer: offer,
      packageImages: imageFilenames,
    });

    return res.status(201).send({
      success: true,
      message: "Package created successfully",
      newPackage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Server error while creating package",
    });
  }
};
// ================================
// GET ALL PACKAGES
// ================================
export const getPackages = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer;

    if (req.query.offer === "true") {
      offer = true;
    } else {
      offer = { $in: [false, true] };
    }

    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const packages = await Package.find({
      $or: [
        {
          packageName: { $regex: searchTerm, $options: "i" },
        },
        {
          packageDestination: { $regex: searchTerm, $options: "i" },
        },
      ],
      packageOffer: offer,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).send({
      success: true,
      packages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ================================
// GET SINGLE PACKAGE
// ================================
export const getPackageData = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found!",
      });
    }

    return res.status(200).send({
      success: true,
      packageData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching package",
    });
  }
};

// ================================
// UPDATE PACKAGE
// ================================
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
    } = req.body;

    const imageFilenames = req.files?.map((file) => file.filename) || [];

    const packageToUpdate = await Package.findById(id);

    if (!packageToUpdate) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    packageToUpdate.packageName =
      packageName ?? packageToUpdate.packageName;

    packageToUpdate.packageDescription =
      packageDescription ?? packageToUpdate.packageDescription;

    packageToUpdate.packageDestination =
      packageDestination ?? packageToUpdate.packageDestination;

    packageToUpdate.packageDays =
      packageDays ?? packageToUpdate.packageDays;

    packageToUpdate.packageNights =
      packageNights ?? packageToUpdate.packageNights;

    packageToUpdate.packageAccommodation =
      packageAccommodation ?? packageToUpdate.packageAccommodation;

    packageToUpdate.packageTransportation =
      packageTransportation ?? packageToUpdate.packageTransportation;

    packageToUpdate.packageMeals =
      packageMeals ?? packageToUpdate.packageMeals;

    packageToUpdate.packageActivities =
      packageActivities ?? packageToUpdate.packageActivities;

    packageToUpdate.packagePrice =
      packagePrice ?? packageToUpdate.packagePrice;

    packageToUpdate.packageDiscountPrice =
      packageDiscountPrice ?? packageToUpdate.packageDiscountPrice;

    packageToUpdate.packageOffer =
      packageOffer !== undefined
        ? packageOffer
        : packageToUpdate.packageOffer;

    if (imageFilenames.length > 0) {
      packageToUpdate.packageImages = imageFilenames;
    }

    await packageToUpdate.save();

    return res.status(200).send({
      success: true,
      message: "Package updated successfully",
    });
  } catch (error) {
    console.log("Update error:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating package",
    });
  }
};

// ================================
// DELETE PACKAGE
// ================================
export const deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error deleting package",
    });
  }
};


