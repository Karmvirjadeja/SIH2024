// import nodemailer from "nodemailer";
// export const sendOTPEmail = async (email, latitude, longitude) => {
//     // Create a transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
      
//       auth: {
//         user: "ph335579@gmail.com", // Replace with your Gmail address
//         pass: "gdyzaikfhyevtjma", // Replace with your Gmail password
//       },
//     });
  
//     const mailOptions = {
//       from: "pearl@saffrony.ac.in",
//       to: email,
//       subject: 'Emergency SOS⚠️⚠️⚠️',
//       text: `Our location is ${latitude} and ${longitude}`,
//     };
  
//     await transporter.sendMail(mailOptions);
//   };

import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, latitude, longitude) => {
  try {
    // Create a transporter with explicit SMTP configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Explicitly define the SMTP host
      port: 587, // Port for secure SSL
      secure: false, // Use SSL
      auth: {
        user: "ph335579@gmail.com", // Your Gmail address
        pass: "gdyzaikfhyevtjma", // Your app-specific password
      },
    });

    const mailOptions = {
      from: "ph335579@gmail.com", // Use the same email as in auth
      to: email,
      subject: "Emergency SOS ⚠️⚠️⚠️",
      text: `Our location is Latitude: ${latitude}, Longitude: ${longitude}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error.message);
    throw error; // Rethrow to handle it further up if needed
  }
};
