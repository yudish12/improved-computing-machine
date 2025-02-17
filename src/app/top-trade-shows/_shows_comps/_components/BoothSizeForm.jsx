"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { submitBoothForm } from "@/server/actions/forms";
import InputFile from "@/components/ui/input-file";
import { toast } from "sonner";
import { emailRegex, phoneRegex } from "@/utils/constants/regex";
import { useRouter } from "next/navigation";
const BoothSizeForm = ({ slug, eventName, eventCity, date }) => {
  const [countryCode, setCountryCode] = useState("us");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    budget: "",
    eventName: eventName,
    eventCity: eventCity,
    file: [],
    country: "",
    eventDate: date,
    email: "",
    phone: "",
    boothSize: "",
    message: "",
    url: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle phone number input
  const handlePhoneChange = (value) => {
    const formattedValue = value.startsWith("+") ? value : `+${value}`;
    setFormData({ ...formData, phone: formattedValue });
  };
  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    setLoading(true);
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    // Validate phone number
    const digitCount = formData.phone.length;
    if (!phoneRegex.test(formData.phone) || digitCount < 11) {
      toast.error("Please enter a valid phone number.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const ApiData = new FormData();
      ApiData.append("name", formData.name);
      ApiData.append("email", formData.email);
      ApiData.append("phone", formData.phone);
      ApiData.append("message", formData.message);
      ApiData.append("budget", formData.budget);
      formData.file.forEach((file) => {
        ApiData.append("files", file);
      });
      ApiData.append("company", formData.company);
      ApiData.append("eventName", formData.eventName);
      ApiData.append("eventCity", formData.eventCity);
      ApiData.append("boothSize", formData.boothSize);
      ApiData.append("country", formData.country);
      ApiData.append("url", formData.url);
      ApiData.append("eventDate", formData.eventDate);
      e.preventDefault();
      const resp = await submitBoothForm(ApiData, eventName);
      console.log(resp);
      if (!resp.success) {
        toast.error("Failed to submit form. Please try again later.");
        return;
      }
      router.push("/thank-you");
      toast.success("Enquiry submitted successfully.");

    } catch (error) {
      console.log(error)
      toast.error("Failed to submit form. Please try again later.");
    } finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch("https://api.country.is");
        const data = await response.json();
        if (data && data.country) {
          setCountryCode(data.country.toLowerCase());
        }
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };
    fetchCountryCode();

    setFormData((prevData) => ({
      ...prevData,
      url: `${window.location.origin}/${slug}`,
    }));
  }, []);

  return (
    <div className="shadow h-max bg-white p-6 rounded-xl w-full">
      <h5 className="text-2xl mt-4 text-center font-semibold heading-font text-secondary">
        Enquiry Form
      </h5>
      <div className="mt-4 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-5">
        <div>
          <Input
            className="border-[#CACACA] text-secondary placeholder:text-secondary/70"
            type="text"
            disabled={loading}
            placeholder="Your Name"
            onChange={handleChange}
            name="name"
          />
        </div>
        <div>
          <Input
            className="border-[#CACACA] text-secondary placeholder:text-secondary/70"
            type="text"
            disabled={loading}
            placeholder="Your Company"
            onChange={handleChange}
            name="company"
          />
        </div>
        <div>
          <Input
            className="border-[#CACACA] text-secondary placeholder:text-secondary/70"
            type="email"
            disabled={loading}
            placeholder="Your Email ID"
            onChange={handleChange}
            required
            name="email"
          />
        </div>
        <div>
          <PhoneInput
            country={countryCode}
            value={formData.phone}
            disabled={loading}
            onChange={handlePhoneChange}
          />
        </div>
        <div>
          <Input
            className="border-[#CACACA] text-secondary placeholder:text-secondary/70"
            type="text"
            placeholder="Booth Size"
            disabled={loading}
            onChange={handleChange}
            required
            name="boothSize"
          />
        </div>
        <div>
          <Input
            className="border-[#CACACA] text-secondary placeholder:text-secondary/70"
            type="text"
            placeholder="Budget"
            disabled={loading}
            onChange={handleChange}
            name="budget"
          />
        </div>
        <div>
          <Input
            className="border-[#CACACA] text-secondary placeholder:text-secondary/70"
            type="text"
            disabled={loading}
            placeholder="Your Country Name"
            onChange={handleChange}
            name="country"
          />
        </div>
        {/* <Input
            className="border-secondary/70 text-secondary/70 placeholder:text-secondary/70"
            type="number"
            placeholder="Your Phone Number"

          /> */}
        <div>
          <InputFile value={formData.file} onChange={(e) => setFormData({ ...formData, file: e })} />
        </div>
        <div className="col-span-2 " >
          <textarea
            rows={4}
            style={{ border: "1px solid #CACACA" }}
            className="w-full p-2 placeholder:text-secondary/70 shadow-sm rounded-lg"
            placeholder="Message"
            name="message"
            disabled={loading}
            onChange={handleChange}
          />
        </div>
        <Button
          className="w-1/3 mx-auto col-span-2 bg-primary text-secondary hover:text-black font-semibold py-2 rounded hover:bg-primary "
          onClick={handleSubmit}
          disabled={loading}
        >
          Send Enquiry
          {loading && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>}
        </Button>
      </div>
    </div>
  );
};

export default BoothSizeForm;
