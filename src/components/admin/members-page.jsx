"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { useFaculty } from "@/contexts/faculty-context";

export function MembersPage() {
  // Get faculty data and functions from context
  const {
    faculty,
    loading,
    error,
    fetchFaculty,
    addFacultyMember,
    updateFacultyMember,
    deleteFacultyMember,
  } = useFaculty();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  // Initialize form data for a new faculty member
  const [newFacultyData, setNewFacultyData] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
    type: "faculty",
    quote: "",
    imgUrl: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  // Refresh faculty data on component mount
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  // Show form for adding a new member
  const handleAddMember = () => {
    // In a real app, you would show a modal here
    console.log("Add member button clicked");

    // Example: Add a test member
    const testMember = {
      name: "New Faculty",
      email: "newfaculty@example.com",
      role: "Lecturer",
      status: "active",
      type: "faculty",
      quote: "Excited to join the coding club faculty!",
      imgUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      joinDate: new Date().toISOString().split("T")[0],
    };

    setNewFacultyData(testMember);
    handleSaveFaculty(testMember);
  };

  // Handle editing a faculty member
  const handleEditMember = (member) => {
    console.log("Editing member:", member.name);
    // In a real app, you would populate a form and then call updateFacultyMember
    updateFacultyMember(member.id, {
      ...member,
      role: `${member.role} (Edited)`, // Example edit
    });
  };

  const handleSaveFaculty = async (facultyData) => {
    try {
      await addFacultyMember(facultyData);

      // Reset form after successful save
      setNewFacultyData({
        name: "",
        email: "",
        role: "",
        status: "active",
        type: "faculty",
        quote: "",
        imgUrl: "",
        joinDate: new Date().toISOString().split("T")[0],
      });

      console.log("Faculty saved successfully");
    } catch (error) {
      console.error("Error saving faculty data:", error);
    }
  };

  const handleDeleteMember = (member) => {
    setCurrentMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (currentMember) {
      try {
        await deleteFacultyMember(currentMember.id);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting faculty member:", error);
      }
    }
  };

  // Filter members based on search query
  const filteredMembers = faculty.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {status}
          </Badge>
        );
    }
  };

  // Show loading state
  if (loading) {
    return <div className="text-center py-10">Loading faculty data...</div>;
  }

  // Show error state
  if (error && faculty.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Error loading faculty data: {error}</p>
        <Button
          onClick={fetchFaculty}
          variant="outline"
          size="sm"
          className="mx-auto"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Faculty Members</h2>
        <Button
          variant="default"
          size="default"
          className="px-4 py-2"
          onClick={handleAddMember}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Faculty
        </Button>
      </div>

      <Card className="w-full shadow-sm">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-xl font-semibold">
            All Faculty Members
          </CardTitle>
          <CardDescription className="text-gray-500">
            Manage coding club faculty
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search faculty..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Table className="w-full">
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b">
                <TableHead className="py-3 px-4 text-left">Name</TableHead>
                <TableHead className="py-3 px-4 text-left">Email</TableHead>
                <TableHead className="py-3 px-4 text-left">Role</TableHead>
                <TableHead className="py-3 px-4 text-left">Join Date</TableHead>
                <TableHead className="py-3 px-4 text-left">Status</TableHead>
                <TableHead className="py-3 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-b">
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="py-3 px-4">{member.email}</TableCell>
                  <TableCell className="capitalize py-3 px-4">
                    {member.role}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-3 w-3" />
                      {member.joinDate}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {getStatusBadge(member.status)}
                  </TableCell>
                  <TableCell className="text-right py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          className="px-3 py-2 text-sm cursor-pointer"
                          inset={false}
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="px-3 py-2 text-sm cursor-pointer text-red-600"
                          onClick={() => handleDeleteMember(member)}
                          inset={false}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                        {member.status === "active" ? (
                          <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer"
                            inset={false}
                          >
                            <X className="mr-2 h-4 w-4" /> Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer"
                            inset={false}
                          >
                            <Check className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteMember}
        title="Delete Faculty Member"
        description={`Are you sure you want to delete ${currentMember?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
