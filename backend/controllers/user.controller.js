import prisma from '../config/db.js';

// Generate mock OTP (for now)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 📌 Request OTP
export const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    const otp = generateOTP();

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone, otp },
      });
    } else {
      user = await prisma.user.update({
        where: { phone },
        data: { otp },
      });
    }

    // TODO: integrate SMS provider (for now return OTP in response)
    res.json({ message: "OTP sent", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await prisma.user.update({
      where: { phone },
      data: { otp: null },
    });

    // TODO: generate JWT here
    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
