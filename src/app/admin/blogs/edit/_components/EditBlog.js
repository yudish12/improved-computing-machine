"use client";
import React, { useState,useEffect } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { updateData } from "@/server/actions/blogs";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@uploadthing/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteUTFiles } from "@/server/services/uploadthing";
import CkeEditor from "@/components/CkEditor";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const EditBlog = ({ singleBlog }) => {
  const [blog, setBlog] = useState(singleBlog);
  const router = useRouter();
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const resp = await updateData(blog._id, {
      title: blog.title,
      slug: blog.slug,
      image: blog.image,
      image_alt_text: blog.image_alt_text,
      body: blog.body,
      meta_title: blog.meta_title,
      meta_description: blog.meta_description,
      meta_keywords: blog.meta_keywords ?? [],
      blog_count: blog.blog_count,
      isDraft : blog.isDraft
    });
    if (!resp.success) {
      toast.error(resp.err);
      return;
    }
    toast.success("Blog updated successfully");
    router.push("/admin/blogs");
  };

  useEffect(() => {
    setBlog({
      ...blog,
      // slug: blog.title.toLowerCase().replaceAll(" ", "-").replace(".", ""),
    })
  },[])

  return (
    <form
      onSubmit={handleEditSubmit}
      className="w-full flex flex-col justify-around gap-y-10"
    >
      <Card className="w-full">
        <CardHeader>
          <CardHeader className="flex flex-row gap-2 items-center">
            <hr className="w-[40%]" />
            <CardTitle className="text-2xl w-[20%] font-bold text-center">
              Edit Page Data
            </CardTitle>
            <hr className="w-[40%]" />
          </CardHeader>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div>
            <Label className="mb-4 block">Title</Label>
            <Input
              className="rounded-sm"
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label className="mb-4 block">Slug</Label>
            <Input
              className="rounded-sm"
              value={blog.slug}
              onChange={(e) =>
                setBlog({
                  ...blog,
                  slug: e.target.value
                })
              }
              title="No spaces, only lowercase letters and dashes"
            />
          </div>
          <div>
            <Label className="mb-4 block">Icon</Label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setBlog({
                  ...blog,
                  image: res[0]?.url || "",
                });
                toast.success("Icon uploaded successfully");
              }}
              onUploadError={(error) =>
                toast.error(`Upload failed: ${error.message}`)
              }
            />
            {blog.image && (
              <div className="relative w-max">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute z-50 top-1 -right-8 w-6 h-6"
                  onClick={() => {
                    console.log(blog.image.split("f/")[1], blog.image);
                    const res = deleteUTFiles([blog.image.split("f/")[1]]);
                    setBlog({
                      ...blog,
                      image: null,
                    });
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <img
                  src={blog.image}
                  alt="Event Icon"
                  className="mt-2 w-16 h-16 rounded"
                />
              </div>
            )}
          </div>
          <div>
            <Label className="mb-4 block">Icon Alt Text</Label>
            <Input
              className="rounded-sm"
              value={blog.image_alt_text}
              onChange={(e) =>
                setBlog({ ...blog, image_alt_text: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-4 block">Blog Count</Label>
            <Input
              className="rounded-sm"
              value={blog.blog_count}
              onChange={(e) => setBlog({ ...blog, blog_count: e.target.value })}
              required
            />
          </div>
          <div>
            <Label className="mb-4 block">Blog Status</Label>
            <Select
              value={blog.isDraft ==="true" ? "true" : "false"} // Convert boolean to string
              onValueChange={(value) =>
                setBlog({
                  ...blog,
                  isDraft: value === "true" ? "true": "false", // Convert string back to boolean
                })
              }
            >
              <SelectTrigger className="rounded-sm border p-2 w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Draft</SelectItem>
                <SelectItem value="false">Publish</SelectItem>
              </SelectContent>
            </Select>
            </div>
          <div className="col-span-2">
            <Label className="mb-4 block">Body</Label>
            <CkeEditor
              value={blog.body}
              onChange={(value) => {
                setBlog({ ...blog, body: value });
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row gap-2 items-center">
          <hr className="w-[40%]" />
          <CardTitle className="text-2xl w-[20%] font-bold text-center">
            Edit SEO Data
          </CardTitle>
          <hr className="w-[40%]" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6">
          <div>
            <Label className="mb-4 block">Meta Title</Label>
            <Input
              className="rounded-sm"
              value={blog.meta_title}
              onChange={(e) => setBlog({ ...blog, meta_title: e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-4 block">Meta Description</Label>
            <Input
              className="rounded-sm"
              value={blog.meta_description}
              onChange={(e) =>
                setBlog({ ...blog, meta_description: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-4 block">Meta Keywords</Label>
            <TagsInput
              value={blog.meta_keywords ?? []}
              onChange={(e) => setBlog({ ...blog, meta_keywords: e })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-end justify-end mb-4 gap-x-4">
        <Button
          type="submit"
          variant="outline"
          className="border-secondary bg-secondary text-white font-semibold px-4 py-4"
        >
          Save Changes
        </Button>
        <Button
          variant="outline"
          className="border-secondary bg-secondary text-white font-semibold px-4 py-4"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditBlog;
