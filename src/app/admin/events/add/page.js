"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import "../../../globals.css";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import CkeEditor from "@/components/CkEditor";
import { addData } from "@/server/actions/events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { majorExhibitingCities } from "../../cities";

const AddEventPage = () => {
  const [singleEvent, setSingleEvent] = React.useState({
    event_name: "",
    title: "",
    slug: "",
    body: "",
    start_date: "",
    end_date: "",
    country: "USA",
    city: "",
    icon: "",
    icon_alt_text: "",
    meta_title: "",
    meta_description: "",
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await addData(singleEvent);
      if (!resp.success) {
        toast.error(resp.err);
        return;
      }
      toast.success("Event added successfully");
      setSingleEvent({
        event_name: "",
        title: "",
        slug: "",
        body: "",
        start_date: "",
        end_date: "",
        country: "",
        city: "",
        icon: "",
        icon_alt_text: "",
        meta_title: "",
        meta_description: "",
      });
    } catch (error) {
      toast.error("Failed to add event");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start overflow-auto min-h-screen bg-gray-200 p-8 gap-y-6 w-full">
      <form
        onSubmit={handleAddSubmit}
        className="w-full flex flex-col gap-y-10"
      >
        <Card className="w-full">
          <CardHeader className="flex flex-row gap-2 items-center">
            <hr className="w-[40%]" />
            <CardTitle className="text-2xl w-[20%] font-bold text-center">
              Add Page Data
            </CardTitle>
            <hr className="w-[40%]" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <Label className="mb-4 block">Event Name</Label>
              <Input
                className="rounded-sm"
                value={singleEvent.event_name}
                onChange={(e) =>
                  setSingleEvent({ ...singleEvent, event_name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-4 block">Slug</Label>
              <Input
                className="rounded-sm"
                value={singleEvent.slug}
                onChange={(e) =>
                  setSingleEvent({ ...singleEvent, slug: e.target.value })
                }
                required
                pattern="^[a-z0-9-]+$"
                title="No spaces, only lowercase letters and dashes"
              />
            </div>
            <div>
              <Label className="mb-4 block">Country</Label>
              <Input
                className="rounded-sm"
                value={singleEvent.country}
                onChange={(e) =>
                  setSingleEvent({ ...singleEvent, country: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-4 block">City</Label>
              <Select
                onChange={(e) => setSingleEvent({ ...singleEvent, city: e })}
              >
                <SelectTrigger>Select a city</SelectTrigger>
                <SelectContent>
                  {majorExhibitingCities.map((city, index) => (
                    <SelectItem key={index} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-4 block">Icon</Label>
              <UploadButton
                className="ut-label:bg-black"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setSingleEvent({
                    ...singleEvent,
                    icon: res[0]?.url || "",
                  });
                  toast.success("Icon uploaded successfully");
                }}
                onUploadError={(error) =>
                  toast.error(`Upload failed: ${error.message}`)
                }
              />
              {singleEvent.icon && (
                <img
                  src={singleEvent.icon}
                  alt="Event Icon"
                  className="mt-2 w-16 h-16 object-cover rounded"
                />
              )}
            </div>
            <div>
              <Label className="mb-4 block">Icon Alt Text</Label>
              <Input
                className="rounded-sm"
                value={singleEvent.icon_alt_text}
                onChange={(e) =>
                  setSingleEvent({
                    ...singleEvent,
                    icon_alt_text: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-4 block">Start Date</Label>
              <Input
                className="rounded-sm"
                type="date"
                value={singleEvent.start_date}
                onChange={(e) =>
                  setSingleEvent({ ...singleEvent, start_date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-4 block">End Date</Label>
              <Input
                className="rounded-sm"
                type="date"
                min={singleEvent.start_date}
                value={singleEvent.end_date}
                onChange={(e) =>
                  setSingleEvent({ ...singleEvent, end_date: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <Label className="mb-2 block">Title</Label>
              <Input
                className="rounded-sm"
                value={singleEvent.title}
                onChange={(e) =>
                  setSingleEvent({ ...singleEvent, title: e.target.value })
                }
                required
              />
            </div>
            <div className="col-span-2">
              <Label className="mb-4 block">Body</Label>
              <CkeEditor
                value={singleEvent.body}
                onChange={(value) => {
                  setSingleEvent({ ...singleEvent, body: value });
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row gap-2 items-center">
            <hr className="w-[40%]" />
            <CardTitle className="text-2xl w-[20%] font-bold text-center">
              Add SEO Data
            </CardTitle>
            <hr className="w-[40%]" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <Label className="mb-4 block">Meta Title</Label>
              <Input
                className="rounded-sm"
                value={singleEvent.meta_title}
                onChange={(e) =>
                  setSingleEvent({ ...singleEvent, meta_title: e.target.value })
                }
                required
              />
            </div>
            <div className="col-span-2">
              <Label className="mb-4 block">Meta Description</Label>
              <Input
                className="rounded-sm"
                value={singleEvent.meta_description}
                onChange={(e) =>
                  setSingleEvent({
                    ...singleEvent,
                    meta_description: e.target.value,
                  })
                }
                required
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4 mb-4 ">
          <Button
            type="submit"
            className="bg-secondary hover:bg-secondary text-white hover:text-white font-semibold px-4 py-2"
          >
            Add Event
          </Button>
          <Button
            variant="outline"
            className="border-secondary text-secondary font-semibold px-4 py-2"
          >
            Save Draft
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEventPage;
