"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const WebsitePopup = ({ website, eventName }) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
  });

  const router = useRouter();

  const { name, email, phone } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/event-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          websiteUrl: website,
          page_source: eventName,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("website-form", "true");

        // Redirect to thank you page
        router.push(`/thankyou-website/?website=${website}`);
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      toast.error("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          style={{ transitionDuration: "500ms" }}
          className="group cursor-pointer shadow-two hover:bg-[#B0CB1F] bg-white border-secondary/70 p-6 flex items-center gap-5"
        >
          <Image src={"/website-thin.svg"} width={30} height={30} alt="cube" />
          <h4
            style={{ transitionDuration: "500ms" }}
            className="text-secondary text-center text-lg heading-font font-semibold"
          >
            Official Website
          </h4>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 [&>button]:hidden overflow-auto max-h-[500px]">
        <DialogHeader className="bg-primary p-6">
          <DialogTitle className="text-white text-2xl font-bold text-center">
            Register Yourself
          </DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-white hover:opacity-70 transition-opacity"
          >
            <X className="h-6 w-6" />
          </button>
        </DialogHeader>
        <form className="p-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label className="text-base">Name</Label>
              <Input
                onChange={handleChange}
                value={name}
                name="name"
                required
                className="border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Email</Label>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                value={email}
                required
                className="border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Phone</Label>
              <Input
                type="tel"
                name="phone"
                onChange={handleChange}
                value={phone}
                required
                className="border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="Enter your phone number"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-md text-lg font-semibold hover:bg-[#A01830] transition-colors"
            >
              VIEW WEBSITE DETAILS
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WebsitePopup;
