"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "./_components/Pagination";

const BlogsPagination = ({ blogs }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6; // Number of blogs per page
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [loading, setLoading] = useState(false);

  const actionCallforPagination = async () => {
    //fetch blogs from server action
  };

  useEffect(() => {
    actionCallforPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="bg-[url('/blog-hero-bg-small.png')] bg-cover bg-no-repeat px-20 text-white gap-4 h-[300px] justify-center items-center flex flex-col">
        <Image
          src={"/Book-open.png"}
          width={60}
          height={60}
          alt="location-bg"
          className="object-cover"
        />
        <h3 className="text-white heading-font text-[2.35rem] font-bold">
          BLOG
        </h3>
      </div>

      <div className="px-20 py-10 flex flex-col items-center justify-center bg-background  ">
        <h2 className="text-xl text-[#B0CB1F] font-bold pt-[60px] pb-10  ">
          Blog Directory
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {paginatedBlogs.map((blog, index) => (
            <Card
              key={index}
              className="flex flex-col bg-white/60 h-[230px] md:flex-row items-start shadow-two rounded-lg overflow-hidden py-2 "
            >
              <div className="md:w-[45%] h-full p-4 ">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  width={500}
                  height={350}
                  className="w-full h-full object-cover  rounded-lg  "
                  priority
                />
              </div>

              {/* Text */}
              <div className="md:w-[55%] h-full p-4 flex flex-col ">
                <CardTitle className="text-2xl font-bold text-secondary heading-font">
                  {blog.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-2">
                  {blog.description}
                </CardDescription>
                <div className="mt-4">
                  <Link href={`/blogs/${index}`}>
                    <Button
                      variant="outline"
                      className="text-secondary font-bold bg-transparent border-2 border-secondary hover:bg-secondary hover:text-white"
                    >
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default BlogsPagination;
