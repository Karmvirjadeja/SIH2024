const sendOTPEmail = async (email, otp) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pearl@saffrony.ac.in", // Replace with your Gmail address
        pass: "Basic@123", // Replace with your Gmail password
      },
    });
  
    const mailOptions = {
      from: "pearl@saffrony.ac.in",
      to: email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };
  
    await transporter.sendMail(mailOptions);
  };

