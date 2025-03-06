"use client";

import { useState } from "react";
import axios from "axios";
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

export function MembersPage() {
  //   const [members, setMembers] = useState([
  //     {
  //       id: 1,
  //       name: "John Doe",
  //       email: "john.doe@example.com",
  //       role: "Computer Science Professor & Head of Department",
  //       discription: "active",
  //       imgUrl: "https://any.imgurl.com",
  //     },
  //     {
  //       id: 2,
  //       name: "Jane Smith",
  //       email: "jane.smith@example.com",
  //       role: "Asssiant Professor",
  //       discription: "active",
  //       imgUrl: "https://any.imgurl.com",
  //     },
  //     {
  //       id: 3,
  //       name: "Alex Johnson",
  //       email: "alex.johnson@example.com",
  //       role: "Computer Science Major",
  //       discription: "active",
  //       imgUrl: "https://any.imgurl.com",
  //     },
  //     {
  //       id: 4,
  //       name: "Sam Wilson",
  //       email: "sam.wilson@example.com",
  //       role: "Assistant Professor",
  //       discription: "inactive",
  //       imgUrl: "https://any.imgurl.com",
  //     },
  //     {
  //       id: 5,
  //       name: "Taylor Brown",
  //       email: "taylor.brown@example.com",
  //       role: "Assistant Professor",
  //       discription: "pending",
  //       imgUrl: "https://any.imgurl.com",
  //     },
  //   ]);

  const [addFacultyData, setAddFacultyData] = useState({
    name: "",
    email: "",
    role: "",
    discription: "",
    imgUrl: "",
  });

  const saveFacultyDataInDB = async () => {
    //save data in DB
    try {
      const response = await axios.post("/api/faculty", addFacultyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Faculty saved successfully:", response.data);

      // Reset form after successful save
      setAddFacultyData({
        name: "",
        email: "",
        role: "",
        discription: "",
        imgUrl: "",
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error saving faculty data:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const handleDeleteMember = (member) => {
    setCurrentMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMember = () => {
    if (currentMember) {
      setMembers(members.filter((member) => member.id !== currentMember.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredMembers = members.filter(
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Members</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>Manage coding club members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-3 w-3" />
                      {member.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMember(member)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                        {member.status === "active" ? (
                          <DropdownMenuItem>
                            <X className="mr-2 h-4 w-4" /> Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
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
        title="Delete Member"
        description={`Are you sure you want to delete ${currentMember?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
