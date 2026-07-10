import { Appointment } from "../models/appointment-patient.js";

//--book appointments--//

const bookAppointments = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("👉 BOOK API HIT");
    console.log("👉 BODY RECEIVED:", req.body);
    console.log("👉 DOCTOR ID:", req.body.doctorId);
    console.log("👉 PATIENT:", req.patient._id);

    const patientId = req.patient._id;

    const { name, age, gender, doctorId, department, date, time } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        message: "Doctor ID is required",
        success: false,
      });
    }

    console.log("doctorId:", doctorId);
    console.log("FULL BODY:", req.body);
console.log("doctorId:", doctorId);

    const appointments = await Appointment.create({
      patientId,
      name,
      age,
      gender,
      doctorId,
      department,
      date,
      time,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      success: true,
      appointments,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error booking appointment",
      success: false,
    });
  }
};

//---get appointment--//

const getAppointment = async (req, res) => {
  try {
    console.log("👉 GET APPOINTMENT API HIT");
    console.log("👉 PATIENT:", req.patient._id);

    const patientId = req.patient._id;

    const appointments = await Appointment.find({ patientId })
      .populate({
        path: "doctorId",
        select: "name email specialization",
      })
      .lean();

    console.log("RAW APPOINTMENTS FROM DB:", appointments);
    console.log(
      "FINAL POPULATED DATA:",
      JSON.stringify(appointments, null, 2)
    );

    res.status(200).json({
      message: "Appointments fetched successfully",
      success: true,
      appointments,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching appointments",
      success: false,
    });
  }
};

//--get reports--//



const updateReport = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No report uploaded.",
      });
    }

    appointment.report = req.file.filename;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Report uploaded successfully",
      report: req.file.filename,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { bookAppointments, getAppointment, updateReport };