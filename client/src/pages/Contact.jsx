import  { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_2dsxklj",
        "template_fntcqpw",
        formData,
        "bOfdW16Ir7YpLdVGQ"
      )
      .then(
        () => {
          setIsSent(true);
          setFormData({ user_name: "", user_email: "", message: "" });
        },
        (error) => {
          console.error("FAILED...", error);
        }
      );
  };

  return (
    <div className="bg-[#EB662B] py-16 px-4 text-white rounded-md">
      <motion.div
        className="max-w-4xl mx-auto bg-white text-gray-900 rounded-2xl shadow-xl p-8 md:p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#EB662B]">
          Contact Us
        </h2>
        <p className="text-center mb-8">
          We'd love to hear from you! Fill out the form below and we'll get back
          to you shortly.
        </p>
        <form onSubmit={sendEmail} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Your Name</label>
            <input
              type="text"
              name="user_name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
              placeholder="Enter your name"
              value={formData.user_name}
              onChange={(e) =>
                setFormData({ ...formData, user_name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Your Email</label>
            <input
              type="email"
              name="user_email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
              placeholder="Enter your email"
              value={formData.user_email}
              onChange={(e) =>
                setFormData({ ...formData, user_email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Your Message
            </label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
              placeholder="Enter your message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
          </div>
          <div className="text-center">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="bg-[#EB662B] text-white font-semibold px-6 py-3 rounded-lg  transition"
            >
              Send Message
            </motion.button>
            {isSent && (
              <p className="text-green-600 font-medium mt-3">
                Message sent successfully!
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;


// import React, { useRef } from "react";
// // import emailjs from "@emailjs/browser";
// import emailjs from "emailjs-com";


// export default function Contact() {
//   const form = useRef();

//   const sendEmail = (e) => {
//     e.preventDefault();

//     emailjs
//       .sendForm(
//         "service_2dsxklj",       // your service ID
//         "template_fntcqpw",        // your template ID
//         form.current,           // form reference
//         "bOfdW16Ir7YpLdVGQ"          // your public key
//       )
//       .then(
//         () => {
//           alert("Message sent successfully!");
//           form.current.reset();
//         },
//         (error) => {
//           console.error("FAILED...", error);
//           alert("Failed to send message.");
//         }
//       );
//   };

//   return (
//     <form ref={form} onSubmit={sendEmail}>
//       <input type="text" name="user_name" placeholder="Your Name" required />
//       <input type="email" name="user_email" placeholder="Your Email" required />
//       <textarea name="message" placeholder="Your Message" required />
//       <button type="submit">Send Message</button>
//     </form>
//   );
// }
