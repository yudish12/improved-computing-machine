"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TableSkeletonLoader from "@/components/loaders/table-skeleton";
import { toast } from "sonner";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Search from "@/components/ui/search";
import { Pagination } from "../blogs/_components/Pagination";
import { addUrl, deleteUrl, getUrls, updateUrl } from "@/server/actions/sitemap";

export default function SitemapTable() {
  const [sitemaps, setSitemaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSitemap, setCurrentSitemap] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const limit = 6;

  // Fetch sitemap URLs
  const fetchSitemaps = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getUrls(page,limit);
      
      if(response.success){
        console.log(response.data)
        setSitemaps(response.data);
        setTotalPages(response.totalPages);
      }
      else{
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching sitemaps:", error);
      toast.error("Error fetching sitemaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSitemaps(currentPage);
  }, [currentPage]);

  // Open dialog for adding/editing sitemap
  const openDialog = (sitemap = null) => {
    setCurrentSitemap(sitemap || { url: "", priority: "0.5", changefreq: "weekly" });
    setIsDialogOpen(true);
  };

  // Handle form submission for updating or adding a sitemap
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentSitemap?.url) {
      toast.error("URL is required");
      return;
    }
    console.log(currentSitemap)

    try {
      if (currentSitemap._id) {
        // Updating existing sitemap URL
        const resp = await updateUrl(currentSitemap._id, currentSitemap.url);
        if (resp.success) {
          toast.success("Sitemap updated successfully");
        } else {
          toast.error(resp.message);
        }
      } else {
        // Adding new sitemap URL
        const response = await addUrl(currentSitemap.url);

        if (response.success) {
          toast.success("Sitemap added successfully");
        } else {
          toast.error("Failed to add sitemap");
        }
      }

      setIsDialogOpen(false);
      fetchSitemaps(currentPage);
    } catch (error) {
      console.error("Error submitting sitemap:", error);
      toast.error("Failed to submit sitemap");
    }
  };

  // Handle sitemap deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this sitemap?")) return;

    try {
      const response = await deleteUrl(id);

      if (response.success) {
        toast.success("Sitemap deleted successfully");
        fetchSitemaps(currentPage);
      } else {
        toast.error("Failed to delete sitemap");
      }
    } catch (error) {
      console.error("Error deleting sitemap:", error);
      toast.error("Failed to delete sitemap");
    }
  };

  if (loading) {
    return <TableSkeletonLoader />;
  }

  return (
    <div className="container bg-border overflow-auto mx-auto p-8">
      <Card className="flex justify-between items-center bg-white p-4">
        <h1 className="text-2xl font-bold">Sitemap Management</h1>
        <Button onClick={() => openDialog()}>Add Sitemap</Button>
      </Card>

      <Card className="mt-6 bg-white p-4 border">
        <CardHeader className="flex mb-4 flex-row gap-6">
          <Search value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sitemaps?.map((sitemap, index) => (
              <TableRow key={sitemap._id}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>{sitemap.url}</TableCell>
                <TableCell>{sitemap.lastModified}</TableCell>
               
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={sitemap.url} target="_blank">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" onClick={() => openDialog(sitemap)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(sitemap._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSitemap?._id ? "Edit Sitemap" : "Add Sitemap"}</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            placeholder="Enter URL"
            value={currentSitemap?.url || ""}
            onChange={(e) => setCurrentSitemap({ ...currentSitemap, url: e.target.value })}
            className="w-full border rounded-md p-2 mt-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {currentSitemap?._id ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
