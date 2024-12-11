import nodemailer from "nodemailer";
export const sendOTPEmail = async (email, latitude, longitude) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "ph335579@gmail.com", // Replace with your Gmail address
        pass: "gdyzaikfhyevtjma", // Replace with your Gmail password
      },
    });
  
    const mailOptions = {
      from: "pearl@saffrony.ac.in",
      to: email,
      subject: 'Emergency SOS⚠️⚠️⚠️',
      text: `Our location is ${latitude} and ${longitude}`,
    };
  
    await transporter.sendMail(mailOptions);
  };

