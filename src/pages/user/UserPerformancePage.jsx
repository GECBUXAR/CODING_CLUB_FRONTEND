import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserPerformanceDashboard from "@/components/exams/UserPerformanceDashboard";
import { userService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UserPerformancePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = user?.role === "admin";
  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // If no userId is provided or it's the current user's profile
        if (isOwnProfile) {
          setUserData(user);
          setLoading(false);
          return;
        }

        // If admin is viewing another user's performance
        if (isAdmin && userId) {
          const response = await userService.getUserById(userId);
          if (response.success) {
            setUserData(response.data);
          } else {
            setError(response.error || "Failed to fetch user data");
          }
        } else {
          // Not admin and trying to view someone else's performance
          setError("You don't have permission to view this user's performance");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, user, isAdmin, isOwnProfile]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No user data
  if (!userData) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested user could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {isOwnProfile ? "My Performance" : `${userData.name}'s Performance`}
        </h1>
        <p className="text-muted-foreground">
          {isOwnProfile
            ? "View your exam performance and analytics"
            : `View ${userData.name}'s exam performance and analytics`}
        </p>
      </div>

      <UserPerformanceDashboard userId={userId} />
    </div>
  );
};

export default UserPerformancePage;
